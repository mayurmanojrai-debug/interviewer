/**
 * Backdrop scene for the split login layout: hands typing on a laptop at a
 * warm desk. Drawn inline in SVG so it always renders and can be colour-graded
 * to match the overlay copy that sits on top of it.
 *
 * Layers, back to front:
 *   1. warm room gradient + blurred window light
 *   2. desk surface
 *   3. laptop screen (soft focus)
 *   4. laptop deck + key rows
 *   5. hands, forearms and a rolled sleeve
 *   6. notebook in the foreground
 *   7. colour grade + vignette
 */
export default function HandsTyping({ className = 'split-photo' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 1200 900"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      role="presentation"
    >
      <defs>
        <linearGradient id="room" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#6b5b45" />
          <stop offset="42%" stopColor="#3a3128" />
          <stop offset="100%" stopColor="#1a1512" />
        </linearGradient>
        <radialGradient id="windowGlow" cx="0.46" cy="0.12" r="0.55">
          <stop offset="0%" stopColor="#fff6e2" stopOpacity="0.95" />
          <stop offset="60%" stopColor="#e8d8b8" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#e8d8b8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screen" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#dfe7ea" />
          <stop offset="55%" stopColor="#aab6bd" />
          <stop offset="100%" stopColor="#79858c" />
        </linearGradient>
        <linearGradient id="deck" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#8d8c8a" />
          <stop offset="100%" stopColor="#4a4846" />
        </linearGradient>
        <linearGradient id="skinH" x1="0.1" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#e8c3a0" />
          <stop offset="55%" stopColor="#c9996f" />
          <stop offset="100%" stopColor="#9b6f4c" />
        </linearGradient>
        <linearGradient id="sleeve" x1="0.2" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#c9a678" />
          <stop offset="55%" stopColor="#a2814f" />
          <stop offset="100%" stopColor="#6d5334" />
        </linearGradient>
        <linearGradient id="book" x1="0.1" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#5b5248" />
          <stop offset="100%" stopColor="#2a2521" />
        </linearGradient>
        <linearGradient id="grade" x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#3a2c1e" stopOpacity="0.28" />
          <stop offset="50%" stopColor="#241c14" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#0e0b08" stopOpacity="0.72" />
        </linearGradient>
        <radialGradient id="vig" cx="0.5" cy="0.45" r="0.72">
          <stop offset="55%" stopColor="#000000" stopOpacity="0" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.55" />
        </radialGradient>

        <filter id="soft" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="7" />
        </filter>
        <filter id="softer" x="-25%" y="-25%" width="150%" height="150%">
          <feGaussianBlur stdDeviation="16" />
        </filter>
      </defs>

      {/* 1. room + window light */}
      <rect width="1200" height="900" fill="url(#room)" />
      <rect width="1200" height="900" fill="url(#windowGlow)" />
      <g filter="url(#softer)" opacity="0.55">
        <rect x="300" y="-40" width="470" height="270" rx="8" fill="#fff3dc" />
        <rect x="300" y="70" width="470" height="12" fill="#5c4d38" />
        <rect x="300" y="160" width="470" height="12" fill="#5c4d38" />
      </g>

      {/* 2. desk */}
      <path d="M0 690 C260 660 720 648 1200 664 L1200 900 L0 900 Z" fill="#3b3026" />
      <path d="M0 690 C260 660 720 648 1200 664 L1200 900 L0 900 Z" fill="#000" opacity="0.18" />

      {/* 3. laptop screen, slightly out of focus */}
      <g filter="url(#soft)">
        <path d="M690 150 L1170 236 L1170 470 L672 404 Z" fill="url(#screen)" />
        <path d="M690 150 L1170 236 L1170 258 L689 172 Z" fill="#ffffff" opacity="0.4" />
      </g>

      {/* 4. laptop deck + keys */}
      <g>
        <path d="M620 452 L1176 512 L1236 700 L596 646 Z" fill="url(#deck)" />
        <path d="M620 452 L1176 512 L1180 528 L616 468 Z" fill="#ffffff" opacity="0.18" />
        <g stroke="#3d3b39" strokeWidth="4" opacity="0.55" fill="none">
          <path d="M646 498 L1150 552" />
          <path d="M638 530 L1160 584" />
          <path d="M630 562 L1170 616" />
          <path d="M622 594 L1180 648" />
        </g>
        <g stroke="#2f2d2b" strokeWidth="3" opacity="0.4">
          <path d="M700 490 L676 640" />
          <path d="M790 500 L766 650" />
          <path d="M880 510 L856 660" />
          <path d="M970 520 L946 670" />
          <path d="M1060 530 L1036 680" />
        </g>
      </g>
      {/* 5. forearms, rolled sleeve and hands */}
      <g>
        {/* left forearm + rolled sleeve cuff */}
        <path d="M-40 300 C120 320 250 372 330 452 L246 512 C176 452 70 414 -40 406 Z" fill="url(#sleeve)" />
        <path d="M246 512 L330 452 L356 486 L272 548 Z" fill="#c3a179" />
        <path d="M262 500 L344 442" stroke="#8a6d43" strokeWidth="5" opacity="0.6" fill="none" />

        {/* right forearm */}
        <path d="M1240 372 C1150 396 1074 438 1028 496 L1112 546 C1152 494 1206 458 1240 448 Z" fill="url(#sleeve)" />

        {/* left hand over the keyboard */}
        <g transform="translate(636,398) rotate(-7)">
          <rect x="-30" y="-10" width="216" height="92" rx="44" fill="url(#skinH)" />
          <rect x="-16" y="-24" width="96" height="52" rx="26" fill="url(#skinH)" />
          <g fill="url(#skinH)">
            <rect x="4" y="58" width="36" height="96" rx="18" transform="rotate(-6 22 106)" />
            <rect x="46" y="62" width="36" height="98" rx="18" transform="rotate(-2 64 110)" />
            <rect x="88" y="60" width="35" height="94" rx="17.5" transform="rotate(3 105 106)" />
            <rect x="128" y="54" width="33" height="86" rx="16.5" transform="rotate(8 144 96)" />
          </g>
          <path d="M0 44 q60 20 120 6" stroke="#a87b55" strokeWidth="5" fill="none" opacity="0.5" />
        </g>

        {/* right hand */}
        <g transform="translate(1000,430) rotate(6)">
          <rect x="-40" y="-6" width="206" height="88" rx="42" fill="url(#skinH)" />
          <rect x="-4" y="-22" width="104" height="50" rx="25" fill="url(#skinH)" />
          <g fill="url(#skinH)">
            <rect x="-2" y="56" width="34" height="90" rx="17" transform="rotate(-8 15 100)" />
            <rect x="38" y="60" width="34" height="94" rx="17" transform="rotate(-3 55 106)" />
            <rect x="78" y="58" width="33" height="90" rx="16.5" transform="rotate(3 94 102)" />
            <rect x="116" y="52" width="31" height="82" rx="15.5" transform="rotate(8 131 92)" />
          </g>
          <path d="M0 42 q60 18 118 4" stroke="#a87b55" strokeWidth="5" fill="none" opacity="0.5" />
        </g>

        {/* contact shadows so the hands sit on the keys */}
        <ellipse cx="742" cy="560" rx="150" ry="34" fill="#000" opacity="0.28" />
        <ellipse cx="1054" cy="586" rx="140" ry="30" fill="#000" opacity="0.24" />
      </g>

      {/* 6. notebook in the foreground */}
      <g filter="url(#soft)">
        <path d="M236 726 L604 712 L622 862 L252 876 Z" fill="url(#book)" />
        <path d="M236 726 L604 712 L606 726 L238 740 Z" fill="#7d7167" opacity="0.5" />
      </g>

      {/* 7. colour grade + vignette */}
      <rect width="1200" height="900" fill="url(#grade)" />
      <rect width="1200" height="900" fill="url(#vig)" />
    </svg>
  );
}