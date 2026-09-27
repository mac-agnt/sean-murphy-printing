import type { ReactNode } from "react";
import { useDemo, store, metrics } from "../../../demo/store";
import { CHANGE, customer, staff, type Job } from "../../../demo/data";
import { Head, Card, Table, Badge, Btn, Icon, IC, Mono, QR, StageBadge, JobLink, type Col } from "../../../demo/ui";
import { docketsFor, fmt } from "./shared";

const SCANS: Record<string, string> = {
  "J-10479": "Niall · 08:55", "J-10476": "Niall · 08:31", "J-10477": "Liam · 13:40", "J-10481": "Jack · 09:02", "J-10483": "Jack · 12:05",
  "J-10474": "Liam · 12:48", "J-10480": "Liam · 13:55", "J-10482": "Sarah · 10:14", "J-10473": "Jack · 13:03", "J-10475": "Jack · 10:22",
};

export default function Dockets() {
  const s = useDemo();
  if (s.docket) return <Ticket jobId={s.docket.jobId} v={s.docket.v} />;
  const m = metrics(s);
  type R = { j: Job; v: number; status: "Current" | "Superseded"; created: string; reason: string };
  const rows: R[] = m.live.flatMap((j) => docketsFor(s, j).slice().reverse().map((d) => ({ j, v: d.v, status: d.status, created: d.created, reason: d.reason })));
  const printed = (r: R) => r.status === "Superseded" ? "Recalled via QR" : r.j.stage === "Artwork" && r.j.source === "Website" ? "Not yet" : "Printed";
  const cols: Col<R>[] = [
    { key: "j", label: "Job", w: "92px", render: (r) => <JobLink id={r.j.id} onOpen={store.openJob} /> },
    { key: "c", label: "Customer", w: "minmax(170px,1.3fr)", render: (r) => r.j.customer },
    { key: "p", label: "Product", w: "minmax(120px,1fr)", render: (r) => <span style={{ color: "var(--dim)" }}>{r.j.product} · {fmt(r.j.qty)}</span> },
    { key: "v", label: "Version", w: "72px", render: (r) => <Mono style={{ fontWeight: 600 }}>V{r.v}</Mono> },
    { key: "s", label: "Status", w: "110px", render: (r) => r.status === "Current" ? <Badge tone="cyan" dot>Current</Badge> : <Badge tone="neutral" style={{ textDecoration: "line-through" }}>Superseded</Badge> },
    { key: "st", label: "Stage", w: "140px", render: (r) => <StageBadge stage={r.j.stage} /> },
    { key: "pr", label: "Printed", w: "120px", render: (r) => <span style={{ color: r.status === "Superseded" ? "var(--p-magenta)" : "var(--dim)", fontSize: 12.5 }}>{printed(r)}</span> },
    { key: "sc", label: "Last scanned", w: "112px", render: (r) => <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{r.status === "Current" ? SCANS[r.j.id] || "Not scanned" : "Blocked"}</span> },
    { key: "r", label: "Reason", w: "minmax(200px,1.6fr)", render: (r) => <span style={{ fontSize: 12.5, color: "var(--faint)" }}>{r.reason}</span> },
  ];
  const cur = rows.filter((r) => r.status === "Current").length;
  return (
    <div className="d-in" style={{ display: "grid", gap: 14 }}>
      <div className="d-card" style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 18, alignItems: "center", padding: "16px 20px" }}>
        <QR seed="dockets" size={54} />
        <div>
          <div style={{ fontSize: 15, fontWeight: 600 }}>Paper travels with the sample. Pulse is the record.</div>
          <div style={{ fontSize: 13, color: "var(--dim)", marginTop: 4 }}>Every printed docket carries a QR code. Scanning a superseded docket on the floor opens the current version and warns the operator.</div>
        </div>
        <div style={{ display: "flex", gap: 22 }}>
          <div><div style={{ fontSize: 24, fontWeight: 600 }}>{cur}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>current</div></div>
          <div><div style={{ fontSize: 24, fontWeight: 600, color: "var(--p-magenta)" }}>{rows.length - cur}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>superseded</div></div>
        </div>
      </div>
      <Card pad={0}>
        <Table cols={cols} rows={rows} rowKey={(r) => r.j.id + "-" + r.v} onRow={(r) => store.openDocket(r.j.id, r.v)} dense />
      </Card>
    </div>
  );
}

/* ---------------- The printable ticket ---------------- */

