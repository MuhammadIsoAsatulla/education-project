export default function RegistanSilhouette({ className = '' }) {
  return (
    <div className={`absolute bottom-0 left-0 right-0 h-[280px] z-[1] pointer-events-none ${className}`}>
      <svg
        viewBox="0 0 1440 280"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full block"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="silGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#0a1f2e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#0a1f2e" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path
          d="M0,280 L0,180 L80,180 L80,140 L100,140 L110,100 L130,100 L130,80 L150,60 L170,80 L170,100 L190,100 L200,140 L220,140 L220,180 L260,180 L260,160 L280,160 L280,280 Z"
          fill="url(#silGrad)"
        />
        <path
          d="M280,280 L280,160 L340,160 L340,140 L360,140 L370,80 L380,80 L380,40 L400,20 L420,40 L420,80 L430,80 L440,140 L460,140 L460,160 L520,160 L520,280 Z"
          fill="url(#silGrad)"
        />
        <path
          d="M520,280 L520,170 L580,170 L580,140 L600,140 L610,100 L630,100 L630,70 L650,50 L670,70 L670,100 L690,100 L700,140 L720,140 L720,170 L780,170 L780,280 Z"
          fill="url(#silGrad)"
        />
        <path
          d="M780,280 L780,200 L860,200 L860,160 L880,160 L890,120 L910,120 L910,90 L930,70 L950,90 L950,120 L970,120 L980,160 L1000,160 L1000,200 L1080,200 L1080,280 Z"
          fill="url(#silGrad)"
        />
        <path
          d="M1080,280 L1080,210 L1160,210 L1160,180 L1180,180 L1190,140 L1210,140 L1210,110 L1230,90 L1250,110 L1250,140 L1270,140 L1280,180 L1300,180 L1300,210 L1380,210 L1380,280 Z"
          fill="url(#silGrad)"
        />
        <path d="M1380,280 L1380,220 L1440,220 L1440,280 Z" fill="url(#silGrad)" />
        <ellipse cx="150" cy="55" rx="22" ry="18" fill="url(#silGrad)" />
        <ellipse cx="400" cy="15" rx="28" ry="22" fill="url(#silGrad)" />
        <ellipse cx="650" cy="45" rx="22" ry="18" fill="url(#silGrad)" />
        <ellipse cx="930" cy="65" rx="22" ry="18" fill="url(#silGrad)" />
        <ellipse cx="1230" cy="85" rx="22" ry="18" fill="url(#silGrad)" />
        <line x1="150" y1="55" x2="150" y2="20" stroke="#0a1f2e" strokeWidth="2" />
        <line x1="400" y1="15" x2="400" y2="-15" stroke="#0a1f2e" strokeWidth="2.5" />
        <line x1="650" y1="45" x2="650" y2="10" stroke="#0a1f2e" strokeWidth="2" />
        <line x1="930" y1="65" x2="930" y2="30" stroke="#0a1f2e" strokeWidth="2" />
        <line x1="1230" y1="85" x2="1230" y2="50" stroke="#0a1f2e" strokeWidth="2" />
      </svg>
    </div>
  );
}
