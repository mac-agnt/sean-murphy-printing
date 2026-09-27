/* Shared building blocks for the Murphy Print modules. Built on the Pulse theme
   tokens so every page stays visually Pulse. */
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { staff, fmtEUR, type Stage, type Risk } from "./data";
import { useDemo } from "./store";

export type Tone = "neutral" | "accent" | "ok" | "warn" | "bad" | "cyan" | "magenta" | "yellow";

const TONES: Record<Tone, { fg: string; bg: string; line: string }> = {
  neutral: { fg: "var(--dim)", bg: "var(--surface-2)", line: "var(--border)" },
  accent: { fg: "var(--accent)", bg: "var(--accent-faint)", line: "var(--accent-line)" },
  ok: { fg: "var(--ok)", bg: "var(--ok-soft)", line: "transparent" },
  warn: { fg: "var(--warn)", bg: "var(--warn-soft)", line: "transparent" },
  bad: { fg: "var(--bad)", bg: "var(--bad-soft)", line: "transparent" },
  cyan: { fg: "var(--p-cyan)", bg: "var(--p-cyan-soft)", line: "var(--p-cyan-line)" },
  magenta: { fg: "var(--p-magenta)", bg: "var(--p-magenta-soft)", line: "var(--p-magenta-line)" },
  yellow: { fg: "var(--p-yellow)", bg: "var(--p-yellow-soft)", line: "var(--p-yellow-line)" },
};
export const toneColor = (t: Tone) => TONES[t].fg;

export function Page({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div className="d-page" style={style}>{children}</div>;
}

/** Page heading: eyebrow optional, title, sub, right-aligned actions. */
export function Head({ eyebrow, title, sub, actions, back }: { eyebrow?: string; title: ReactNode; sub?: ReactNode; actions?: ReactNode; back?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 20, flexWrap: "wrap", padding: "14px 2px 22px" }}>
      <div style={{ flex: 1, minWidth: 260 }}>
        {back && (
          <button className="d-link" onClick={back.onClick} style={{ fontSize: 12.5, color: "var(--dim)", marginBottom: 10, display: "inline-flex", gap: 6, alignItems: "center" }}>
            <Icon d="M15 18l-6-6 6-6" size={13} /> {back.label}
          </button>
        )}
        {eyebrow && <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".16em", color: "var(--faint)", marginBottom: 8 }}>{eyebrow}</div>}
        <h1 style={{ margin: 0, fontSize: 36, fontWeight: 500, letterSpacing: "-1.4px", lineHeight: 1.05 }}>{title}</h1>
        {sub && <div style={{ fontSize: 14, color: "var(--dim)", marginTop: 9, maxWidth: 720, lineHeight: 1.5 }}>{sub}</div>}
      </div>
      {actions && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{actions}</div>}
    </div>
  );
}

export function Card({ children, style, pad = 20, title, action, sub, className, onClick }: { children?: ReactNode; style?: CSSProperties; pad?: number; title?: ReactNode; action?: ReactNode; sub?: ReactNode; className?: string; onClick?: () => void }) {
  return (
    <div className={"d-card " + (className || "")} onClick={onClick} style={{ padding: pad, minWidth: 0, ...style }}>
      {(title || action) && (
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14.5, fontWeight: 600, letterSpacing: "-.2px" }}>{title}</div>
            {sub && <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 4 }}>{sub}</div>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  );
}

export function Grid({ cols, gap = 14, children, style, min }: { cols?: string; gap?: number; children: ReactNode; style?: CSSProperties; min?: number }) {
  return <div style={{ display: "grid", gridTemplateColumns: cols || `repeat(auto-fit,minmax(${min || 170}px,1fr))`, gap, ...style }}>{children}</div>;
}

export function Badge({ tone = "neutral", children, dot, style }: { tone?: Tone; children: ReactNode; dot?: boolean; style?: CSSProperties }) {
  const t = TONES[tone];
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, height: 22, padding: "0 9px", borderRadius: 999, background: t.bg, border: "1px solid " + t.line, color: t.fg, fontSize: 11.5, fontWeight: 500, whiteSpace: "nowrap", ...style }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 9, background: t.fg }} />}
      {children}
    </span>
  );
}

export function Btn({ children, onClick, kind, size, disabled, icon, style, title }: { children?: ReactNode; onClick?: (e: React.MouseEvent) => void; kind?: "primary" | "danger" | "ghost"; size?: "sm"; disabled?: boolean; icon?: string; style?: CSSProperties; title?: string }) {
  return (
    <button title={title} className={["d-btn", kind, size].filter(Boolean).join(" ")} onClick={onClick} disabled={disabled} style={style}>
      {icon && <Icon d={icon} size={14} />}
      {children}
    </button>
  );
}

