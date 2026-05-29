# MEROS — Hostkey VPS deploy recipe

Target architecture (all on one box):

```
Internet → DNS → nginx :443
                  ├─ /             → /srv/meros/dist/   (SPA + static media)
                  └─ /api/*        → http://127.0.0.1:3000 (Express + SQLite)
```

Both pieces run from the same `/srv/meros` checkout. Backend state lives at
`/var/lib/meros/meros.db`.

---

## 0. First-time prereqs (run once)

```bash
# On the VPS as root (or sudo)
apt update && apt upgrade -y
apt install -y curl git build-essential nginx certbot python3-certbot-nginx ufw fail2ban
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
ufw allow OpenSSH && ufw allow 'Nginx Full' && ufw enable

# Non-root deploy user
adduser meros
usermod -aG sudo meros
mkdir -p /srv/meros /var/lib/meros /var/backups/meros
chown meros:meros /srv/meros /var/lib/meros /var/backups/meros
```

Switch to the `meros` user for everything below.

---

## 1. Clone + first build

```bash
cd /srv/meros
git clone https://github.com/<you>/meros.git .

# Frontend
npm ci
npm run build

# Backend
cd server
npm ci
cd ..
```

If GitHub is blocked from your region, push from your laptop with `scp -r`:

```bash
scp -r ./education-project meros@<VPS_IP>:/srv/meros
```

---

## 2. Server env file

```bash
cp server/.env.example server/.env
nano server/.env
```

Fill in:

- `JWT_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"`
- `GOOGLE_CLIENT_ID` — from Google Cloud Console (same one the frontend uses)
- Leave `DB_PATH=/var/lib/meros/meros.db` and `PORT=3000`

For the frontend, edit `.env.production` (or pass via build env) with:

```
VITE_GOOGLE_CLIENT_ID=<same client ID>
```

The Authorized JavaScript Origins in Google Cloud Console must include
`https://<your-domain>`.

---

## 3. systemd service

`/etc/systemd/system/meros-api.service`:

```ini
[Unit]
Description=MEROS API (Express + SQLite)
After=network.target

[Service]
Type=simple
User=meros
Group=meros
WorkingDirectory=/srv/meros/server
EnvironmentFile=/srv/meros/server/.env
ExecStart=/usr/bin/node index.js
Restart=on-failure
RestartSec=3
# Hardening — the service only needs read on /srv/meros and write on /var/lib/meros.
ProtectSystem=strict
ReadWritePaths=/var/lib/meros
NoNewPrivileges=true
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

Enable + start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now meros-api
sudo systemctl status meros-api
journalctl -u meros-api -f
```

Verify locally: `curl http://127.0.0.1:3000/api/health` → `{ "ok": true, ... }`.

---

## 4. nginx site

`/etc/nginx/sites-available/meros`:

```nginx
server {
  listen 80;
  server_name meros.website www.meros.website;
  root /srv/meros/dist;
  index index.html;

  # SPA fallback
  location / {
    try_files $uri $uri/ /index.html;
  }

  # Long-cache hashed assets, no-cache the index
  location /assets/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }
  location = /index.html {
    add_header Cache-Control "no-cache";
  }

  # gzip
  gzip on;
  gzip_types text/css application/javascript application/json image/svg+xml;
  gzip_min_length 1024;

  # Backend proxy
  location /api/ {
    proxy_pass http://127.0.0.1:3000;
    proxy_http_version 1.1;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}
```

Activate:

```bash
sudo ln -s /etc/nginx/sites-available/meros /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl reload nginx
```

Issue SSL (only after DNS A records point at the VPS):

```bash
sudo certbot --nginx -d meros.website -d www.meros.website
```

Certbot rewrites the file to add port 443 + redirect 80 → 443. Auto-renew is
already scheduled via certbot's own timer.

---

## 5. Deploy script

`bin/deploy.sh`:

```bash
#!/bin/bash
set -e
cd /srv/meros
git pull --ff-only
npm ci
npm run build
(cd server && npm ci)
sudo systemctl restart meros-api
sudo nginx -t && sudo systemctl reload nginx
echo "deployed at $(date -Iseconds)"
```

```bash
chmod +x bin/deploy.sh
```

Re-deploy from your laptop:

```bash
ssh meros@<VPS_IP> 'cd /srv/meros && ./bin/deploy.sh'
```

---

## 6. Daily backups

Cron entry (`crontab -e` as `meros`):

```
30 3 * * * sqlite3 /var/lib/meros/meros.db ".backup /var/backups/meros/meros-$(date +\%F).db" && find /var/backups/meros -name 'meros-*.db' -mtime +14 -delete
```

---

## 7. Verification checklist

After each deploy:

1. `curl https://meros.website/api/health` → 200, `{ "ok": true }`.
2. `journalctl -u meros-api -n 50 --no-pager` → no errors.
3. Sign in with Google in the browser → profile page shows your Google name +
   picture.
4. Earn 50 points → reload → points persist.
5. Sign in with the same Google in a different browser → same 50 points.
6. Visit `/foydalanuvchilar/<your_uid>` from an incognito window → public
   profile renders without auth.
7. Sign in with a *different* Google account → follow the first user from the
   second account → first account sees +1 follower on their public profile.
8. Post a comment on any alloma page → refresh → comment persists across
   browsers.
9. `sqlite3 /var/lib/meros/meros.db ".tables"` → lists `users`, `follows`,
   `comments`, `comment_likes`.
10. `sqlite3 /var/lib/meros/meros.db "SELECT COUNT(*) FROM users;"` → matches
    the number of distinct accounts that signed in.

---

## 8. Rollback

```bash
cd /srv/meros
git log --oneline -10            # find the last good commit
git reset --hard <SHA>
./bin/deploy.sh
```

Data in `/var/lib/meros/meros.db` is independent of the checkout and survives
rollbacks. If the schema changed and you need to roll back the data too:

```bash
sudo systemctl stop meros-api
cp /var/backups/meros/meros-<DATE>.db /var/lib/meros/meros.db
sudo systemctl start meros-api
```
