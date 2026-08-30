import { useEffect, useRef } from "react";
import { C } from "../theme";

const COLORS = ["#22C55E", "#F59E0B", "#0F8B8D", "#FBBF24", "#EF4444", "#FFF9EE"];

export default function Celebration({ message, onDone }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timer = setTimeout(onDone, 1800);

    if (reduced) return () => clearTimeout(timer);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const pieces = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.clientWidth,
      y: -20 - Math.random() * 200,
      size: 5 + Math.random() * 5,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      speedY: 2 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 2,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 10,
    }));

    let raf;
    function frame() {
      ctx.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);
      pieces.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += p.spin;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      });
      raf = requestAnimationFrame(frame);
    }
    frame();

    return () => {
      clearTimeout(timer);
      cancelAnimationFrame(raf);
    };
  }, [onDone]);

  return (
    <div
      onClick={onDone}
      style={{
        position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
        background: "rgba(15,17,21,0.55)", cursor: "pointer",
      }}
    >
      <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      <div
        style={{
          position: "relative", background: C.panel, borderRadius: 18, padding: "22px 26px", maxWidth: 300,
          textAlign: "center", boxShadow: "0 12px 30px rgba(0,0,0,0.4)",
        }}
      >
        <div style={{ fontSize: 34, marginBottom: 8 }}>🎉</div>
        <div style={{ fontFamily: "'Quicksand', sans-serif", fontWeight: 700, fontSize: 15.5, color: C.textDark }}>
          {message}
        </div>
      </div>
    </div>
  );
}
