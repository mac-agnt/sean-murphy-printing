import { css, txt } from "../../runtime/template";

type Props = { ops: any };

const glass: React.CSSProperties = {
  background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "var(--card-r,18px)",
  backdropFilter: "blur(20px) saturate(1.3)", boxShadow: "var(--card-shadow)",
};
const MAG = "var(--p-magenta, #e07aa8)";
const CYAN = "var(--p-cyan, #6fcfe4)";

/* The four print workflows as step flows. Customer Change → Controlled Revision
   is the hero: every step laid out left to right, with the approval gate lit. */
export default function WorkFlows({ ops }: Props) {
  const hero = ops?.hero;
  const flows: any[] = ops?.flows || [];
  if (!hero) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "14px" }}>
      <div className="ixx" onClick={hero.open} style={{ ...glass, padding: "18px 20px 20px", cursor: "pointer", position: "relative", overflow: "hidden", borderColor: "var(--border-strong)" }}>
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "3px", background: MAG, opacity: 0.8 }} />
        <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9.5px", letterSpacing: "0.12em", color: MAG }}>{"CHANGE CONTROL"}</span>
          <span style={{ fontSize: "16px", fontWeight: 600, letterSpacing: "-.3px" }}>{txt(hero.name)}</span>
          <span style={css(hero.statusStyle)}>{txt(hero.status)}</span>
          <span style={{ flex: 1 }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: "10.5px", color: "var(--faint)" }}>{txt(hero.runs)}</span>
        </div>
        <div style={{ fontSize: "12.5px", color: "var(--dim)", marginTop: "6px", maxWidth: "860px", lineHeight: 1.5 }}>{txt(hero.what)}</div>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${hero.steps.length}, minmax(0,1fr))`, gap: "0", marginTop: "18px" }}>
          {hero.steps.map((s: any, i: number) => {
            const tone = s.live ? MAG : s.gate ? "var(--warn)" : s.done ? CYAN : "var(--border-strong)";
            return (
              <div key={i} style={{ position: "relative", paddingRight: "10px" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span className={s.live ? "d-stop" : undefined} style={{ width: "26px", height: "26px", flex: "none", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--mono)", fontSize: "11px", fontWeight: 600, border: `1.5px solid ${tone}`,
                    background: s.live ? "rgba(224,122,168,.16)" : s.done ? "rgba(111,207,228,.12)" : "var(--surface-2)", color: s.live ? MAG : "var(--ink)" }}>{s.n}</span>
                  {!s.last && <span style={{ flex: 1, height: "2px", marginLeft: "6px", borderRadius: "2px", background: s.done ? CYAN : "var(--border)", opacity: s.done ? 0.7 : 1 }} />}
                </div>
                <div style={{ fontSize: "12.5px", fontWeight: 600, marginTop: "10px", color: s.live ? MAG : "var(--ink)" }}>{txt(s.verb)}</div>
                <div style={{ fontSize: "11.5px", color: "var(--dim)", marginTop: "3px", lineHeight: 1.4 }}>{txt(s.detail)}</div>
                {s.gate && <div style={{ display: "inline-block", marginTop: "7px", fontFamily: "var(--mono)", fontSize: "9px", letterSpacing: "0.1em", padding: "2px 7px", borderRadius: "6px", background: "var(--warn-soft)", color: "var(--warn)" }}>{s.live ? "WAITING ON SEAN" : "PERSON DECIDES"}</div>}
              </div>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)", fontSize: "12px", color: "var(--dim)" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: "9.5px", letterSpacing: "0.1em", color: "var(--faint)" }}>{"LAST RUN"}</span>
          <span style={{ color: "var(--ink)" }}>{txt(hero.last)}</span>
          <span style={{ flex: 1 }} />
          <span>{"Owner · " + hero.owner}</span>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "12px" }}>
        {flows.map((f: any, fi: number) => (
          <div key={fi} className="ixx" onClick={f.open} style={{ ...glass, padding: "15px 16px 14px", cursor: "pointer", display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ flex: 1, minWidth: 0, fontSize: "13.5px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txt(f.name)}</span>
              <span style={css(f.statusStyle)}>{txt(f.status)}</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0", marginTop: "12px" }}>
              {f.steps.map((s: any, i: number) => (
                <div key={i} style={{ display: "flex", gap: "10px" }}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <span style={{ width: "8px", height: "8px", borderRadius: "3px", marginTop: "4px", flex: "none",
                      background: s.gate ? "var(--warn)" : s.ext ? "var(--p-yellow, #e7c35a)" : i === 0 ? CYAN : "var(--border-strong)" }} />
                    {!s.last && <span style={{ flex: 1, width: "1px", minHeight: "10px", background: "var(--border)" }} />}
                  </div>
                  <div style={{ paddingBottom: "7px", minWidth: 0 }}>
                    <span style={{ fontSize: "11.5px", fontWeight: 600 }}>{txt(s.verb)}</span>
                    <span style={{ fontSize: "11.5px", color: "var(--dim)" }}>{" · " + s.detail}</span>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "auto", paddingTop: "10px", borderTop: "1px solid var(--border)", fontSize: "11px", color: "var(--dim)" }}>
              <span style={{ flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{txt(f.last)}</span>
              <span style={{ fontFamily: "var(--mono)", fontSize: "10px", color: "var(--faint)" }}>{txt(f.runs)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
