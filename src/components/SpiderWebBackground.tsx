import { useEffect, useRef, useCallback } from "react";

interface Point {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface SpiderWebBackgroundProps {
  className?: string;
  color?: string;
  particleCount?: number;
  connectionDistance?: number;
  opacity?: number;
  speed?: number;
}

const SpiderWebBackground = ({
  className = "",
  color = "var(--primary)",
  particleCount = 50,
  connectionDistance = 150,
  opacity = 0.15,
  speed = 0.3,
}: SpiderWebBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointsRef = useRef<Point[]>([]);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const animationRef = useRef<number>();

  const initPoints = useCallback(
    (width: number, height: number) => {
      const points: Point[] = [];
      for (let i = 0; i < particleCount; i++) {
        points.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * speed,
          vy: (Math.random() - 0.5) * speed,
          radius: Math.random() * 2 + 1,
        });
      }
      pointsRef.current = points;
    },
    [particleCount, speed]
  );

  const getHSLColor = useCallback((cssVar: string) => {
    const el = document.documentElement;
    const style = getComputedStyle(el);
    // Extract the CSS variable name from var(--name) format
    const varName = cssVar.replace("var(", "").replace(")", "");
    const value = style.getPropertyValue(varName).trim();
    return value;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (pointsRef.current.length === 0) {
        initPoints(rect.width, rect.height);
      }
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(parent);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    parent.addEventListener("mousemove", handleMouseMove);
    parent.addEventListener("mouseleave", handleMouseLeave);

    const animate = () => {
      if (!canvas || !ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const hslValue = getHSLColor(color);
      const points = pointsRef.current;

      // Update positions
      for (const point of points) {
        point.x += point.vx;
        point.y += point.vy;

        if (point.x < 0 || point.x > canvas.width) point.vx *= -1;
        if (point.y < 0 || point.y > canvas.height) point.vy *= -1;

        point.x = Math.max(0, Math.min(canvas.width, point.x));
        point.y = Math.max(0, Math.min(canvas.height, point.y));
      }

      // Draw connections
      for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
          const dx = points[i].x - points[j].x;
          const dy = points[i].y - points[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const lineOpacity = (1 - dist / connectionDistance) * opacity;
            ctx.beginPath();
            ctx.strokeStyle = `hsl(${hslValue} / ${lineOpacity})`;
            ctx.lineWidth = 0.8;
            ctx.moveTo(points[i].x, points[i].y);
            ctx.lineTo(points[j].x, points[j].y);
            ctx.stroke();
          }
        }

        // Mouse interaction - draw lines to nearby mouse
        const mouseDx = points[i].x - mouseRef.current.x;
        const mouseDy = points[i].y - mouseRef.current.y;
        const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);

        if (mouseDist < connectionDistance * 1.5) {
          const lineOpacity =
            (1 - mouseDist / (connectionDistance * 1.5)) * opacity * 2;
          ctx.beginPath();
          ctx.strokeStyle = `hsl(${hslValue} / ${lineOpacity})`;
          ctx.lineWidth = 1;
          ctx.moveTo(points[i].x, points[i].y);
          ctx.lineTo(mouseRef.current.x, mouseRef.current.y);
          ctx.stroke();

          // Gentle push away from mouse
          const force = (connectionDistance * 1.5 - mouseDist) * 0.0003;
          points[i].vx += mouseDx * force;
          points[i].vy += mouseDy * force;

          // Clamp velocity
          const maxSpeed = speed * 2;
          points[i].vx = Math.max(-maxSpeed, Math.min(maxSpeed, points[i].vx));
          points[i].vy = Math.max(-maxSpeed, Math.min(maxSpeed, points[i].vy));
        }

        // Draw points
        ctx.beginPath();
        ctx.fillStyle = `hsl(${hslValue} / ${opacity * 2})`;
        ctx.arc(points[i].x, points[i].y, points[i].radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      resizeObserver.disconnect();
      parent.removeEventListener("mousemove", handleMouseMove);
      parent.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [color, connectionDistance, opacity, speed, initPoints, getHSLColor]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  );
};

export default SpiderWebBackground;
