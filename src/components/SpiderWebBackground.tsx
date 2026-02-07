import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface SpiderWebProps {
  className?: string;
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "center";
  size?: number;
  color?: string;
  opacity?: number;
  animate?: boolean;
  delay?: number;
  rings?: number;
  spokes?: number;
}

const SpiderWeb = ({
  className = "",
  position = "top-left",
  size = 300,
  color = "currentColor",
  opacity = 0.15,
  animate = true,
  delay = 0,
  rings = 6,
  spokes = 12,
}: SpiderWebProps) => {
  const center = size / 2;
  const maxRadius = size / 2 - 10;

  // Generate spoke lines
  const spokeLines = Array.from({ length: spokes }, (_, i) => {
    const angle = (i * 2 * Math.PI) / spokes;
    const endX = center + Math.cos(angle) * maxRadius;
    const endY = center + Math.sin(angle) * maxRadius;
    return { x1: center, y1: center, x2: endX, y2: endY, angle };
  });

  // Generate concentric ring paths (curved between spokes)
  const ringPaths = Array.from({ length: rings }, (_, ringIdx) => {
    const radius = ((ringIdx + 1) * maxRadius) / rings;
    // Add slight irregularity for organic feel
    const points = spokeLines.map((spoke, i) => {
      const wobble = Math.sin(i * 3 + ringIdx * 2) * (radius * 0.06);
      const r = radius + wobble;
      const x = center + Math.cos(spoke.angle) * r;
      const y = center + Math.sin(spoke.angle) * r;
      return { x, y };
    });

    // Create path connecting points
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i <= points.length; i++) {
      const current = points[i % points.length];
      const prev = points[(i - 1) % points.length];
      // Slight curve between points
      const cx = (prev.x + current.x) / 2 + (center - (prev.x + current.x) / 2) * 0.1;
      const cy = (prev.y + current.y) / 2 + (center - (prev.y + current.y) / 2) * 0.1;
      d += ` Q ${cx} ${cy} ${current.x} ${current.y}`;
    }
    return d;
  });

  // Position styles
  const positionStyles: Record<string, string> = {
    "top-left": "-top-[30%] -left-[30%]",
    "top-right": "-top-[30%] -right-[30%]",
    "bottom-left": "-bottom-[30%] -left-[30%]",
    "bottom-right": "-bottom-[30%] -right-[30%]",
    "center": "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${positionStyles[position]} ${className}`}
      initial={animate ? { scale: 0, opacity: 0, rotate: -30 } : {}}
      whileInView={animate ? { scale: 1, opacity: 1, rotate: 0 } : {}}
      transition={{
        duration: 1.2,
        delay,
        ease: [0.23, 1, 0.32, 1],
      }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ opacity }}
      >
        {/* Spokes */}
        {spokeLines.map((line, i) => (
          <motion.line
            key={`spoke-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
            initial={animate ? { pathLength: 0 } : {}}
            whileInView={animate ? { pathLength: 1 } : {}}
            transition={{
              duration: 0.6,
              delay: delay + i * 0.03,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          />
        ))}

        {/* Concentric rings */}
        {ringPaths.map((d, i) => (
          <motion.path
            key={`ring-${i}`}
            d={d}
            stroke={color}
            strokeWidth={0.8}
            fill="none"
            strokeLinecap="round"
            initial={animate ? { pathLength: 0, opacity: 0 } : {}}
            whileInView={animate ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration: 0.8,
              delay: delay + 0.3 + i * 0.1,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
          />
        ))}

        {/* Center dot */}
        <motion.circle
          cx={center}
          cy={center}
          r={3}
          fill={color}
          initial={animate ? { scale: 0 } : {}}
          whileInView={animate ? { scale: 1 } : {}}
          transition={{ duration: 0.3, delay }}
          viewport={{ once: true }}
        />

        {/* Small dots at intersections for web fluid look */}
        {ringPaths.length > 0 &&
          spokeLines.map((spoke, si) =>
            Array.from({ length: rings }, (_, ri) => {
              const radius = ((ri + 1) * maxRadius) / rings;
              const wobble = Math.sin(si * 3 + ri * 2) * (radius * 0.06);
              const r = radius + wobble;
              const x = center + Math.cos(spoke.angle) * r;
              const y = center + Math.sin(spoke.angle) * r;
              return (
                <motion.circle
                  key={`dot-${si}-${ri}`}
                  cx={x}
                  cy={y}
                  r={1.5}
                  fill={color}
                  initial={animate ? { scale: 0 } : {}}
                  whileInView={animate ? { scale: 1 } : {}}
                  transition={{
                    duration: 0.2,
                    delay: delay + 0.5 + ri * 0.05 + si * 0.02,
                  }}
                  viewport={{ once: true }}
                />
              );
            })
          )}
      </svg>
    </motion.div>
  );
};

// Strand that stretches between two points
const WebStrand = ({
  className = "",
  color = "currentColor",
  opacity = 0.1,
  delay = 0,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  delay?: number;
}) => {
  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity }}
      transition={{ duration: 1, delay, ease: [0.23, 1, 0.32, 1] }}
      viewport={{ once: true, amount: 0.3 }}
    >
      <svg width="100%" height="20" viewBox="0 0 400 20" preserveAspectRatio="none">
        <path
          d="M0 10 Q 50 2, 100 10 Q 150 18, 200 10 Q 250 2, 300 10 Q 350 18, 400 10"
          stroke={color}
          strokeWidth={1}
          fill="none"
          strokeLinecap="round"
        />
        <path
          d="M0 10 Q 80 5, 160 10 Q 240 15, 320 10 Q 360 7, 400 10"
          stroke={color}
          strokeWidth={0.6}
          fill="none"
          opacity={0.5}
        />
      </svg>
    </motion.div>
  );
};

interface SpiderWebBackgroundProps {
  variant?: "corners" | "scattered" | "sides";
  color?: string;
  opacity?: number;
  webSize?: number;
}

const SpiderWebBackground = ({
  variant = "corners",
  color = "hsl(var(--primary))",
  opacity = 0.12,
  webSize = 350,
}: SpiderWebBackgroundProps) => {
  if (variant === "corners") {
    return (
      <>
        <SpiderWeb position="top-left" size={webSize} color={color} opacity={opacity} delay={0} />
        <SpiderWeb position="bottom-right" size={webSize} color={color} opacity={opacity} delay={0.3} />
        <WebStrand
          className="top-[20%] left-0 right-0"
          color={color}
          opacity={opacity * 0.6}
          delay={0.5}
        />
      </>
    );
  }

  if (variant === "scattered") {
    return (
      <>
        <SpiderWeb position="top-right" size={webSize * 0.8} color={color} opacity={opacity} delay={0.1} spokes={10} rings={5} />
        <SpiderWeb position="bottom-left" size={webSize * 0.7} color={color} opacity={opacity * 0.8} delay={0.4} spokes={8} rings={4} />
        <WebStrand
          className="top-[40%] left-[10%] right-[10%]"
          color={color}
          opacity={opacity * 0.5}
          delay={0.6}
        />
        <WebStrand
          className="bottom-[30%] left-[5%] right-[20%]"
          color={color}
          opacity={opacity * 0.4}
          delay={0.8}
        />
      </>
    );
  }

  // sides
  return (
    <>
      <SpiderWeb position="top-left" size={webSize * 0.6} color={color} opacity={opacity} delay={0} spokes={8} rings={4} />
      <SpiderWeb position="top-right" size={webSize * 0.7} color={color} opacity={opacity * 0.9} delay={0.2} spokes={10} rings={5} />
      <SpiderWeb position="bottom-left" size={webSize * 0.5} color={color} opacity={opacity * 0.7} delay={0.4} spokes={8} rings={3} />
      <SpiderWeb position="bottom-right" size={webSize * 0.65} color={color} opacity={opacity * 0.8} delay={0.3} spokes={9} rings={4} />
      <WebStrand
        className="top-[50%] left-0 right-0"
        color={color}
        opacity={opacity * 0.4}
        delay={0.7}
      />
    </>
  );
};

export default SpiderWebBackground;
