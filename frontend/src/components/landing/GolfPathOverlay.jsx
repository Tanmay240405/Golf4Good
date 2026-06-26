import { useRef, useState } from 'react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export default function GolfPathOverlay() {
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll();
  const [activeStage, setActiveStage] = useState(0);

  // 5 sections mapping to 5 stages
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest < 0.2) setActiveStage(0);
    else if (latest < 0.4) setActiveStage(1);
    else if (latest < 0.6) setActiveStage(2);
    else if (latest < 0.8) setActiveStage(3);
    else setActiveStage(4);
  });

  // Waypoints precisely mapped to the bright green fairway
  const waypoints = [
    { x: 1250, y: 1000, label: "Tee Box", dist: "520 yd", par: "5" },
    { x: 1450, y: 750, label: "240 yd", dist: "280 yd", par: "4" },
    { x: 1550, y: 550, label: "186 yd", dist: "134 yd", par: "3" },
    { x: 1500, y: 350, label: "156 yd", dist: "30 yd", par: "2" },
    { x: 1450, y: 200, label: "Green", dist: "0 yd", par: "1" }
  ];

  // Dynamically generate straight lines connecting all waypoints
  const pathData = `M ${waypoints[0].x} ${waypoints[0].y} ` + 
    waypoints.slice(1).map(wp => `L ${wp.x} ${wp.y}`).join(' ');

  // Solid path data connecting waypoints up to the current active stage
  const activePathData = activeStage > 0
    ? `M ${waypoints[0].x} ${waypoints[0].y} ` + 
      waypoints.slice(1, activeStage + 1).map(wp => `L ${wp.x} ${wp.y}`).join(' ')
    : '';

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 pointer-events-none z-0 hidden lg:block"
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1920 1080" 
        preserveAspectRatio="xMidYMid slice"
        className="w-full h-full opacity-80"
      >
        {/* Straight lines connecting all 5 waypoints (Base Dashed) */}
        <path
          d={pathData}
          fill="none"
          stroke="rgba(255, 255, 255, 0.4)"
          strokeWidth="4"
          strokeDasharray="10, 15"
        />

        {/* Solid green Progress Path up to the active stage */}
        {activeStage > 0 && (
          <path
            d={activePathData}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="5"
          />
        )}

        {waypoints.map((wp, index) => {
          const isActive = activeStage === index;
          
          return (
            <g key={index} transform={`translate(${wp.x}, ${wp.y})`}>
              
              {/* Outer Glow Ring */}
              <circle 
                cx="0" 
                cy="0" 
                r={isActive ? "28" : "16"} 
                fill="rgba(10,15,20,0.85)" 
                stroke={isActive ? "var(--color-accent)" : "rgba(255,255,255,0.4)"} 
                strokeWidth={isActive ? "3" : "2"}
                className="transition-all duration-500 ease-out"
              />
              
              {/* Inner Dot */}
              <circle 
                cx="0" 
                cy="0" 
                r={isActive ? "8" : "5"} 
                fill={isActive ? "var(--color-accent)" : "white"} 
                className={isActive ? "animate-pulse" : "transition-colors duration-500"}
              />

              {/* Waypoint distance pill (Inactive state) */}
              {!isActive && index !== 0 && index !== waypoints.length - 1 && (
                <g className="transition-opacity duration-500 opacity-100">
                  <rect x="-45" y="24" width="90" height="30" rx="15" fill="rgba(255,255,255,0.95)" />
                  <text x="0" y="44" fill="#050A0F" fontSize="14" fontWeight="bold" textAnchor="middle">{wp.label}</text>
                </g>
              )}

              {/* Active Tooltip Popup */}
              {isActive && (
                <g className="transition-all duration-500 ease-out" transform="translate(-290, -50)">
                  {/* Tooltip background widened to prevent text overlap */}
                  <rect x="0" y="0" width="260" height="70" rx="16" fill="rgba(10,15,20,0.95)" stroke="var(--color-accent)" strokeWidth="1.5" />
                  
                  {/* Neon Par Box */}
                  <rect x="12" y="12" width="46" height="46" rx="12" fill="var(--color-accent)" />
                  <text x="35" y="28" fill="#050A0F" fontSize="11" fontWeight="bold" textAnchor="middle">Par</text>
                  <text x="35" y="50" fill="#050A0F" fontSize="22" fontWeight="bold" textAnchor="middle">{wp.par}</text>

                  {/* Distance text */}
                  <text x="70" y="30" fill="rgba(255,255,255,0.7)" fontSize="13">Distance to Hole</text>
                  <text x="245" y="30" fill="white" fontSize="15" fontWeight="bold" textAnchor="end">{wp.dist}</text>

                  {/* Elevation Change text */}
                  <text x="70" y="54" fill="rgba(255,255,255,0.7)" fontSize="13">Elevation Change</text>
                  <text x="245" y="54" fill="white" fontSize="15" fontWeight="bold" textAnchor="end">+3 ft</text>
                  
                  {/* Connector line back to the dot */}
                  <path d="M 260 35 L 290 50" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
                </g>
              )}
            </g>
          );
        })}

        {/* Flag Icon for the Green (Last waypoint) */}
        <g transform={`translate(${waypoints[4].x}, ${waypoints[4].y})`}>
          <path d="M 0 -16 L 0 -36 L 16 -28 L 0 -20" fill="none" stroke="white" strokeWidth="2.5" strokeLinejoin="round" />
        </g>
      </svg>
    </div>
  );
}
