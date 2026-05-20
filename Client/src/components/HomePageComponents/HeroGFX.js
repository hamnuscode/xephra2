import React from "react";

const CYAN = "#00E5FF";
const PURPLE = "#6D28D9";

function RotatingSquare({ size, top, left, duration, delay, color = CYAN, opacity = 0.35 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        border: `1px solid ${color}`,
        opacity,
        willChange: "transform",
        animation: `spinZ ${duration}s linear ${delay}s infinite`,
      }}
    />
  );
}

function RotatingDiamond({ size, top, left, duration, delay, color = CYAN, opacity = 0.3 }) {
  return (
    <div
      style={{
        position: "absolute",
        top,
        left,
        width: size,
        height: size,
        border: `1px solid ${color}`,
        opacity,
        willChange: "transform",
        transform: "rotate(45deg)",
        animation: `spinZFrom45 ${duration}s linear ${delay}s infinite`,
      }}
    />
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
          fill={`${color}06`}
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
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.18 }}
    >
      <line x1="20" y1="80"  x2="380" y2="80"  stroke={CYAN}   strokeWidth="0.5" strokeDasharray="6 4"  style={{ animation: "dashFlow 4s linear infinite" }} />
      <line x1="20" y1="160" x2="380" y2="160" stroke={PURPLE} strokeWidth="0.5" strokeDasharray="8 6"  style={{ animation: "dashFlow 5s linear 1s infinite" }} />
      <line x1="20" y1="300" x2="380" y2="300" stroke={CYAN}   strokeWidth="0.5" strokeDasharray="4 8"  style={{ animation: "dashFlow 6s linear 0.5s infinite" }} />
      <line x1="20" y1="420" x2="380" y2="420" stroke={PURPLE} strokeWidth="0.5" strokeDasharray="6 6"  style={{ animation: "dashFlow 4.5s linear 2s infinite" }} />
      <line x1="60"  y1="0"  x2="60"  y2="500" stroke={CYAN}   strokeWidth="0.5" strokeDasharray="4 8"  style={{ animation: "dashFlow 7s linear infinite" }} />
      <line x1="200" y1="0"  x2="200" y2="500" stroke={PURPLE} strokeWidth="0.5" strokeDasharray="6 6"  style={{ animation: "dashFlow 5s linear 1.5s infinite" }} />
      <line x1="340" y1="0"  x2="340" y2="500" stroke={CYAN}   strokeWidth="0.5" strokeDasharray="5 5"  style={{ animation: "dashFlow 6s linear 0.8s infinite" }} />

      {[[60,80],[200,80],[340,80],[60,160],[200,160],[340,160],[60,300],[200,300],[340,300],[60,420],[200,420],[340,420]].map(([cx,cy],i) => (
        <circle key={i} cx={cx} cy={cy} r="2.5" fill={i % 2 === 0 ? CYAN : PURPLE}
          style={{ animation: `hexPulse ${1.5 + (i % 3) * 0.5}s ease-in-out ${(i * 0.2).toFixed(1)}s infinite` }} />
      ))}

      <line x1="60"  y1="80"  x2="200" y2="160" stroke={CYAN}   strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="3 5" style={{ animation: "dashFlow 3.5s linear infinite" }} />
      <line x1="200" y1="160" x2="340" y2="80"  stroke={CYAN}   strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="3 5" style={{ animation: "dashFlow 3.5s linear 0.5s infinite" }} />
      <line x1="60"  y1="300" x2="200" y2="420" stroke={PURPLE} strokeWidth="0.5" strokeOpacity="0.35" strokeDasharray="3 5" style={{ animation: "dashFlow 4s linear 1s infinite" }} />
    </svg>
  );
}

function HudOverlay() {
  return (
    <div style={{ position: "absolute", top: 24, right: 24, fontFamily: "IBM Plex Mono, monospace", fontSize: 10, color: CYAN, opacity: 0.65 }}>
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
    <div style={{ position: "absolute", bottom: 24, left: 24, fontFamily: "IBM Plex Mono, monospace", fontSize: 9, color: CYAN, opacity: 0.55 }}>
      <div style={{ marginBottom: 8, letterSpacing: "0.1em", opacity: 0.5 }}>RANKING_LOAD</div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, height: 30 }}>
        {bars.map((h, i) => (
          <div
            key={i}
            style={{
              width: 8,
              height: `${h * 30}px`,
              background: CYAN,
              opacity: 0.5,
              borderRadius: 1,
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
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        minHeight: 420,
        overflow: "hidden",
        transform: "translateZ(0)",
      }}
    >
      <CircuitLines />

      {/* 2D rotating squares — no 3D, no face overlap, no glitch */}
      <RotatingSquare   size={80}  top="8%"   left="44%" duration={14}  delay={0}   color={CYAN}   opacity={0.35} />
      <RotatingSquare   size={50}  top="54%"  left="14%" duration={10}  delay={2}   color={CYAN}   opacity={0.28} />
      <RotatingDiamond  size={110} top="28%"  left="28%" duration={20}  delay={1}   color={PURPLE} opacity={0.3}  />
      <RotatingSquare   size={36}  top="70%"  left="64%" duration={8}   delay={3}   color={CYAN}   opacity={0.25} />
      <RotatingDiamond  size={60}  top="4%"   left="68%" duration={12}  delay={1.5} color={CYAN}   opacity={0.3}  />
      <RotatingSquare   size={24}  top="88%"  left="50%" duration={7}   delay={0.5} color={PURPLE} opacity={0.22} />
      <RotatingDiamond  size={44}  top="18%"  left="8%"  duration={16}  delay={2.5} color={PURPLE} opacity={0.25} />

      {/* Hexagons */}
      <Hexagon size={64}  top="15%"  left="60%"  duration={5}   delay={0}   color={CYAN}   />
      <Hexagon size={44}  top="65%"  left="35%"  duration={6.5} delay={1}   color={PURPLE} />
      <Hexagon size={80}  top="42%"  left="68%"  duration={7}   delay={0.5} color={CYAN}   />
      <Hexagon size={32}  top="82%"  left="18%"  duration={4.5} delay={2}   color={PURPLE} />
      <Hexagon size={52}  top="5%"   left="20%"  duration={8}   delay={1.5} color={CYAN}   />

      <HudOverlay />
      <HudBottomLeft />
    </div>
  );
}
