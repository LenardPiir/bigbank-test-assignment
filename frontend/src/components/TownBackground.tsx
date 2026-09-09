export default function TownBackground() {
  return (
    <div className="town-bg">
      <svg
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMax slice"
        className="w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#060610" />
            <stop offset="35%" stopColor="#0e0c1a" />
            <stop offset="55%" stopColor="#1a1424" />
            <stop offset="75%" stopColor="#1e1418" />
            <stop offset="100%" stopColor="#1a1410" />
          </linearGradient>
          <radialGradient id="moonGlow" cx="0.75" cy="0.12" r="0.3">
            <stop offset="0%" stopColor="#f0e6c8" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="groundFog" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#1a1410" stopOpacity="0" />
            <stop offset="100%" stopColor="#1a1410" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <rect width="1400" height="900" fill="url(#sky)" />
        <rect width="1400" height="900" fill="url(#moonGlow)" />

        <circle cx="1050" cy="110" r="28" fill="#e8dcc0" opacity="0.65" />
        <circle cx="1043" cy="105" r="25" fill="#1a1424" opacity="0.2" />

        {[[120,45,1.2],[280,75,0.8],[420,28,1],[560,55,0.7],[720,38,1.1],[880,65,0.9],[180,110,0.6],[350,95,1],[650,120,0.7],[790,82,0.8],[1000,55,0.6],[1150,85,0.9],[50,75,0.5],[480,42,0.8],[1250,60,0.7],[940,30,1]].map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="#fff" opacity={0.25 + (i % 4) * 0.1} />
        ))}

        <g fill="#0a0806">
          <rect x="0" y="620" width="1400" height="280" />

          <rect x="30" y="480" width="100" height="140" />
          <rect x="20" y="440" width="25" height="40" />
          <rect x="115" y="440" width="25" height="40" />
          <polygon points="20,440 32,415 45,440" />
          <polygon points="115,440 127,415 140,440" />
          <rect x="60" y="550" width="30" height="70" rx="15" />
          {[0,1,2,3,4].map(i => <rect key={`b${i}`} x={133 + i * 18} y="568" width="8" height="8" />)}

          <rect x="130" y="575" width="90" height="45" />

          <rect x="250" y="510" width="80" height="110" />
          <rect x="278" y="430" width="24" height="80" />
          <polygon points="275,430 290,380 305,430" />

          <rect x="360" y="545" width="60" height="75" />
          <polygon points="355,545 390,510 425,545" />
          <rect x="440" y="560" width="50" height="60" />
          <polygon points="435,560 465,530 495,560" />

          <rect x="530" y="525" width="90" height="95" />
          <polygon points="525,525 575,480 625,525" />
          <rect x="565" y="565" width="20" height="55" rx="3" />

          <rect x="650" y="550" width="55" height="70" />
          <polygon points="645,550 677,520 710,550" />
          <rect x="720" y="535" width="65" height="85" />
          <polygon points="715,535 752,495 790,535" />

          <rect x="830" y="465" width="45" height="155" />
          <rect x="825" y="458" width="55" height="10" />
          <polygon points="828,458 852,425 877,458" />

          <rect x="910" y="555" width="55" height="65" />
          <polygon points="905,555 937,525 970,555" />
          <rect x="985" y="545" width="50" height="75" />
          <polygon points="980,545 1010,515 1040,545" />

          <rect x="1085" y="515" width="30" height="105" />
          <polygon points="1085,515 1100,485 1115,515" />
        </g>

        <g transform="translate(1100, 495)">
          <g className="windmill-blades" fill="#0a0806">
            <polygon points="-2,-32 -14,-18 -2,-6" />
            <polygon points="6,2 18,16 32,2" />
            <polygon points="2,32 14,18 2,6" />
            <polygon points="-6,-2 -18,-16 -32,-2" />
            <line x1="0" y1="0" x2="0" y2="-32" stroke="#0a0806" strokeWidth="2" />
            <line x1="0" y1="0" x2="32" y2="0" stroke="#0a0806" strokeWidth="2" />
            <line x1="0" y1="0" x2="0" y2="32" stroke="#0a0806" strokeWidth="2" />
            <line x1="0" y1="0" x2="-32" y2="0" stroke="#0a0806" strokeWidth="2" />
          </g>
        </g>

        <g fill="#0a0806">
          <rect x="1160" y="555" width="60" height="65" />
          <polygon points="1155,555 1190,520 1225,555" />
          <rect x="1240" y="545" width="80" height="75" />
          <polygon points="1235,545 1280,505 1325,545" />
          <rect x="1330" y="560" width="70" height="60" />
        </g>

        <g fill="#c9a227" opacity="0.3">
          {[[60,500],[90,500],[265,540],[290,555],[370,570],[395,565],[450,578],[545,548],[590,548],[660,572],[730,558],[755,555],[840,493],[840,525],[840,555],[920,575],[997,565],[1175,575],[1258,565],[1290,560]].map(([x, y], i) => (
            <rect key={i} x={x} y={y} width={6} height={8} rx={1} />
          ))}
        </g>

        <rect x="0" y="600" width="1400" height="300" fill="url(#groundFog)" />
      </svg>
    </div>
  );
}
