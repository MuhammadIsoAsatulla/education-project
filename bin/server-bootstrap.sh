#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
#  MEROS — Phase A server bootstrap
#
#  Runs once on a fresh Ubuntu 24.04 VPS (as root) to install everything we
#  need: Node 20, nginx, certbot, git, build-essential, fail2ban,
#  unattended-upgrades, UFW. Also creates the `meros` deploy user and copies
#  root's SSH key over so you can log in as that user.
#
#  Idempotent — safe to re-run. Does NOT enable the firewall or disable root
#  SSH automatically; those are manual steps after verifying `meros` login
#  works (printed at the end).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "ERROR: this script must run as root. Try: sudo bash $0"
  exit 1
fi

export DEBIAN_FRONTEND=noninteractive

step() { printf "\n\033[1;36m==>\033[0m \033[1m%s\033[0m\n" "$*"; }
ok()   { printf "    \033[32m✓\033[0m %s\n" "$*"; }
warn() { printf "    \033[33m!\033[0m %s\n" "$*"; }

# ─────────────────────────────────────────────────────────────────────────────
step "1/8  System update"
apt-get update -qq
apt-get upgrade -y -qq
ok "system packages up to date"

# ─────────────────────────────────────────────────────────────────────────────
step "2/8  Base runtime stack"
apt-get install -y -qq \
  curl git build-essential \
  nginx \
  fail2ban \
  unattended-upgrades \
  ufw \
  sqlite3
ok "nginx, fail2ban, ufw, sqlite3, build tools installed"

# ─────────────────────────────────────────────────────────────────────────────
step "3/8  Node.js 20 LTS"
if command -v node >/dev/null && node --version | grep -q '^v20\.'; then
  ok "Node $(node --version) already installed"
else
  curl -fsSL https://deb.nodesource.com/setup_20.x | bash - >/dev/null
  apt-get install -y -qq nodejs
  ok "installed Node $(node --version) / npm $(npm --version)"
fi

# ─────────────────────────────────────────────────────────────────────────────
step "4/8  Certbot (Let's Encrypt)"
apt-get install -y -qq certbot python3-certbot-nginx
ok "certbot installed (use it later when you have a domain)"

# ─────────────────────────────────────────────────────────────────────────────
step "5/8  Deploy user 'meros'"
if id -u meros >/dev/null 2>&1; then
  ok "user 'meros' already exists"
else
  useradd -m -s /bin/bash -G sudo meros
  ok "user 'meros' created and added to sudo group"
fi

# Passwordless sudo for meros — convenient for deploys (systemctl, nginx -t).
# SSH is key-only, so this doesn't widen the attack surface much.
echo "meros ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/meros
chmod 440 /etc/sudoers.d/meros
ok "passwordless sudo enabled for 'meros'"

# ─────────────────────────────────────────────────────────────────────────────
step "6/8  Copy SSH key from root to meros"
if [[ -s /root/.ssh/authorized_keys ]]; then
  install -d -m 700 -o meros -g meros /home/meros/.ssh
  cp /root/.ssh/authorized_keys /home/meros/.ssh/authorized_keys
  chown meros:meros /home/meros/.ssh/authorized_keys
  chmod 600 /home/meros/.ssh/authorized_keys
  ok "SSH key copied — you can now 'ssh meros@<server>' with the same key"
else
  warn "/root/.ssh/authorized_keys is empty or missing"
  warn "you'll need to add your public key to /home/meros/.ssh/authorized_keys manually"
fi

# ─────────────────────────────────────────────────────────────────────────────
step "7/8  App directories"
install -d -m 755 -o meros -g meros /srv/meros
install -d -m 750 -o meros -g meros /var/lib/meros
install -d -m 755 -o meros -g meros /var/backups/meros
ok "created /srv/meros (web root), /var/lib/meros (sqlite db), /var/backups/meros"

# ─────────────────────────────────────────────────────────────────────────────
step "8/8  Firewall rules (NOT enabling yet)"
ufw --force default deny incoming
ufw --force default allow outgoing
ufw allow OpenSSH    >/dev/null
ufw allow 'Nginx Full' >/dev/null
ok "UFW rules staged for SSH (22), HTTP (80), HTTPS (443)"
warn "UFW is NOT enabled yet — enable manually after verifying 'meros' login works"

# ─────────────────────────────────────────────────────────────────────────────
# Auto-security-updates
cat > /etc/apt/apt.conf.d/20auto-upgrades <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Unattended-Upgrade "1";
EOF
ok "unattended-upgrades enabled (daily security patches)"

# fail2ban runs out of the box for SSH brute-force protection
systemctl enable --now fail2ban >/dev/null 2>&1 || true
ok "fail2ban active (SSH brute-force protection)"

# ─────────────────────────────────────────────────────────────────────────────
PUBLIC_IP="$(curl -s --max-time 4 ifconfig.me || echo 'unknown')"

cat <<SUMMARY

╔════════════════════════════════════════════════════════════════════╗
║                Phase A bootstrap complete  ✓                       ║
╚════════════════════════════════════════════════════════════════════╝

  Server:        $(lsb_release -ds 2>/dev/null || echo 'Ubuntu')
  Public IP:     ${PUBLIC_IP}
  Node:          $(node --version)
  Nginx:         $(nginx -v 2>&1 | sed 's/.*\///')
  Deploy user:   meros (passwordless sudo, SSH key copied from root)
  Web root:      /srv/meros
  Database dir:  /var/lib/meros
  Backups dir:   /var/backups/meros

────────────────────────────────────────────────────────────────────
  Manual next steps — do these in order:
────────────────────────────────────────────────────────────────────

  1. FROM YOUR LAPTOP, verify meros login works:

       ssh meros@${PUBLIC_IP}

     If it lands you in 'meros@hostkey...:~\$' WITHOUT a password,
     you're good. If not, fix that BEFORE step 2 or you'll lock
     yourself out.

  2. BACK ON THE SERVER, enable the firewall:

       sudo ufw enable
       sudo ufw status

  3. (Optional but recommended) Lock down SSH:

       sudo sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
       sudo sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config
       sudo systemctl reload ssh

  4. You're ready for Phase B (deploy the MEROS site).
     Tell Claude when steps 1–3 are done.

SUMMARY
