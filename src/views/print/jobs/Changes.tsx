import { useState } from "react";
import { useDemo, store } from "../../../demo/store";
import { CHANGE } from "../../../demo/data";
import { Card, Grid, Chips, Badge, Btn, Icon, IC, Mono, Money, Table, JobLink, type Col } from "../../../demo/ui";

type Tab = "active" | "approval" | "history" | "superseded";

const PAST = [
  { id: "CR-117", job: "J-10476", customer: "Fitzgerald Auctioneers", what: "Cover stock 300gsm → 350gsm", by: "Sean Murphy", when: "Yesterday 15:40", result: "Approved", docket: "V1 → V2", value: 40 },
  { id: "CR-116", job: "J-10469", customer: "Harbour View Hotel", what: "Delivery moved to Friday, 2 extra drop points", by: "Emma Walsh", when: "Thu 24 Sep", result: "Approved", docket: "V1 → V2", value: 35 },
  { id: "CR-115", job: "J-10466", customer: "Delaney Plumbing", what: "Add QR code to reverse", by: "Sean Murphy", when: "Wed 23 Sep", result: "Approved", docket: "V1 → V2", value: 0 },
  { id: "CR-114", job: "J-10457", customer: "Castle Events", what: "Quantity 300 → 150 after print started", by: "Sean Murphy", when: "Mon 7 Sep", result: "Rejected", docket: "V1 kept", value: 0 },
];

