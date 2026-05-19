import type { ClueEdge, ClueNode } from "../types";

function riskColor(risk: ClueNode["risk"]) {
  if (risk === "high") return "border-thread bg-thread/10";
  if (risk === "med") return "border-amber-600 bg-amber-50";
  return "border-ink/20 bg-paper";
}

export function ClueBoard({ nodes, edges }: { nodes: ClueNode[]; edges: ClueEdge[] }) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));

  return (
    <div className="tc-board">
      <svg className="tc-thread-svg" viewBox="0 0 100 100" preserveAspectRatio="none">
        {edges.map((e, i) => {
          const a = byId[e.from];
          const b = byId[e.to];
          if (!a || !b) return null;
          const mx = (a.x + b.x) / 2 + (i % 2 === 0 ? 4 : -4);
          const my = (a.y + b.y) / 2 - 3;
          return (
            <path
              key={`${e.from}-${e.to}-${i}`}
              d={`M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`}
              fill="none"
              stroke="#c62828"
              strokeWidth="0.35"
              strokeDasharray="1 0.6"
              opacity="0.85"
            />
          );
        })}
      </svg>
      {nodes.map((n) => (
        <div
          key={n.id}
          className={`tc-polaroid ${riskColor(n.risk)}`}
          style={{
            left: `calc(${n.x}% - 44px)`,
            top: `calc(${n.y}% - 52px)`,
            transform: `rotate(${(n.id.charCodeAt(0) % 7) - 3}deg)`,
          }}
        >
          <span className="tc-pin" />
          <div className="flex h-14 items-center justify-center bg-ink/5 font-mono text-[9px] text-inkMuted">
            📷
          </div>
          <p className="mt-1 text-center font-serif text-[10px] font-bold leading-tight text-ink">{n.label}</p>
          <p className="text-center font-mono text-[8px] text-inkMuted">{n.sub}</p>
        </div>
      ))}
    </div>
  );
}
