export default function OrnamentDivider({ className = '' }) {
  return (
    <svg
      viewBox="0 0 200 40"
      xmlns="http://www.w3.org/2000/svg"
      className={`w-[200px] h-10 mx-auto ${className}`}
      aria-hidden="true"
    >
      <g fill="none" stroke="#d4a574" strokeWidth="1">
        <line x1="0" y1="20" x2="70" y2="20" />
        <line x1="130" y1="20" x2="200" y2="20" />
        <circle cx="100" cy="20" r="8" />
        <circle cx="100" cy="20" r="4" />
        <path d="M85 20 L100 5 L115 20 L100 35 Z" />
      </g>
    </svg>
  );
}
