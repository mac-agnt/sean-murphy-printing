import type { ReactNode } from "react";
import { CHANGE, type Job, type DocketVersion, type Stage, type ActEvent } from "../../../demo/data";
import type { DemoState } from "../../../demo/store";
import { Icon, IC, Mono, toneColor, type Tone } from "../../../demo/ui";

export const STAGES: Stage[] = ["Quote", "Approved", "Artwork", "Artwork Approval", "Production", "Finishing", "Ready", "Dispatched", "Ready to Invoice", "Invoiced"];
export const STAGE_LABEL: Partial<Record<Stage, string>> = { Dispatched: "Collected / Dispatched" };

export const fmt = (n: number) => n.toLocaleString("en-IE");

/** Docket versions for any job: real history for J-10482, synthesised otherwise. */
export function docketsFor(s: DemoState, j: Job): DocketVersion[] {
  const real = s.dockets[j.id];
  if (real && real.length) return real;
  const src = j.quote ? "approved quote " + j.quote : "online order " + (j.order || "");
  if (j.docketV === 2) {
    return [
      { v: 1, created: "Mon 09:14", by: "Docket Agent", reason: "Created from " + src, qty: j.qty, names: j.specs.names, status: "Superseded" },
      { v: 2, created: "Yesterday 15:42", by: "Docket Agent", reason: "CR-117 approved: cover stock changed to 350gsm", qty: j.qty, names: j.specs.names, status: "Current" },
    ];
  }
  return [{ v: 1, created: j.source === "Website" ? "On payment" : "On quote approval", by: "Docket Agent", reason: "Created from " + src, qty: j.qty, names: j.specs.names, status: "Current" }];
}

export const isCR = (s: DemoState, j: Job) => j.id === CHANGE.jobId && s.changeState === "pending";

export function eventsFor(s: DemoState, id: string): ActEvent[] {
  return s.events.filter((e) => e.jobId === id);
}

export const KIND_ICON: Record<string, string> = {
  person: "M20 21v-1a5 5 0 0 0-5-5H9a5 5 0 0 0-5 5v1 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  agent: IC.spark,
  system: IC.sync,
  attention: IC.alert,
};
export const KIND_TONE: Record<string, Tone> = { person: "accent", agent: "cyan", system: "neutral", attention: "magenta" };

export function EventRow({ e, onJob }: { e: ActEvent; onJob?: (id: string) => void }) {
  const t = KIND_TONE[e.kind];
  return (
    <div style={{ display: "grid", gridTemplateColumns: "44px 28px 1fr", gap: 10, alignItems: "start", padding: "9px 0", borderBottom: "1px solid var(--border)" }}>
      <Mono style={{ color: "var(--faint)", paddingTop: 5 }}>{e.t}</Mono>
      <span style={{ width: 26, height: 26, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", color: toneColor(t), background: "var(--surface-2)", border: "1px solid var(--border)" }}>
        <Icon d={KIND_ICON[e.kind]} size={13} />
      </span>
      <div style={{ fontSize: 13, lineHeight: 1.45 }}>
        {e.text}
        <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>
          {e.who}{e.jobId && onJob && <> · <button className="d-link" style={{ fontSize: 11.5 }} onClick={() => onJob(e.jobId!)}>{e.jobId}</button></>}
        </div>
      </div>
    </div>
  );
}

/** Key/value line used in spec panels. */
export function KV({ k, v, note, tone }: { k: string; v: ReactNode; note?: ReactNode; tone?: Tone }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "130px 1fr", gap: 12, padding: "8px 0", borderBottom: "1px solid var(--border)", fontSize: 13 }}>
      <span style={{ color: "var(--faint)" }}>{k}</span>
      <span style={{ color: tone ? toneColor(tone) : "var(--ink)", minWidth: 0 }}>
        {v}{note && <span style={{ display: "block", fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{note}</span>}
      </span>
    </div>
  );
}
