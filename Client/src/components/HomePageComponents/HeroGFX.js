import React from "react";

const CYAN = "#00E5FF";
const PURPLE = "#6D28D9";

function WireframeCube({ size, top, left, duration, delay, opacity = 0.55 }) {
  const s = size;
  const h = s / 2;
  const faceStyle = {
    position: "absolute",
    width: s,
    height: s,
    border: `1px solid ${CYAN}`,
    opacity,
    background: "rgba(0,229,255,0.02)",
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
  };
  return (
    /* Each cube gets its own perspective context — avoids parent clipping artifacts */
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: s,
        height: s,
        perspective: s * 5,
        perspectiveOrigin: "50% 50%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: s,
          height: s,
          transformStyle: "preserve-3d",
          willChange: "transform",
          animation: `rotateCube ${duration}s linear ${delay}s infinite`,
        }}
      >
        <div style={{ ...faceStyle, transform: `translateZ(${h}px)` }} />
        <div style={{ ...faceStyle, transform: `translateZ(-${h}px) rotateY(180deg)` }} />
        <div style={{ ...faceStyle, transform: `translateX(-${h}px) rotateY(-90deg)` }} />
        <div style={{ ...faceStyle, transform: `translateX(${h}px) rotateY(90deg)` }} />
        <div style={{ ...faceStyle, transform: `translateY(-${h}px) rotateX(90deg)` }} />
        <div style={{ ...faceStyle, transform: `translateY(${h}px) rotateX(-90deg)` }} />
      </div>
    </div>
  );
}

function Hexagon({ size, top, left, duration, delay, color = CYAN }) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    pts.push([
      Math.round((size / 2) + (size / 2) * Math.cos(angle)),
      Math.round((size / 2) + (size / 2) * Math.sin(angle)),
    ]);
  }
  const pointsStr = pts.map(([x, y]) => `${x},${y}`).join(" ");
  const anim = delay % 2 === 0 ? "floatUp" : "floatDown";
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        willChange: "transform",
        animation: `${anim} ${duration}s ease-in-out ${delay}s infinite`,
      }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none">
        <polygon
          points={pointsStr}
          stroke={color}
          strokeWidth="1"
          fill="none"
          style={{ animation: `hexPulse ${(duration * 0.7).toFixed(1)}s ease-in-out ${delay}s infinite` }}
        />
        <polygon
          points={pointsStr}
          stroke={color}
          strokeWidth="0.5"
          fill={`${color}08`}
          transform={`translate(${size * 0.12},${size * 0.12}) scale(0.76)`}
          style={{ animation: `hexPulse ${(duration * 0.9).toFixed(1)}s ease-in-out ${(delay + 0.5).toFixed(1)}s infinite` }}
        />
      </svg>
    </div>
  );
}

function CircuitLines() {
  return (
    <svg
      viewBox="0 0 400 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.2 }}
    >
      <line x1="20" y1="80"  x2="380" y2="80"  stroke={CYAN}   strokeWidth="0.5" strokeDasharray="6 4"  style={{ animation: "dashFlow 4s linear infinite" }} />
      <line x1="20" y1="160" x2="380" y2="160" stroke={PURPLE} strokeWidth="0.5" strokeDasharray="8 6"  style={{ animation: "dashFlow 5s linear 1s infinite" }} />
      <line x1="20" y1="300" x2="380" y2="300" stroke={CYAN}   strokeWidth="0.5" strokeDasharray="4 8"  style={{ animation: "dashFlow 6s linear 0.5s infinite" }} />
      <line x1="20" y1="420" x2="380" y2="420" stroke={PURPLE} strokeWidth="0.5" strokeDasharray="6 6"  style={{ animation: "dashFlow 4.5s linear 2s infinite" }} />
      <line x1="60"  y1="0" x2="60"  y2="500"  stroke={CYAN}   strokeWidth="0.5" strokeDasharray="4 8"  style={{ animation: "dashFlow 7s linear infinite" }} />
      <line x1="200" y1="0" x2="200" y2="500"  stroke={PURPLE} strokeWidth="0.5" strokeDasharray="6 6"  style={{ animation: "dashFlow 5s linear 1.5s infinite" }} />
      <line x1="340" y1="0" x2="340" y2="500"  stroke={CYAN}   strokeWidth="0.5" strokeDasharray="5 5"  style={{ animation: "dashFlow 6s linear 0.8s infinite" }} />

      {[[60,80],[200,80],[340,80],[60,160],[200,160],[340,160],[60,300],[200,300],[340,300],[60,420],[200,420],[340,420]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="3" fill={i % 2 === 0 ? CYAN : PURPLE}
          style={{ animation: `hexPulse ${1.5 + (i % 3) * 0.5}s ease-in-out ${(i * 0.2).toFixed(1)}s infinite` }} />
      ))}

      <line x1="60" y1="80" x2="200" y2="160"  stroke={CYAN}   strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 5" style={{ animation: "dashFlow 3.5s linear infinite" }} />
      <line x1="200" y1="160" x2="340" y2="80" stroke={CYAN}   strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 5" style={{ animation: "dashFlow 3.5s linear 0.5s infinite" }} />
      <line x1="60" y1="300" x2="200" y2="420" stroke={PURPLE} strokeWidth="0.5" strokeOpacity="0.4" strokeDasharray="3 5" style={{ animation: "dashFlow 4s linear 1s infinite" }} />
    </svg>
  );
}