export function Chips<T extends string>({ options, value, onChange }: { options: { id: T; label: string; count?: number }[]; value: T; onChange: (v: T) => void }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {options.map((o) => (
        <button key={o.id} className={"d-chip" + (o.id === value ? " on" : "")} onClick={() => onChange(o.id)}>
          {o.label}{o.count !== undefined && <span style={{ opacity: .6, fontFamily: "var(--mono)", fontSize: 10.5 }}>{o.count}</span>}
        </button>
      ))}
    </div>
  );
}

export function Icon({ d, size = 16, stroke = 1.7, style }: { d: string; size?: number; stroke?: number; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: "none", ...style }}>
      <path d={d} />
    </svg>
  );
}

export const IC = {
  jobs: "M4 7h16v12H4z M9 7V5h6v2 M4 12h16",
  production: "M6 9V4h12v5 M6 18H4v-7h16v7h-2 M7 14h10v6H7z",
  online: "M3 5h18v12H3z M8 21h8 M12 17v4 M7 10l3 3 7-6",
  customers: "M16 19v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1 M9.5 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6 M21 19v-1a4 4 0 0 0-3-3.9 M16 4.1a3 3 0 0 1 0 5.8",
  finance: "M12 2v20 M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
  docket: "M6 3h9l4 4v14H6z M14 3v5h5 M9 12h7 M9 16h5",
  print: "M6 9V3h12v6 M6 18H4v-8h16v8h-2 M7 14h10v7H7z",
  download: "M12 3v12 M7 10l5 5 5-5 M5 21h14",
  check: "M5 12l5 5L20 7",
  x: "M6 6l12 12 M18 6L6 18",
  edit: "M4 20h4L19 9l-4-4L4 16z",
  mail: "M3 6h18v12H3z M3 7l9 6 9-6",
  alert: "M12 3l10 18H2z M12 10v5 M12 18v.5",
  pause: "M8 5v14 M16 5v14",
  arrow: "M5 12h14 M13 6l6 6-6 6",
  clock: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18 M12 7v5l3 2",
  sync: "M4 12a8 8 0 0 1 14-5.3L20 9 M20 4v5h-5 M20 12a8 8 0 0 1-14 5.3L4 15 M4 20v-5h5",
  card: "M3 6h18v12H3z M3 10h18",
  bolt: "M13 2L4 14h7l-1 8 9-12h-7z",
  qr: "M4 4h6v6H4z M14 4h6v6h-6z M4 14h6v6H4z M14 14h2v2h-2z M18 18h2v2h-2z",
  layers: "M12 3l9 5-9 5-9-5z M3 13l9 5 9-5",
  history: "M3 12a9 9 0 1 0 3-6.7L3 8 M3 3v5h5 M12 7v5l3 2",
  spark: "M12 3v4 M12 17v4 M3 12h4 M17 12h4 M6 6l2.5 2.5 M15.5 15.5L18 18 M6 18l2.5-2.5 M15.5 8.5L18 6",
};

