import { motion } from "framer-motion";

interface CornerWebProps {
  corner: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
  opacity?: number;
  delay?: number;
  strands?: number;
  rings?: number;
}

const CornerWeb = ({
  corner = "top-left",
  size = 500,
  color = "currentColor",
  opacity = 0.18,
  delay = 0,
  strands = 10,
  rings = 7,
}: CornerWebProps) => {
  // The origin point is at the corner, strands fan out into the section
  const origin = { x: 0, y: 0 };

  // Determine angle range based on corner (quarter arc)
  const angleRange: Record<string, { start: number; end: number }> = {
    "top-left": { start: 0, end: Math.PI / 2 },
    "top-right": { start: Math.PI / 2, end: Math.PI },
    "bottom-right": { start: Math.PI, end: (3 * Math.PI) / 2 },
    "bottom-left": { start: (3 * Math.PI) / 2, end: 2 * Math.PI },
  };

  const { start: startAngle, end: endAngle } = angleRange[corner];
  const maxRadius = size - 20;

  // Generate strand endpoints
  const strandData = Array.from({ length: strands }, (_, i) => {
    const t = i / (strands - 1);
    const angle = startAngle + t * (endAngle - startAngle);
    // Add slight wobble for organic feel
    const wobble = Math.sin(i * 2.7) * (maxRadius * 0.04);
    const r = maxRadius + wobble;
    const endX = origin.x + Math.cos(angle) * r;
    const endY = origin.y + Math.sin(angle) * r;
    return { endX, endY, angle };
  });

  // Generate ring paths (arcs connecting strands at different radii)
  const ringPaths = Array.from({ length: rings }, (_, ringIdx) => {
    const radius = ((ringIdx + 1) * maxRadius) / (rings + 0.5);
    const points = strandData.map((strand, i) => {
      const wobble = Math.sin(i * 3.1 + ringIdx * 1.7) * (radius * 0.07);
      const r = radius + wobble;
      const x = origin.x + Math.cos(strand.angle) * r;
      const y = origin.y + Math.sin(strand.angle) * r;
      return { x, y };
    });

    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      // Curve slightly toward origin for web sag effect
      const mx = (prev.x + curr.x) / 2;
      const my = (prev.y + curr.y) / 2;
      const cx = mx + (origin.x - mx) * 0.15;
      const cy = my + (origin.y - my) * 0.15;
      d += ` Q ${cx} ${cy} ${curr.x} ${curr.y}`;
    }
    return d;
  });

  // Position the SVG at the correct corner
  const positionClass: Record<string, string> = {
    "top-left": "top-0 left-0",
    "top-right": "top-0 right-0",
    "bottom-left": "bottom-0 left-0",
    "bottom-right": "bottom-0 right-0",
  };

  // Transform to flip the SVG into the correct corner orientation
  const transformStyle: Record<string, string> = {
    "top-left": "none",
    "top-right": "scaleX(-1)",
    "bottom-left": "scaleY(-1)",
    "bottom-right": "scale(-1)",
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${positionClass[corner]}`}
      style={{ transform: transformStyle[corner] }}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.3, delay }}
      viewport={{ once: true, amount: 0.1 }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        fill="none"
        style={{ opacity }}
      >
        {/* Anchor dot at corner origin — appears first like shooter impact */}
        <motion.circle
          cx={origin.x}
          cy={origin.y}
          r={6}
          fill={color}
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: [0, 2.5, 1], opacity: [0, 1, 1] }}
          transition={{ duration: 0.4, delay, ease: "easeOut" }}
          viewport={{ once: true }}
        />

        {/* Main strands shoot out from corner — fast with overshoot */}
        {strandData.map((strand, i) => (
          <motion.line
            key={`strand-${i}`}
            x1={origin.x}
            y1={origin.y}
            x2={strand.endX}
            y2={strand.endY}
            stroke={color}
            strokeWidth={i === 0 || i === strandData.length - 1 ? 2.5 : 1.6}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: [0, 1, 1] }}
            transition={{
              pathLength: {
                duration: 0.35,
                delay: delay + 0.15 + i * 0.06,
                ease: [0.16, 1, 0.3, 1],
              },
              opacity: {
                duration: 0.1,
                delay: delay + 0.15 + i * 0.06,
              },
            }}
            viewport={{ once: true }}
          />
        ))}

        {/* Connecting ring arcs — drawn sequentially from inner to outer */}
        {ringPaths.map((d, i) => (
          <motion.path
            key={`ring-${i}`}
            d={d}
            stroke={color}
            strokeWidth={1.2}
            fill="none"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            whileInView={{ pathLength: 1, opacity: 1 }}
            transition={{
              pathLength: {
                duration: 0.5,
                delay: delay + 0.5 + i * 0.12,
                ease: [0.25, 1, 0.5, 1],
              },
              opacity: {
                duration: 0.15,
                delay: delay + 0.5 + i * 0.12,
              },
            }}
            viewport={{ once: true }}
          />
        ))}

        {/* Junction dots pop in as rings are drawn */}
        {strandData.map((strand, si) =>
          Array.from({ length: rings }, (_, ri) => {
            const radius = ((ri + 1) * maxRadius) / (rings + 0.5);
            const wobble = Math.sin(si * 3.1 + ri * 1.7) * (radius * 0.07);
            const r = radius + wobble;
            const x = origin.x + Math.cos(strand.angle) * r;
            const y = origin.y + Math.sin(strand.angle) * r;
            return (
              <motion.circle
                key={`dot-${si}-${ri}`}
                cx={x}
                cy={y}
                r={2.5}
                fill={color}
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: [0, 1.8, 1], opacity: 1 }}
                transition={{
                  duration: 0.25,
                  delay: delay + 0.55 + ri * 0.12 + si * 0.03,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
              />
            );
          })
        )}

        {/* Glow pulse at origin after web is shot */}
        <motion.circle
          cx={origin.x}
          cy={origin.y}
          r={15}
          fill="none"
          stroke={color}
          strokeWidth={2}
          initial={{ scale: 0, opacity: 0.6 }}
          whileInView={{ scale: [0, 1.5], opacity: [0.6, 0] }}
          transition={{ duration: 0.6, delay: delay + 0.05, ease: "easeOut" }}
          viewport={{ once: true }}
        />
      </svg>
    </motion.div>
  );
};

// Loose strand that droops between edges
const DroopStrand = ({
  className = "",
  color = "currentColor",
  opacity = 0.1,
  delay = 0,
}: {
  className?: string;
  color?: string;
  opacity?: number;
  delay?: number;
}) => (
  <motion.div
    className={`absolute pointer-events-none ${className}`}
    initial={{ opacity: 0 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.2, delay }}
    viewport={{ once: true, amount: 0.3 }}
  >
    <svg width="100%" height="30" viewBox="0 0 500 30" preserveAspectRatio="none">
      <motion.path
        d="M0 2 Q 125 28, 250 8 Q 375 -12, 500 4"
        stroke={color}
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
        style={{ opacity }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{
          duration: 0.7,
          delay: delay + 0.1,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
      />
      <motion.path
        d="M0 6 Q 100 22, 200 10 Q 350 -2, 500 8"
        stroke={color}
        strokeWidth={0.8}
        fill="none"
        style={{ opacity: opacity * 0.5 }}
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        transition={{
          duration: 0.6,
          delay: delay + 0.3,
          ease: [0.16, 1, 0.3, 1],
        }}
        viewport={{ once: true }}
      />
    </svg>
  </motion.div>
);

interface SpiderWebBackgroundProps {
  variant?: "corners" | "scattered" | "sides";
  color?: string;
  opacity?: number;
  webSize?: number;
}

const SpiderWebBackground = ({
  variant = "corners",
  color = "hsl(var(--primary))",
  opacity = 0.18,
  webSize = 420,
}: SpiderWebBackgroundProps) => {
  if (variant === "corners") {
    return (
      <>
        <CornerWeb corner="top-left" size={webSize} color={color} opacity={opacity} delay={0} />
        <CornerWeb corner="bottom-right" size={webSize * 0.85} color={color} opacity={opacity * 0.8} delay={0.2} strands={8} rings={6} />
        <DroopStrand
          className="top-[15%] left-0 right-0"
          color={color}
          opacity={opacity * 0.4}
          delay={0.5}
        />
      </>
    );
  }

  if (variant === "scattered") {
    return (
      <>
        <CornerWeb corner="top-right" size={webSize * 0.9} color={color} opacity={opacity} delay={0.1} strands={9} rings={6} />
        <CornerWeb corner="bottom-left" size={webSize * 0.75} color={color} opacity={opacity * 0.85} delay={0.3} strands={8} rings={5} />
        <DroopStrand
          className="top-[35%] left-[5%] right-[5%]"
          color={color}
          opacity={opacity * 0.35}
          delay={0.5}
        />
        <DroopStrand
          className="bottom-[25%] left-[10%] right-[15%]"
          color={color}
          opacity={opacity * 0.25}
          delay={0.7}
        />
      </>
    );
  }

  // sides — webs from all four corners
  return (
    <>
      <CornerWeb corner="top-left" size={webSize * 0.7} color={color} opacity={opacity} delay={0} strands={8} rings={5} />
      <CornerWeb corner="top-right" size={webSize * 0.8} color={color} opacity={opacity * 0.9} delay={0.15} strands={9} rings={6} />
      <CornerWeb corner="bottom-left" size={webSize * 0.6} color={color} opacity={opacity * 0.7} delay={0.3} strands={7} rings={4} />
      <CornerWeb corner="bottom-right" size={webSize * 0.75} color={color} opacity={opacity * 0.8} delay={0.2} strands={8} rings={5} />
      <DroopStrand
        className="top-[45%] left-0 right-0"
        color={color}
        opacity={opacity * 0.3}
        delay={0.6}
      />
    </>
  );
};

export default SpiderWebBackground;