function F({ k, children, span = 1, big }: { k: string; children: ReactNode; span?: number; big?: boolean }) {
  return (
    <div style={{ gridColumn: `span ${span}`, padding: "9px 12px", borderRight: "1px solid var(--p-paper-line)", borderBottom: "1px solid var(--p-paper-line)", minWidth: 0 }}>
      <div style={{ fontFamily: "var(--mono)", fontSize: 8.5, letterSpacing: ".14em", textTransform: "uppercase", color: "var(--p-paper-dim)" }}>{k}</div>
      <div style={{ fontSize: big ? 20 : 13, fontWeight: big ? 700 : 500, marginTop: 3, lineHeight: 1.3, letterSpacing: big ? "-.4px" : undefined }}>{children}</div>
    </div>
  );
}

function Ticket({ jobId, v }: { jobId: string; v: number }) {
  const s = useDemo();
  const j = s.jobs.find((x) => x.id === jobId);
  if (!j) return <Card>Docket not found.</Card>;
  const versions = docketsFor(s, j);
  const d = versions.find((x) => x.v === v) || versions[versions.length - 1];
  const sup = d.status === "Superseded";
  const cust = customer(j.customerId);
  const hero = j.id === CHANGE.jobId;
  const qty = d.qty, names = d.names ?? j.specs.names;
  const artV = hero ? `V${d.v}${d.v === 3 ? " (revision in progress)" : ""}` : "V1";
  const pages = j.specs.pages ? ` · ${j.specs.pages}` : "";

  return (
    <div className="d-in">
      <Head back={{ label: "All dockets", onClick: store.closeDocket }} title={<span>Docket <Mono style={{ fontSize: 34, fontWeight: 600 }}>{j.id}</Mono></span>}
        sub={<>Digital job ticket for {j.customer}. <button className="d-link" onClick={() => store.openJob(j.id)}>Open live job</button></>} />
      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 260px", gap: 18, alignItems: "start" }}>
        <div className="d-print" style={{ position: "relative", overflow: "hidden", background: "var(--p-paper)", color: "var(--p-paper-ink)", borderRadius: 6, padding: "30px 32px", boxShadow: "0 30px 70px rgba(0,0,0,.35), 0 2px 0 rgba(0,0,0,.08)" }}>
          {sup && <div style={{ position: "absolute", top: "42%", left: "50%", transform: "translate(-50%,-50%) rotate(-22deg)", border: "5px solid rgba(178,60,116,.55)", color: "rgba(178,60,116,.6)", fontFamily: "var(--mono)", fontWeight: 800, fontSize: 64, letterSpacing: ".14em", padding: "6px 26px", borderRadius: 10, pointerEvents: "none", whiteSpace: "nowrap", zIndex: 2 }}>SUPERSEDED</div>}
          <div style={{ display: "flex", justifyContent: "space-between", gap: 20, alignItems: "flex-start", paddingBottom: 18, borderBottom: "2px solid var(--p-paper-ink)" }}>
            <div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: ".2em", color: "var(--p-paper-dim)" }}>PRODUCTION DOCKET</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 38, fontWeight: 700, letterSpacing: "-1px", marginTop: 6 }}>JOB {j.id}</div>
              <div style={{ display: "inline-block", marginTop: 10, padding: "5px 11px", fontFamily: "var(--mono)", fontSize: 12, fontWeight: 700, letterSpacing: ".1em", background: sup ? "transparent" : "var(--p-paper-ink)", color: sup ? "#b23c74" : "var(--p-paper)", border: sup ? "1.5px solid #b23c74" : "1.5px solid var(--p-paper-ink)" }}>
                DOCKET V{d.v} — {sup ? "SUPERSEDED" : "CURRENT"}
              </div>
              <div style={{ fontSize: 11.5, color: "var(--p-paper-dim)", marginTop: 10 }}>Generated {d.created} by {d.by} · {d.reason}</div>
            </div>
            <div style={{ textAlign: "center", width: 124 }}>
              <QR seed={j.id + "-v" + d.v} size={112} />
              <div style={{ fontSize: 9.5, lineHeight: 1.35, color: "var(--p-paper-dim)", marginTop: 6 }}>Scan for the live job. Paper is a copy, Pulse is the record.</div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", borderLeft: "1px solid var(--p-paper-line)", borderTop: "1px solid var(--p-paper-line)", marginTop: 18 }}>
            <F k="Customer" span={2}>{j.customer}</F>
            <F k="Contact">{j.contact}{cust && <div style={{ fontSize: 11, color: "var(--p-paper-dim)" }}>{cust.phone}</div>}</F>
            <F k="Required">{j.due}</F>
            <F k="Product" span={2} big>{j.product}</F>
            <F k="Quantity" big>{fmt(qty)}</F>
            <F k={j.quote ? "Quote" : "Order"}>{j.quote || j.order}</F>
            <F k="Finished size">{j.specs.size}</F>
            <F k="Paper / stock">{j.specs.stock}</F>
            <F k="Colours">{j.specs.print}{pages}</F>
            <F k="Finishing">{j.specs.finish}</F>
            <F k="Packaging">{j.specs.packaging}</F>
            <F k="Delivery / collection">{j.specs.delivery}</F>
            <F k="Names">{names ?? "n/a"}</F>
            <F k="Artwork version">{artV}</F>
            <F k="Artwork notes" span={2}>{hero ? (d.v === 3 ? "Add three new names and titles from Claire Byrne's email (11:24). Same layout as V2." : "Match previous Byrne & Co card layout. Logo PMS 541 converted to CMYK.") : "Customer supplied files. Check bleed and resolution before plating."}</F>
            <F k="Production notes" span={2}>{`${j.resource || "Assign at scheduling"}. ${hero && d.v === 3 ? "Run 400 per name, 5 names." : "Standard run."}`}</F>
            <F k="Special instructions" span={2}>{j.notes || (j.source === "Website" ? "Prepaid online order. No payment to collect." : "Account customer. Invoice through Big Red Cloud on completion.")}</F>
            <F k="Current status" span={2}>{sup ? "Do not produce from this docket. Scan for current version." : `${j.stage} · ${j.status}`}</F>
            <F k="Printed at" span={2}>{d.created} · {staff(j.owner).name}</F>
          </div>

          <div style={{ fontFamily: "var(--mono)", fontSize: 9, letterSpacing: ".16em", color: "var(--p-paper-dim)", marginTop: 20, marginBottom: 8 }}>PRODUCTION SIGN-OFF</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8 }}>
            {["Artwork", "Production", "Finishing", "Quality Check", "Dispatch"].map((k) => (
              <div key={k} style={{ border: "1.5px solid var(--p-paper-ink)", padding: "8px 10px 10px" }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{k}</div>
                <div style={{ fontSize: 9, color: "var(--p-paper-dim)", marginTop: 14, borderTop: "1px solid var(--p-paper-line)", paddingTop: 3 }}>Initials</div>
                <div style={{ fontSize: 9, color: "var(--p-paper-dim)", marginTop: 12, borderTop: "1px solid var(--p-paper-line)", paddingTop: 3 }}>Time</div>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: "var(--p-paper-dim)", marginTop: 16, fontFamily: "var(--mono)", letterSpacing: ".06em" }}>
            <span>PHYSICAL SAMPLE TRAVELS WITH THIS DOCKET</span>
            <span>{j.id} · V{d.v} of {versions.length}</span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 12, position: "sticky", top: 12 }}>
          <Card pad={16}>
            <div style={{ display: "grid", gap: 8 }}>
              <Btn kind="primary" icon={IC.print} onClick={() => window.print()}>Print Docket</Btn>
              <Btn icon={IC.download} onClick={() => { window.print(); store.toast("Saved as PDF"); }}>Download PDF</Btn>
              <Btn icon={IC.jobs} onClick={() => store.openJob(j.id)}>Open live job</Btn>
            </div>
          </Card>
          <Card pad={16} title="View Previous Versions" sub={`${versions.length} version${versions.length > 1 ? "s" : ""} on record`}>
            {versions.slice().reverse().map((x) => (
              <button key={x.v} onClick={() => store.setDocketVersion(x.v)} className="d-row click" style={{ display: "grid", gridTemplateColumns: "36px 1fr", gap: 10, width: "100%", textAlign: "left", font: "inherit", color: "inherit", padding: "9px 10px", marginBottom: 4, borderRadius: 10, border: "1px solid " + (x.v === d.v ? "var(--accent-line)" : "transparent"), background: x.v === d.v ? "var(--accent-faint)" : "none" }}>
                <Mono style={{ fontSize: 14, fontWeight: 600, color: x.status === "Current" ? "var(--p-cyan)" : "var(--dim)" }}>V{x.v}</Mono>
                <span style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 12.5, display: "block" }}>{x.status} · {fmt(x.qty)}{x.names ? ` · ${x.names} names` : ""}</span>
                  <span style={{ fontSize: 11, color: "var(--faint)" }}>{x.created} · {x.reason}</span>
                </span>
              </button>
            ))}
          </Card>
          <div style={{ fontSize: 12, color: "var(--faint)", lineHeight: 1.5, padding: "0 4px", display: "flex", gap: 8 }}>
            <Icon d={IC.qr} size={14} style={{ marginTop: 2 }} />
            Superseded dockets stay on file. Scanning one on the floor redirects to the current version.
          </div>
        </div>
      </div>
    </div>
  );
}
