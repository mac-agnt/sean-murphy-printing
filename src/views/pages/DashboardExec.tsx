import { Fragment } from "react";
import { arr, css, txt } from "../../runtime/template";

type Props = { x: any };

const card: React.CSSProperties = {
  display: "flex", flexDirection: "column", background: "var(--surface)", border: "1px solid var(--border)",
  borderRadius: "var(--card-r,18px)", backdropFilter: "blur(20px) saturate(1.3)", boxShadow: "var(--card-shadow)",
  padding: "16px 18px 14px", minWidth: 0, animation: "springIn .5s var(--ease) both",
};

/* Executive summary: the admin Pulse removed, then operations, sales and finance. */
export default function DashboardExec({ x }: Props) {
  if (!x) return null;
  const e = x.efficiency || {};
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "12px", marginBottom: "12px" }}>
      <div className="ix16" style={{ ...card, position: "relative", overflow: "hidden", background: "linear-gradient(160deg, var(--accent-faint), var(--surface) 70%)", borderColor: "var(--accent-line)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "2px", background: "var(--accent)", flex: "none" }} />
          <span style={{ flex: 1, fontSize: "12.5px", fontWeight: 600 }}>{"Efficiency"}</span>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.12em", color: "var(--faint)" }}>{String(e.note || "").toUpperCase()}</span>
        </div>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "18px", marginTop: "14px", flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: "44px", fontWeight: 500, letterSpacing: "-1.6px", lineHeight: 1, fontVariantNumeric: "tabular-nums", animation: "kpiRoll .62s var(--ease) both" }}>{txt(e.dupes)}</div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "6px" }}>{"duplicate entries avoided"}</div>
          </div>
          <div style={{ paddingBottom: "2px" }}>
            <div style={{ fontSize: "26px", fontWeight: 500, letterSpacing: "-.8px", lineHeight: 1 }}>{txt(e.hours)}<span style={{ fontSize: "14px", color: "var(--dim)" }}>{" hrs"}</span></div>
            <div style={{ fontSize: "12px", color: "var(--dim)", marginTop: "6px" }}>{"admin time saved"}</div>
          </div>
        </div>
        <div style={{ fontSize: "12px", lineHeight: 1.55, color: "var(--body)", marginTop: "14px" }}>{txt(e.line)}</div>
        <div style={{ display: "flex", gap: "6px", marginTop: "auto", paddingTop: "12px", flexWrap: "wrap" }}>
          {["PrintLogic → Pulse", "Website → Pulse", "Pulse → Big Red Cloud"].map((l) => (
            <span key={l} style={{ fontFamily: "var(--mono)", fontSize: "9.5px", padding: "3px 8px", borderRadius: "var(--chip-r,6px)", background: "var(--chip)", border: "1px solid var(--chip-border)", color: "var(--dim)" }}>{l}</span>
          ))}
        </div>
      </div>
      {arr(x.groups).map((g: any, gi: number) => (
        <Fragment key={gi}>
          <div className="ix16" style={{ ...card, animationDelay: (gi + 1) * 70 + "ms" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
              <span style={css(g?.dot)} />
              <span style={{ fontSize: "12.5px", fontWeight: 600 }}>{txt(g?.title)}</span>
            </div>
            {arr(g?.items).map((i: any, ii: number) => (
              <div key={ii} style={{ display: "flex", alignItems: "baseline", gap: "10px", padding: "8px 0", borderTop: ii ? "1px solid var(--border)" : "0" }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "12px", color: "var(--body)" }}>{txt(i?.label)}</div>
                  <div style={{ fontSize: "10.5px", color: "var(--faint)", marginTop: "2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txt(i?.hint)}</div>
                </div>
                <div style={{ fontSize: "17px", fontWeight: 500, letterSpacing: "-.4px", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap" }}>{txt(i?.value)}</div>
              </div>
            ))}
          </div>
        </Fragment>
      ))}
    </div>
  );
}
