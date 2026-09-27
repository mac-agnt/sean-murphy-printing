import { css, txt } from "../../runtime/template";

type Props = { v: any };

const glass: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--card-r,18px)",
  backdropFilter: "blur(20px) saturate(1.3)", boxShadow: "var(--card-shadow)",
};

/* The print ontology: nine entities on one record spine, clickable, with the
   selected entity explained through a real instance (Byrne & Co). */
export default function RecordsSchema({ v }: Props) {
  const sc = v.onto?.schema;
  if (!sc) return null;
  const sel = sc.sel || {};
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
      <div style={{ ...glass, display: "flex", alignItems: "center", gap: "6px", padding: "10px 12px", overflowX: "auto", scrollbarWidth: "none" }}>
        <span style={{ flex: "none", fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--faint)", marginRight: "6px" }}>{"ONE JOB, ONE RECORD"}</span>
        {(sc.chain || []).map((c: any, i: number) => (
          <span key={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", flex: "none" }}>
            {i > 0 && <span style={{ color: "var(--faint)", fontSize: "11px" }}>{"→"}</span>}
            <button className="ixe" onClick={c.pick} title={c.id} style={{ display: "flex", alignItems: "center", gap: "6px", height: "28px", padding: "0 10px", borderRadius: "var(--r-ctl,9px)", cursor: "pointer", fontSize: "11.5px", whiteSpace: "nowrap",
              background: c.on ? "var(--surface-2)" : "none", border: "1px solid " + (c.on ? c.tint : "var(--border)"), color: c.on ? "var(--ink)" : "var(--body)", transition: "border-color .2s var(--ease),background .2s var(--ease)" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "2px", background: c.tint }} />
              {txt(c.value)}
            </button>
          </span>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "stretch" }}>
        <div style={{ ...glass, position: "relative", padding: "12px 12px", flex: "1 1 560px", minWidth: 0 }}>
          <div style={{ position: "relative", width: "100%", aspectRatio: "1000 / 540" }}>
            <svg viewBox="0 0 1000 540" preserveAspectRatio="none" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
              {(sc.edges || []).map((e: any, i: number) => (
                <g key={i}>
                  <line x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2} stroke={e.stroke} strokeWidth={e.width} strokeDasharray={e.dash || undefined} vectorEffect="non-scaling-stroke" style={{ transition: "stroke .2s" }} />
                  <text x={e.mx} y={e.my} textAnchor="middle" fontSize="11" fill={e.labelColor} style={{ fontFamily: "var(--mono)" }}>{e.label}</text>
                </g>
              ))}
            </svg>
            {(sc.nodes || []).map((n: any) => (
              <div key={n.id} onClick={n.pick} onMouseEnter={n.enter} onMouseLeave={n.leave} style={css(n.style)}>
                <span style={css(n.dotStyle)} />
                <span style={{ flex: "none" }}>
                  <span style={{ display: "block", fontSize: "12.5px", fontWeight: 600, whiteSpace: "nowrap" }}>{txt(n.id)}</span>
                  <span style={{ display: "block", fontFamily: "var(--mono)", fontSize: "9.5px", color: "var(--faint)", whiteSpace: "nowrap" }}>{txt(n.count)}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...glass, padding: "16px 18px", display: "flex", flexDirection: "column", minWidth: 0, flex: "1 1 280px", maxWidth: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ width: "9px", height: "9px", borderRadius: "2px", background: sel.tint }} />
            <span style={{ flex: 1, fontSize: "16px", fontWeight: 600, letterSpacing: "-.3px" }}>{txt(sel.id)}</span>
            <span style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.1em", color: "var(--faint)" }}>{String(sel.source || "").toUpperCase()}</span>
          </div>
          <div style={{ fontSize: "12.5px", color: "var(--dim)", lineHeight: 1.5, marginTop: "8px" }}>{txt(sel.note)}</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--faint)", marginTop: "16px" }}>{"EXAMPLE · BYRNE & CO"}</div>
          <div style={{ marginTop: "8px", padding: "11px 12px", borderRadius: "var(--r-md,12px)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
            <div style={{ fontSize: "14px", fontWeight: 600 }}>{txt(sel.example)}</div>
            {(sel.facts || []).map((f: any, i: number) => (
              <div key={i} style={{ display: "flex", gap: "10px", fontSize: "12px", padding: "6px 0 0" }}>
                <span style={{ flex: 1, color: "var(--dim)" }}>{txt(f.k)}</span>
                <span style={{ color: "var(--ink)", textAlign: "right" }}>{txt(f.v)}</span>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--faint)", marginTop: "16px" }}>{"CONNECTED TO"}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
            {(sel.links || []).map((l: any, i: number) => (
              <button key={i} className="ixe" onClick={l.pick} style={{ height: "26px", padding: "0 10px", borderRadius: "var(--r-ctl,9px)", background: "var(--chip)", border: "1px solid var(--chip-border)", fontSize: "11.5px", color: "var(--body)", cursor: "pointer" }}>{txt(l.label)}</button>
            ))}
          </div>
          <div style={{ flex: 1, minHeight: "12px" }} />
          <button className="ixp" onClick={sel.open} style={{ height: "36px", border: 0, borderRadius: "var(--cta-r,9px)", background: "var(--accent-fill,var(--accent))", color: "var(--on-accent)", boxShadow: "var(--accent-glow,none)", fontSize: "13px", fontWeight: 500, cursor: "pointer" }}>{txt(sel.openLabel)}</button>
        </div>
      </div>
    </div>
  );
}