function HudOverlay() {
  return (
    <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: CYAN, opacity: 0.7 }}>
      <div style={{ marginBottom: 6, letterSpacing: "0.1em", opacity: 0.5 }}>SYS_STATUS</div>
      {[
        { label: "PING",    value: "12ms",   ok: true },
        { label: "UPTIME",  value: "99.9%",  ok: true },
        { label: "ARENA",   value: "ONLINE", ok: true },
        { label: "PLAYERS", value: "502",    ok: true },
      ].map(({ label, value, ok }) => (
        <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 20, marginBottom: 4 }}>
          <span style={{ opacity: 0.6 }}>{label}</span>
          <span style={{ color: ok ? "#10B981" : "#EF4444" }}>{value}</span>
        </div>
      ))}
      <div style={{ marginTop: 10, width: 120, height: 1, background: `linear-gradient(90deg, ${CYAN}, transparent)` }} />
    </div>
  );
}

function HudBottomLeft() {
  const bars = [0.9, 0.7, 0.85, 0.6, 0.95];
  return (
    <div style={{ position: "absolute", bottom: 24, left: 24, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: CYAN, opacity: 0.6 }}>
      <div style={{ marginBottom: 8, letterSpacing: "0.1em", opacity: 0.5 }}>RANKING_LOAD</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 30 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: `${h * 30}px`,
              background: CYAN,
              opacity: 0.6,
              borderRadius: 1,
              /* opacity-only animation — no box-shadow, no repaints */
              animation: `hexPulse ${1 + i * 0.3}s ease-in-out ${(i * 0.2).toFixed(1)}s infinite`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function HeroGFX() {
  return (
    /* No perspective on the container — prevents 3D clipping glitch with overflow:hidden */
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        overflow: "hidden",
        /* Promote to its own composite layer so animations don't repaint the rest of the page */
        transform: "translateZ(0)",
        willChange: "transform",
      }}
    >
      <CircuitLines />

      <WireframeCube size={80}  top="10%"  left="45%" duration={14} delay={0}   opacity={0.4} />
      <WireframeCube size={50}  top="55%"  left="15%" duration={10} delay={2}   opacity={0.3} />
      <WireframeCube size={110} top="30%"  left="30%" duration={18} delay={1}   opacity={0.45} />
      <WireframeCube size={36}  top="72%"  left="65%" duration={8}  delay={3}   opacity={0.28} />
      <WireframeCube size={60}  top="5%"   left="70%" duration={12} delay={1.5} opacity={0.35} />

      <Hexagon size={64}  top="15%"  left="60%"  duration={5}   delay={0}   color={CYAN}   />
      <Hexagon size={44}  top="65%"  left="35%"  duration={6.5} delay={1}   color={PURPLE} />
      <Hexagon size={80}  top="42%"  left="68%"  duration={7}   delay={0.5} color={CYAN}   />
      <Hexagon size={32}  top="82%"  left="18%"  duration={4.5} delay={2}   color={PURPLE} />
      <Hexagon size={52}  top="5%"   left="20%"  duration={8}   delay={1.5} color={CYAN}   />

      <HudOverlay />
      <HudBottomLeft />

      {/* Scan line — uses translateY with px values inside a clipped container, no viewport units */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          height: 2,
          background: `linear-gradient(90deg, transparent, ${CYAN}60, transparent)`,
          willChange: "transform",
          animation: "scanLinePx 5s linear infinite",
          pointerEvents: "none",
        }}
      />
    </div>
  );
}