function CR118() {
  const s = useDemo();
  const st = s.changeState;
  return (
    <Card pad={0} style={{ overflow: "hidden", borderColor: st === "pending" ? "var(--p-magenta-line)" : undefined }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--border)", background: st === "pending" ? "var(--p-magenta-soft)" : st === "approved" ? "var(--ok-soft)" : "var(--surface-2)", flexWrap: "wrap" }}>
        <span className={st === "pending" ? "d-stop" : undefined} style={{ width: 34, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", color: st === "pending" ? "var(--p-magenta)" : st === "approved" ? "var(--ok)" : "var(--dim)" }}>
          <Icon d={st === "pending" ? IC.alert : st === "approved" ? IC.check : IC.x} size={16} />
        </span>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 12.5, fontWeight: 700, letterSpacing: ".1em", color: st === "pending" ? "var(--p-magenta)" : st === "approved" ? "var(--ok)" : "var(--dim)" }}>
            {st === "pending" ? "CHANGE DETECTED" : st === "approved" ? "CHANGE APPROVED" : "CHANGE REJECTED"}
          </div>
          <div style={{ fontSize: 13, marginTop: 2 }}>
            <Mono style={{ fontWeight: 600 }}>{CHANGE.id}</Mono> · <JobLink id={CHANGE.jobId} onOpen={store.openJob} /> · <button className="d-link" onClick={() => store.openCustomer("byrne")}>{CHANGE.customer}</button> · Business Cards
          </div>
        </div>
        <Badge tone="cyan"><Icon d={IC.spark} size={11} /> Change Control agent</Badge>
        <Badge tone="neutral">Confidence {Math.round(CHANGE.confidence * 100)}%</Badge>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(0,.9fr) minmax(0,1.3fr)" }}>
        <div style={{ padding: 20, borderRight: "1px solid var(--border)" }}>
          <div style={{ fontSize: 11.5, color: "var(--faint)", marginBottom: 8 }}>Source email · {CHANGE.received}</div>
          <div style={{ borderRadius: 12, border: "1px solid var(--border)", background: "var(--surface-2)", padding: 14 }}>
            <div style={{ fontSize: 12, color: "var(--dim)" }}>From <span style={{ color: "var(--ink)" }}>{CHANGE.from}</span></div>
            <div style={{ fontSize: 12.5, fontWeight: 600, margin: "6px 0 10px" }}>{CHANGE.subject}</div>
            <div style={{ fontSize: 13, lineHeight: 1.6, whiteSpace: "pre-wrap", color: "var(--body)" }}>
              {CHANGE.email.split(/(2,000 cards|three more names)/).map((p, i) => i % 2 ? <mark key={i} style={{ background: "var(--p-magenta-soft)", color: "var(--p-magenta)", borderRadius: 4, padding: "0 2px" }}>{p}</mark> : p)}
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 10, display: "flex", gap: 6, alignItems: "center" }}><Icon d={IC.docket} size={12} /> names-and-titles.docx</div>
          </div>
        </div>

        <div style={{ padding: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "110px 1fr 20px 1fr", fontSize: 11.5, color: "var(--faint)", paddingBottom: 8, borderBottom: "1px solid var(--border)" }}>
            <span>Field</span><span>Docket V2 (current)</span><span /><span>Requested</span>
          </div>
          {CHANGE.fields.map((f) => (
            <div key={f.k} style={{ display: "grid", gridTemplateColumns: "110px 1fr 20px 1fr", alignItems: "center", fontSize: 13, padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <span style={{ color: "var(--dim)" }}>{f.k}</span>
              <span style={{ color: st === "approved" ? "var(--faint)" : "var(--body)", textDecoration: st === "approved" ? "line-through" : undefined }}>{f.from}</span>
              <Icon d={IC.arrow} size={12} style={{ color: "var(--faint)" }} />
              <span style={{ color: st === "rejected" ? "var(--faint)" : "var(--p-magenta)", fontWeight: 600 }}>{f.to}</span>
            </div>
          ))}
          <Grid min={140} gap={8} style={{ marginTop: 14 }}>
            {[
              { i: IC.layers, t: "Artwork revision required", d: "3 new names for Sarah" },
              { i: IC.pause, t: "Production paused", d: "Digital Press 1 slot held" },
              { i: IC.finance, t: "Requote", d: <>€210 → <Money v={CHANGE.valueAfter} /> (+€265)</> },
            ].map((x) => (
              <div key={x.t} style={{ padding: 12, borderRadius: 12, background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <Icon d={x.i} size={14} style={{ color: "var(--p-magenta)" }} />
                <div style={{ fontSize: 12.5, fontWeight: 600, marginTop: 6 }}>{x.t}</div>
                <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 2 }}>{x.d}</div>
              </div>
            ))}
          </Grid>
        </div>
      </div>

      <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border)" }}>
        {st === "pending" && (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <Btn kind="primary" icon={IC.check} onClick={store.approveChange}>Approve Change</Btn>
            <Btn kind="danger" icon={IC.x} onClick={store.rejectChange}>Reject</Btn>
            <Btn icon={IC.edit} onClick={() => store.toast("Change opened for editing before approval", "info")}>Edit</Btn>
            <Btn icon={IC.mail} onClick={() => store.toast("Draft opened for Emma Walsh to Claire Byrne", "info")}>Contact Customer</Btn>
            <span style={{ flex: 1 }} />
            <span style={{ fontSize: 12, color: "var(--faint)" }}>Approving creates Docket V3 and notifies artwork and production.</span>
          </div>
        )}
        {st === "approved" && (
          <div className="d-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 8 }}>
              {["Docket V2 superseded", "Docket V3 current", "Sarah Byrne notified", "Production queue updated", "Activity recorded", "Revised quote to PrintLogic"].map((t, i) => (
                <div key={t} className="d-in" style={{ animationDelay: i * 90 + "ms", display: "flex", gap: 8, alignItems: "center", fontSize: 12.5, padding: "9px 11px", borderRadius: 10, background: "var(--ok-soft)" }}>
                  <Icon d={IC.check} size={13} stroke={2.4} style={{ color: "var(--ok)" }} /> {t}
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
              <Btn kind="primary" icon={IC.docket} onClick={() => store.openDocket(CHANGE.jobId, 3)}>Open Docket V3</Btn>
              <Btn icon={IC.jobs} onClick={() => store.openJob(CHANGE.jobId)}>View job</Btn>
              <Btn icon={IC.history} onClick={() => store.go("Activity")}>View activity</Btn>
            </div>
          </div>
        )}
        {st === "rejected" && <div style={{ fontSize: 13, color: "var(--dim)" }}>Rejected. Work continues on Docket V2 (1,000 cards, 2 names). Emma has a reply drafted for Claire.</div>}
      </div>
    </Card>
  );
}

export default function Changes() {
  const s = useDemo();
  const [tab, setTab] = useState<Tab>("active");
  const pending = s.changeState === "pending";
  const history = [
    ...(s.changeState !== "pending" ? [{ id: CHANGE.id, job: CHANGE.jobId, customer: CHANGE.customer, what: "Quantity 1,000 → 2,000, names 2 → 5", by: "Sean Murphy", when: "Today", result: s.changeState === "approved" ? "Approved" : "Rejected", docket: s.changeState === "approved" ? "V2 → V3" : "V2 kept", value: s.changeState === "approved" ? 265 : 0 }] : []),
    ...PAST,
  ];
  type H = (typeof history)[number];
  const hcols: Col<H>[] = [
    { key: "id", label: "Change", w: "80px", render: (r) => <Mono style={{ fontWeight: 600 }}>{r.id}</Mono> },
    { key: "j", label: "Job", w: "90px", render: (r) => <JobLink id={r.job} onOpen={store.openJob} /> },
    { key: "c", label: "Customer", w: "minmax(150px,1fr)", render: (r) => r.customer },
    { key: "w", label: "Change", w: "minmax(200px,1.6fr)", render: (r) => <span style={{ color: "var(--dim)" }}>{r.what}</span> },
    { key: "d", label: "Docket", w: "90px", render: (r) => <Mono>{r.docket}</Mono> },
    { key: "v", label: "Value", w: "70px", align: "right", render: (r) => r.value ? <>+<Money v={r.value} /></> : <span style={{ color: "var(--faint)" }}>€0</span> },
    { key: "r", label: "Decision", w: "100px", render: (r) => <Badge tone={r.result === "Approved" ? "ok" : "neutral"}>{r.result}</Badge> },
    { key: "b", label: "By", w: "minmax(140px,1fr)", render: (r) => <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{r.by} · {r.when}</span> },
  ];
  const supd = [
    ...(s.dockets[CHANGE.jobId] || []).filter((d) => d.status === "Superseded").map((d) => ({ job: CHANGE.jobId, customer: CHANGE.customer, v: d.v, when: d.created, why: d.v === 2 ? "Replaced by V3 after CR-118" : "Replaced by V2 when artwork approved" })),
    { job: "J-10476", customer: "Fitzgerald Auctioneers", v: 1, when: "Mon 09:14", why: "Replaced by V2 after CR-117 (cover stock)" },
  ];

  return (
    <div className="d-in" style={{ display: "grid", gap: 14 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <Chips<Tab> value={tab} onChange={setTab} options={[
          { id: "active", label: "Active Changes", count: pending ? 1 : 0 },
          { id: "approval", label: "Approval Required", count: pending ? 1 : 0 },
          { id: "history", label: "Change History", count: history.length },
          { id: "superseded", label: "Superseded Dockets", count: supd.length },
        ]} />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 12, color: "var(--faint)" }}>Change Control watches the jobs@ inbox and every job thread.</span>
      </div>

      {(tab === "active" || tab === "approval") && (
        pending || tab === "active" ? <CR118 /> : <Card><div style={{ fontSize: 13, color: "var(--dim)" }}>Nothing waiting for approval. CR-118 was {s.changeState}.</div></Card>
      )}
      {tab === "active" && (
        <Card title="How a change moves" sub="Same controlled path for every job">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center", fontSize: 12.5 }}>
            {["Email received", "AI detects spec change", "Comparison generated", "Workflow paused", "Approval requested", "New docket version", "Staff notified"].map((t, i, a) => (
              <span key={t} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <span style={{ padding: "5px 10px", borderRadius: 999, border: "1px solid var(--border)", background: i === 4 && pending ? "var(--p-magenta-soft)" : "var(--surface-2)", color: i === 4 && pending ? "var(--p-magenta)" : "var(--body)" }}>{t}</span>
                {i < a.length - 1 && <Icon d={IC.arrow} size={11} style={{ color: "var(--faint)" }} />}
              </span>
            ))}
          </div>
        </Card>
      )}
      {tab === "history" && <Card pad={0}><Table cols={hcols} rows={history} rowKey={(r) => r.id} onRow={(r) => r.job === CHANGE.jobId ? store.openJob(r.job) : undefined} /></Card>}
      {tab === "superseded" && (
        <Grid min={260}>
          {supd.map((d) => (
            <div key={d.job + d.v} className="d-card d-tile click" onClick={() => store.openDocket(d.job, d.v)} style={{ padding: 16, position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", right: -18, top: 16, transform: "rotate(18deg)", fontFamily: "var(--mono)", fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: "var(--p-magenta)", border: "1.5px solid var(--p-magenta-line)", padding: "2px 22px" }}>SUPERSEDED</div>
              <Mono style={{ fontSize: 15, fontWeight: 600 }}>{d.job} · V{d.v}</Mono>
              <div style={{ fontSize: 13, marginTop: 4 }}>{d.customer}</div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 10 }}>{d.why}</div>
              <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 4 }}>Created {d.when} · QR redirects to current</div>
            </div>
          ))}
        </Grid>
      )}
    </div>
  );
}