/** Section label inside cards (plain, not an eyebrow). */
export function Label({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <div style={{ fontSize: 11.5, color: "var(--faint)", fontWeight: 500, ...style }}>{children}</div>;
}

/** Big number with a label; `tone` colours the value. */
export function Stat({ label, value, note, tone, onClick, big }: { label: string; value: ReactNode; note?: ReactNode; tone?: Tone; onClick?: () => void; big?: boolean }) {
  return (
    <div className={"d-card d-tile" + (onClick ? " click" : "")} onClick={onClick} style={{ padding: "16px 18px", minWidth: 0 }}>
      <Label>{label}</Label>
      <div style={{ fontSize: big ? 34 : 28, fontWeight: 600, letterSpacing: "-1px", marginTop: 8, lineHeight: 1, color: tone ? toneColor(tone) : "var(--ink)", fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {note && <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 8 }}>{note}</div>}
    </div>
  );
}

export type Col<R> = { key: string; label: string; w?: string; align?: "left" | "right" | "center"; render: (r: R) => ReactNode };

export function Table<R>({ cols, rows, onRow, rowKey, selected, empty, dense }: { cols: Col<R>[]; rows: R[]; onRow?: (r: R) => void; rowKey: (r: R) => string; selected?: string | null; empty?: ReactNode; dense?: boolean }) {
  const s = useDemo();
  const tpl = cols.map((c) => c.w || "1fr").join(" ");
  const pad = dense ? "9px 14px" : "12px 16px";
  return (
    <div style={{ overflowX: "auto" }} className="d-scroll">
      <div style={{ minWidth: cols.length * 96 }}>
        <div style={{ display: "grid", gridTemplateColumns: tpl, borderBottom: "1px solid var(--border)", background: "var(--surface-faint)" }}>
          {cols.map((c) => <div key={c.key} style={{ padding: "10px 16px", fontSize: 11.5, fontWeight: 500, color: "var(--faint)", textAlign: c.align || "left", whiteSpace: "nowrap" }}>{c.label}</div>)}
        </div>
        {rows.length === 0 && <div style={{ padding: 28, textAlign: "center", color: "var(--dim)", fontSize: 13 }}>{empty || "Nothing here right now."}</div>}
        {rows.map((r) => {
          const k = rowKey(r);
          return (
            <div key={k} className={"d-row" + (onRow ? " click" : "") + (selected === k ? " sel" : "") + (s.flash.includes(k) ? " flash" : "")}
              onClick={onRow ? () => onRow(r) : undefined}
              style={{ display: "grid", gridTemplateColumns: tpl, borderBottom: "1px solid var(--border)", alignItems: "center" }}>
              {cols.map((c) => <div key={c.key} style={{ padding: pad, fontSize: 13, minWidth: 0, textAlign: c.align || "left", overflow: "hidden", textOverflow: "ellipsis" }}>{c.render(r)}</div>)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function Avatar({ id, size = 26 }: { id: string; size?: number }) {
  const p = staff(id);
  return (
    <span title={p.name + " · " + p.role} style={{ width: size, height: size, flex: "none", borderRadius: 999, background: p.tint, color: "#0b0e10", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.36, fontWeight: 600 }}>{p.initials}</span>
  );
}

export function Person({ id }: { id: string }) {
  const p = staff(id);
  return <span style={{ display: "inline-flex", alignItems: "center", gap: 8, minWidth: 0 }}><Avatar id={id} size={22} /><span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.first}</span></span>;
}

const STAGE_TONE: Record<Stage, Tone> = {
  Quote: "neutral", Approved: "neutral", Artwork: "magenta", "Artwork Approval": "magenta", Production: "cyan",
  Finishing: "cyan", Ready: "ok", Dispatched: "ok", "Ready to Invoice": "yellow", Invoiced: "ok",
};
export const StageBadge = ({ stage }: { stage: Stage }) => <Badge tone={STAGE_TONE[stage]} dot>{stage}</Badge>;

export const RiskBadge = ({ risk }: { risk: Risk }) =>
  risk === "risk" ? <Badge tone="bad">At risk</Badge> : risk === "watch" ? <Badge tone="warn">Watch</Badge> : <span style={{ color: "var(--faint)", fontSize: 12 }}>On track</span>;

export const Money = ({ v, style }: { v: number; style?: CSSProperties }) => <span style={{ fontVariantNumeric: "tabular-nums", ...style }}>{fmtEUR(v)}</span>;
export const Mono = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => <span style={{ fontFamily: "var(--mono)", fontSize: 12, letterSpacing: ".01em", ...style }}>{children}</span>;

/** Clickable job id. */
export function JobLink({ id, onOpen }: { id: string; onOpen: (id: string) => void }) {
  return <button className="d-link" onClick={(e) => { e.stopPropagation(); onOpen(id); }} style={{ fontFamily: "var(--mono)", fontSize: 12.5, fontWeight: 500 }}>{id}</button>;
}

/** Vertical timeline. */
export function Timeline({ items }: { items: { t: string; text: ReactNode; tone?: Tone; who?: string }[] }) {
  return (
    <div style={{ position: "relative" }}>
      {items.map((it, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "48px 16px 1fr", gap: 10, alignItems: "start", paddingBottom: i === items.length - 1 ? 0 : 14 }}>
          <Mono style={{ color: "var(--faint)", paddingTop: 1 }}>{it.t}</Mono>
          <div style={{ position: "relative", height: "100%", display: "flex", justifyContent: "center" }}>
            <span style={{ width: 9, height: 9, marginTop: 4, borderRadius: 9, background: it.tone ? toneColor(it.tone) : "var(--neutral)", boxShadow: "0 0 0 3px var(--panel,#0f1316)", zIndex: 1 }} />
            {i < items.length - 1 && <span style={{ position: "absolute", top: 12, bottom: -14, width: 1, background: "var(--border-strong)" }} />}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.45, color: "var(--body)" }}>
            {it.text}
            {it.who && <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{it.who}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Horizontal flow of steps: used for workflows and the zero-rekey story. */
export function Flow({ steps, active, tone = "accent", compact }: { steps: string[]; active?: number; tone?: Tone; compact?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: compact ? 6 : 8 }}>
      {steps.map((s, i) => (
        <Fragment key={i}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 7, height: compact ? 26 : 30, padding: compact ? "0 10px" : "0 12px", borderRadius: 999, fontSize: compact ? 11.5 : 12.5, whiteSpace: "nowrap",
            background: active !== undefined && i <= active ? TONES[tone].bg : "var(--surface-2)",
            color: active !== undefined && i <= active ? TONES[tone].fg : "var(--body)",
            border: "1px solid " + (active !== undefined && i === active ? TONES[tone].line : "var(--border)") }}>
            {active !== undefined && i < active && <Icon d={IC.check} size={12} stroke={2.2} />}
            {s}
          </span>
          {i < steps.length - 1 && <Icon d={IC.arrow} size={13} style={{ color: "var(--faint)" }} />}
        </Fragment>
      ))}
    </div>
  );
}

/** Simple bar/area chart in SVG. */
export function Bars({ data, height = 150, tone = "cyan", format, highlightLast }: { data: { label: string; v: number }[]; height?: number; tone?: Tone; format?: (n: number) => string; highlightLast?: boolean }) {
  const max = Math.max(...data.map((d) => d.v)) * 1.1;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: height + 34 }}>
      {data.map((d, i) => {
        const last = highlightLast && i === data.length - 1;
        return (
          <div key={i} title={d.label + ": " + (format ? format(d.v) : d.v)} style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 10.5, color: last ? toneColor(tone) : "var(--faint)", fontVariantNumeric: "tabular-nums", whiteSpace: "nowrap", opacity: last || i % 3 === 2 ? 1 : 0 }}>{format ? format(d.v) : d.v}</div>
            <div style={{ width: "100%", height: Math.max(3, (d.v / max) * height), borderRadius: "7px 7px 3px 3px", background: last ? toneColor(tone) : TONES[tone].bg, border: "1px solid " + (last ? "transparent" : TONES[tone].line), transition: "height .5s var(--ease)" }} />
            <div style={{ fontSize: 10.5, color: "var(--faint)", whiteSpace: "nowrap" }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

/** Deterministic QR-style mark (placeholder: encodes nothing). */
export function QR({ seed, size = 96, ink = "var(--p-paper-ink)" }: { seed: string; size?: number; ink?: string }) {
  const n = 21;
  let h = 0;
  for (const c of seed) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const rnd = () => { h ^= h << 13; h ^= h >>> 17; h ^= h << 5; return (h >>> 0) / 4294967296; };
  const cells: ReactNode[] = [];
  const finder = (x: number, y: number) => x < 7 && y < 7 || x >= n - 7 && y < 7 || x < 7 && y >= n - 7;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if (finder(x, y)) continue;
    if (rnd() > 0.52) cells.push(<rect key={x + "-" + y} x={x} y={y} width={1} height={1} />);
  }
  const F = ({ x, y }: { x: number; y: number }) => (<g><rect x={x} y={y} width={7} height={7} /><rect x={x + 1} y={y + 1} width={5} height={5} fill="var(--p-paper)" /><rect x={x + 2} y={y + 2} width={3} height={3} /></g>);
  return (
    <svg width={size} height={size} viewBox={`-1 -1 ${n + 2} ${n + 2}`} shapeRendering="crispEdges" style={{ background: "var(--p-paper)", borderRadius: 4 }}>
      <g fill={ink}>{cells}<F x={0} y={0} /><F x={n - 7} y={0} /><F x={0} y={n - 7} /></g>
    </svg>
  );
}

/** Small "demo estimate" marker. */
export const DemoTag = ({ children = "Demo estimate" }: { children?: ReactNode }) => (
  <span style={{ fontFamily: "var(--mono)", fontSize: 9.5, letterSpacing: ".08em", color: "var(--faint)", border: "1px dashed var(--border-strong)", borderRadius: 6, padding: "2px 6px", textTransform: "uppercase", whiteSpace: "nowrap" }}>{children}</span>
);

/** Global toast, rendered once by AppShell. */
export function DemoToast() {
  const s = useDemo();
  if (!s.toast) return null;
  return (
    <div role="status" style={{ position: "fixed", left: "50%", bottom: 28, transform: "translateX(-50%)", zIndex: 90, display: "flex", alignItems: "center", gap: 10, padding: "12px 18px", borderRadius: 999, background: "var(--overlay)", border: "1px solid " + (s.toast.tone === "ok" ? "var(--accent-line)" : "var(--border-strong)"), backdropFilter: "blur(30px)", boxShadow: "0 18px 50px rgba(0,0,0,.45)", fontSize: 13, color: "var(--ink)", animation: "dToast .35s var(--ease) both", whiteSpace: "nowrap" }}>
      <span style={{ width: 20, height: 20, borderRadius: 99, background: s.toast.tone === "ok" ? "var(--accent)" : "var(--surface-2)", color: "var(--on-accent)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.check} size={12} stroke={2.6} /></span>
      {s.toast.text}
    </div>
  );
}
