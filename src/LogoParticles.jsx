import React, { useEffect, useRef } from "react";

export default function LogoParticles() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const w = 156, h = 156;
    canvas.width = w; canvas.height = h;

    const mask = document.createElement("canvas");
    mask.width = w; mask.height = h;
    const mctx = mask.getContext("2d");
    mctx.clearRect(0, 0, w, h);
    mctx.fillStyle = "#fff";
    mctx.font = "800 104px Manrope, Arial, sans-serif";
    mctx.textAlign = "center"; mctx.textBaseline = "middle";
    mctx.fillText("tp", w / 2 + 1, h / 2 + 1);
    const pixels = mctx.getImageData(0, 0, w, h).data;
    const points = [];
    for (let y = 18; y < h - 18; y += 3) {
      for (let x = 12; x < w - 12; x += 3) {
        if (pixels[(y * w + x) * 4 + 3] > 100) {
          points.push({ x: x * 39 / w, y: y * 39 / h,
            dx: (Math.random() - .5) * 54, dy: (Math.random() - .5) * 54,
            phase: Math.random() * Math.PI * 2, size: .65 + Math.random() * 1.1 });
        }
      }
    }
    let scatter = 0, target = 0, raf = 0, lastScroll = window.scrollY, idleTimer;
    const draw = () => {
      scatter += (target - scatter) * .095;
      ctx.clearRect(0, 0, 39, 39);
      points.forEach((p) => {
        const amount = scatter;
        const x = p.x + p.dx * amount + Math.sin(p.phase + amount * 7) * amount * 2.5;
        const y = p.y + p.dy * amount + Math.cos(p.phase + amount * 7) * amount * 2.5;
        ctx.globalAlpha = .55 + .45 * (1 - amount);
        ctx.fillStyle = amount > .15 ? "#c6bdff" : "#fff";
        ctx.beginPath(); ctx.arc(x, y, p.size, 0, Math.PI * 2); ctx.fill();
      });
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(draw);
    };
    const onScroll = () => {
      const delta = Math.abs(window.scrollY - lastScroll);
      lastScroll = window.scrollY;
      if (delta > 1) target = Math.min(1, target + Math.min(.22, delta / 90));
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => { target = 0; }, 180);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    draw();
    return () => { cancelAnimationFrame(raf); clearTimeout(idleTimer); window.removeEventListener("scroll", onScroll); };
  }, []);

  return <canvas ref={canvasRef} className="brand-particle-canvas" aria-label="TalentPath particle logo" />;
}
