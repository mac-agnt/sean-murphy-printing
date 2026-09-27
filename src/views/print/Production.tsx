import { useState, type CSSProperties, type ReactNode } from "react";
import { useDemo, store, metrics } from "../../demo/store";
import { SCHEDULE, CHANGE, RESOURCES, ORDERS, fmtNum, type Job, type Resource } from "../../demo/data";
import { Page, Head, Card, Grid, Badge, Btn, Chips, Icon, IC, Label, Stat, Table, Person, Money, Mono, JobLink, DemoTag, Avatar, type Tone } from "../../demo/ui";

const NOW = 13 + 20 / 60;
const DAY_START = 8, DAY_END = 18, SPAN = DAY_END - DAY_START;
const hh = (n: number) => String(Math.floor(n)).padStart(2, "0") + ":" + String(Math.round((n % 1) * 60)).padStart(2, "0");

/* Guillotine work is not in the press schedule; short cutting slots are derived from the jobs that pass through it. */
const GUILLOTINE = [
  { resource: "Guillotine" as Resource, jobId: "J-10481", start: 11, end: 11.75 },
  { resource: "Guillotine" as Resource, jobId: "J-10477", start: 13, end: 13.9 },
  { resource: "Guillotine" as Resource, jobId: "J-10479", start: 14.2, end: 15.2 },
  { resource: "Guillotine" as Resource, jobId: "J-10474", start: 16.5, end: 17.2 },
];
const ALL_BLOCKS = [...SCHEDULE, ...GUILLOTINE];

const stopStripes: CSSProperties = {
  background: "repeating-linear-gradient(135deg, var(--p-magenta-soft) 0 10px, transparent 10px 20px)",
  border: "1.5px solid var(--p-magenta)",
};

export default function Production() {
  const s = useDemo();
  const sec = s.section.Production;
  return (
    <Page>
      {sec === "overview" && <Overview />}
      {sec === "artwork" && <Artwork />}
      {sec === "queue" && <Queue />}
      {sec === "schedule" && <Schedule />}
      {sec === "completed" && <Completed />}
    </Page>
  );
}

/* ---------------- Overview ---------------- */
function Overview() {
  const s = useDemo();
  const m = metrics(s);
  const job = (id: string) => s.jobs.find((j) => j.id === id);
  const deadlines = m.live
    .filter((j) => j.dueDay === "Today" && j.stage !== "Ready to Invoice")
    .map((j) => ({ j, t: parseFloat((j.due.match(/(\d\d):(\d\d)/) || ["", "18", "00"]).slice(1).join(".")) }))
    .sort((a, b) => a.t - b.t);
  const nova = job("J-10479");
  return (
    <>
      <Head title="Production" sub="Every press, every deadline, one live view. Same job records as quoting, dockets and invoicing." actions={<>
        <Btn icon={IC.layers} onClick={() => store.setSection("Production", "queue")}>Open queue</Btn>
        <Btn kind="primary" icon={IC.clock} onClick={() => store.setSection("Production", "schedule")}>Today's schedule</Btn>
      </>} />
      <Grid cols="repeat(5,minmax(0,1fr))" style={{ marginBottom: 14 }}>
        <Stat label="Artwork queue" value={m.artwork.length} note="6 jobs, 1 change pending" tone="magenta" onClick={() => store.setSection("Production", "artwork")} />
        <Stat label="Production queue" value={m.production.length} note="Printing, finishing, QC" tone="cyan" onClick={() => store.setSection("Production", "queue")} />
        <Stat label="Due today" value={m.dueToday} note={`Next: ${deadlines[0]?.j.id ?? ""} at ${deadlines[0] ? deadlines[0].j.due.replace("Today ", "") : ""}`} />
        <Stat label="At risk" value={m.attention.length} tone="bad" note="J-10470, J-10482" />
        <Stat label="Completed today" value={COMPLETED.filter((c) => c.day === "Today").length} tone="ok" onClick={() => store.setSection("Production", "completed")} note="All passed QC" />
      </Grid>

      <Grid cols="minmax(0,2fr) minmax(0,1fr)" style={{ marginBottom: 14 }}>
        <Card title="Stage utilisation" sub={`Load today from the schedule, 08:00 to 18:00. Now ${hh(NOW)}.`} action={<DemoTag>Live board</DemoTag>}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(180px,1fr))", gap: 10 }}>
            {RESOURCES.map((r) => <ResourceCard key={r} r={r} />)}
          </div>
        </Card>
        <Card title="Callout" pad={0} style={{ overflow: "hidden" }}>
          <div style={{ padding: "0 20px 20px" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 10 }}>
              <Badge tone="warn" dot>Due today 16:00</Badge><Badge tone="cyan">Digital Press 1</Badge>
            </div>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.4px" }}><JobLink id="J-10479" onOpen={store.openJob} /> Nova Electrical</div>
            <div style={{ fontSize: 13, color: "var(--dim)", marginTop: 4 }}>{fmtNum(nova?.qty ?? 5000)} A5 flyers · 170gsm gloss · <Money v={nova?.value ?? 865} /></div>
            <div style={{ margin: "16px 0 6px", display: "flex", justifyContent: "space-between", fontSize: 12, color: "var(--dim)" }}>
              <span>Print run</span><span>~{Math.round(((NOW - 8.9) / (13.5 - 8.9)) * 100)}% · off press {hh(13.5)}</span>
            </div>
            <div style={{ height: 8, borderRadius: 9, background: "var(--surface-2)", overflow: "hidden" }}>
              <div style={{ width: `${((NOW - 8.9) / (13.5 - 8.9)) * 100}%`, height: "100%", background: "var(--p-cyan)" }} />
            </div>
            <div style={{ fontSize: 12.5, color: "var(--body)", marginTop: 14, lineHeight: 1.5 }}>
              Guillotine slot at 14:12, boxing in 1,000s by Jack. Production Agent estimates ready for collection at <b>15:20</b>, 40 minutes of slack.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn size="sm" onClick={() => store.openJob("J-10479")}>Open job</Btn>
              <Btn size="sm" icon={IC.docket} onClick={() => store.openDocket("J-10479")}>Docket V1</Btn>
            </div>
          </div>
        </Card>
      </Grid>

      <Card title="Today's deadlines" sub="Ordered by due time" pad={16}>
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${deadlines.length},minmax(150px,1fr))`, gap: 0, overflowX: "auto" }} className="d-scroll">
          {deadlines.map(({ j, t }, i) => {
            const past = t < NOW && j.board !== "Printing";
            return (
              <div key={j.id} className="d-tile click" onClick={() => store.openJob(j.id)} style={{ padding: "12px 14px", borderLeft: i ? "1px solid var(--border)" : "none", cursor: "pointer" }}>
                <Mono style={{ fontSize: 18, color: t < NOW ? "var(--faint)" : "var(--ink)" }}>{j.due.replace("Today ", "")}</Mono>
                <div style={{ fontSize: 13, fontWeight: 500, marginTop: 6 }}>{j.customer}</div>
                <div style={{ fontSize: 12, color: "var(--dim)" }}>{j.id} · {j.product}</div>
                <div style={{ marginTop: 8 }}><Badge tone={j.board === "QC" ? "ok" : j.board === "Printing" ? "cyan" : past ? "ok" : "neutral"}>{j.status}</Badge></div>
              </div>
            );
          })}
        </div>
      </Card>
    </>
  );
}

function ResourceCard({ r }: { r: Resource }) {
  const s = useDemo();
  const blocks = ALL_BLOCKS.filter((b) => b.resource === r).sort((a, b) => a.start - b.start);
  const hours = blocks.reduce((a, b) => a + (b.end - b.start), 0);
  const load = Math.round((hours / SPAN) * 100);
  const cur = blocks.find((b) => b.start <= NOW && b.end > NOW);
  const next = blocks.find((b) => b.start > NOW);
  const paused = (id?: string) => id === CHANGE.jobId && s.changeState === "pending";
  const tone: Tone = load > 80 ? "warn" : "cyan";
  return (
    <div style={{ border: "1px solid var(--border)", borderRadius: 12, padding: 14, background: "var(--surface-2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <div style={{ fontSize: 13, fontWeight: 600 }}>{r}</div>
        <Mono style={{ color: tone === "warn" ? "var(--warn)" : "var(--p-cyan)", fontSize: 15 }}>{load}%</Mono>
      </div>
      <div style={{ display: "flex", height: 6, borderRadius: 6, overflow: "hidden", background: "var(--surface)", margin: "10px 0 12px", position: "relative" }}>
        {blocks.map((b) => <div key={b.jobId} style={{ position: "absolute", left: `${((b.start - 8) / SPAN) * 100}%`, width: `${((b.end - b.start) / SPAN) * 100}%`, top: 0, bottom: 0, background: paused(b.jobId) ? "var(--p-magenta)" : b.end <= NOW ? "var(--border-strong)" : "var(--p-cyan)", opacity: b.end <= NOW ? .6 : 1 }} />)}
        <div style={{ position: "absolute", left: `${((NOW - 8) / SPAN) * 100}%`, top: -2, bottom: -2, width: 2, background: "var(--ink)" }} />
      </div>
      <div style={{ fontSize: 12, display: "grid", gridTemplateColumns: "44px 1fr", rowGap: 5 }}>
        <span style={{ color: "var(--faint)" }}>Now</span>
        <span>{cur ? <><JobLink id={cur.jobId} onOpen={store.openJob} /> <span style={{ color: "var(--dim)" }}>to {hh(cur.end)}</span></> : <span style={{ color: "var(--dim)" }}>Idle</span>}</span>
        <span style={{ color: "var(--faint)" }}>Next</span>
        <span>{next ? <><JobLink id={next.jobId} onOpen={store.openJob} /> <span style={{ color: paused(next.jobId) ? "var(--p-magenta)" : "var(--dim)" }}>{paused(next.jobId) ? "paused" : hh(next.start)}</span></> : <span style={{ color: "var(--dim)" }}>Free after {hh(blocks[blocks.length - 1]?.end ?? 8)}</span>}</span>
      </div>
    </div>
  );
}

/* ---------------- Artwork ---------------- */
const ART_STATUSES = ["Awaiting Files", "Designing", "Proof Sent", "Customer Review", "Approved", "Change Requested", "Revision in progress"];
const artTone = (st: string): Tone => st === "Change Requested" ? "magenta" : st === "Awaiting Files" ? "bad" : st === "Approved" ? "ok" : st === "Revision in progress" ? "warn" : st === "Proof Sent" || st === "Customer Review" ? "cyan" : "neutral";

const ART_META: Record<string, { rev: string; approval: string; proofs: { t: string; text: string }[]; waiting: string; action?: string }> = {
  "J-10470": { rev: "V0 · no files", approval: "Not started", proofs: [{ t: "Thu 24 Sep", text: "Job created from Q-2471" }, { t: "Fri 25 Sep", text: "File request emailed to Dr. Ruth Keane" }, { t: "Today 10:31", text: "Ops Watchdog flagged 2 days waiting" }], waiting: "Pulse is waiting on print-ready files from the customer. 2 days without a reply. Tomorrow 09:00 press slot on Digital Press 2 is at risk.", action: "Chase customer" },
  "J-10486": { rev: "V1 · web upload", approval: "Internal check", proofs: [{ t: "Today 12:15", text: "Artwork uploaded with web order O-8046" }, { t: "Today 12:16", text: "Artwork check queued for Sarah" }], waiting: "Pulse is waiting on Sarah's preflight check. Order is prepaid through Stripe, so nothing blocks production once the file passes." },
  "J-10484": { rev: "V1 · proof 1", approval: "Sent 09:40", proofs: [{ t: "Fri 25 Sep", text: "Artwork V1 designed in-house" }, { t: "Today 09:40", text: "PDF proof emailed to Niamh Costello" }], waiting: "Pulse is waiting on proof approval from Harbour View Hotel. Reminder goes out automatically tomorrow 10:00.", action: "Send reminder now" },
  "J-10487": { rev: "V1 · proof 1", approval: "Customer reviewing", proofs: [{ t: "Today 08:42", text: "Web order O-8045 created the job" }, { t: "Today 11:02", text: "Proof opened by Eoin Kavanagh" }], waiting: "Customer opened the proof at 11:02. Pulse is waiting on approve or change in the proof link." },
  "J-10488": { rev: "V2 · approved", approval: "Approved 10:58", proofs: [{ t: "Yesterday", text: "Proof 1 sent, colour change requested" }, { t: "Today 10:58", text: "Proof 2 approved by Dara Quinn" }], waiting: "Nothing. Approved and slotted on Large Format at 15:00 for tomorrow 10:00 collection." },
};

function artMeta(j: Job, cs: string) {
  if (j.id === CHANGE.jobId) {
    if (cs === "approved") return { rev: "V3 · revision", approval: "Change approved", proofs: [{ t: "Today 10:12", text: "Artwork V2 approved, Docket V2" }, { t: "Today 11:24", text: "Change email from Claire Byrne" }, { t: "Today", text: "CR-118 approved, Docket V3 current" }], waiting: "Sarah is revising artwork to 5 names. Proof V3 goes to Claire Byrne when ready." };
    return { rev: "V2 · docket V2", approval: cs === "pending" ? "Awaiting Sean" : "Change rejected", proofs: [{ t: "Today 10:12", text: "Artwork V2 approved, Docket V2" }, { t: "Today 11:24", text: "Email: 2,000 cards, 5 names" }, { t: "Today 11:27", text: "CR-118 sent to Sean for approval" }], waiting: cs === "pending" ? "Pulse is waiting on Sean to approve CR-118. Artwork and press slot are paused." : "Continuing on Docket V2 at 1,000 cards, 2 names.", action: cs === "pending" ? "Review change" : undefined };
  }
  return ART_META[j.id];
}

function Artwork() {
  const s = useDemo();
  const m = metrics(s);
  const [f, setF] = useState<string>("all");
  const [sel, setSel] = useState<string>("J-10470");
  const rows = m.artwork.filter((j) => f === "all" || j.status === f);
  const present = ART_STATUSES.filter((st) => m.artwork.some((j) => j.status === st));
  const cur = m.artwork.find((j) => j.id === sel) || m.artwork[0];
  const meta = cur && artMeta(cur, s.changeState);
  return (
    <>
      <Head title="Artwork" sub="Files, proofs and approvals for every job before it reaches a press." actions={<Badge tone="magenta" dot>{m.artwork.length} jobs in artwork</Badge>} />
      <div style={{ marginBottom: 12 }}>
        <Chips value={f} onChange={setF} options={[{ id: "all", label: "All", count: m.artwork.length }, ...present.map((st) => ({ id: st, label: st, count: m.artwork.filter((j) => j.status === st).length }))]} />
      </div>
      <Grid cols="minmax(0,1fr) 340px">
        <Card pad={0} style={{ overflow: "hidden" }}>
          <Table rows={rows} rowKey={(j) => j.id} selected={cur?.id} onRow={(j) => setSel(j.id)} cols={[
            { key: "id", label: "Job", w: "92px", render: (j) => <JobLink id={j.id} onOpen={store.openJob} /> },
            { key: "c", label: "Customer", w: "1.4fr", render: (j) => <b style={{ fontWeight: 500 }}>{j.customer}</b> },
            { key: "p", label: "Product", w: "1.1fr", render: (j) => <span style={{ color: "var(--dim)" }}>{j.product} · {fmtNum(j.qty)}</span> },
            { key: "r", label: "Revision", w: "1fr", render: (j) => <Mono>{artMeta(j, s.changeState)?.rev}</Mono> },
            { key: "o", label: "Artwork owner", w: "110px", render: (j) => <Person id={j.owner} /> },
            { key: "a", label: "Approval", w: "1fr", render: (j) => <span style={{ fontSize: 12, color: "var(--dim)" }}>{artMeta(j, s.changeState)?.approval}</span> },
            { key: "d", label: "Due", w: "110px", render: (j) => <span style={{ color: j.risk === "risk" ? "var(--bad)" : "var(--body)" }}>{j.due}</span> },
            { key: "s", label: "Status", w: "150px", render: (j) => <Badge tone={artTone(j.status)} dot>{j.status}</Badge> },
          ]} />
        </Card>
        {cur && meta && (
          <Card key={cur.id} className="d-in" style={cur.status === "Change Requested" ? { borderColor: "var(--p-magenta-line)" } : undefined}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <JobLink id={cur.id} onOpen={store.openJob} /><Badge tone={artTone(cur.status)} dot>{cur.status}</Badge>
            </div>
            <div style={{ fontSize: 18, fontWeight: 600, marginTop: 8, letterSpacing: "-.3px" }}>{cur.customer}</div>
            <div style={{ fontSize: 12.5, color: "var(--dim)" }}>{fmtNum(cur.qty)} {cur.product} · {cur.specs.stock}</div>
            <div style={{ margin: "16px 0", padding: 12, borderRadius: 10, background: "var(--surface-2)", fontSize: 12.5, lineHeight: 1.5 }}>
              <Label style={{ marginBottom: 4 }}>What Pulse is waiting for</Label>{meta.waiting}
            </div>
            <Label style={{ marginBottom: 8 }}>Proof history</Label>
            {meta.proofs.map((p, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "84px 1fr", fontSize: 12.5, padding: "5px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
                <Mono style={{ color: "var(--faint)", fontSize: 11 }}>{p.t}</Mono><span>{p.text}</span>
              </div>
            ))}
            <Label style={{ margin: "16px 0 8px" }}>Customer contact</Label>
            <div style={{ fontSize: 13 }}>{cur.contact}</div>
            <div style={{ fontSize: 12, color: "var(--dim)" }}>via {cur.source === "Website" ? "website order " + cur.order : "PrintLogic quote " + cur.quote}</div>
            <div style={{ display: "flex", gap: 8, marginTop: 16, flexWrap: "wrap" }}>
              {meta.action === "Review change" && <Btn kind="primary" icon={IC.alert} onClick={() => store.openChange()}>Review CR-118</Btn>}
              {meta.action && meta.action !== "Review change" && <Btn kind="primary" icon={IC.mail} onClick={() => store.toast(`${meta.action === "Chase customer" ? "Chase email" : "Reminder"} sent to ${cur.contact} · logged on ${cur.id}`)}>{meta.action}</Btn>}
              <Btn icon={IC.docket} onClick={() => store.openDocket(cur.id)}>Docket V{cur.docketV}</Btn>
            </div>
          </Card>
        )}
      </Grid>
    </>
  );
}

/* ---------------- Production queue ---------------- */
const COLS: { id: NonNullable<Job["board"]>; label: string; sub: string; tone: Tone }[] = [
  { id: "Ready", label: "Ready", sub: "for press", tone: "neutral" },
  { id: "Printing", label: "Printing", sub: "on press now", tone: "cyan" },
  { id: "Finishing", label: "Finishing", sub: "trim, fold, laminate", tone: "cyan" },
  { id: "QC", label: "QC", sub: "quality check", tone: "warn" },
  { id: "Done", label: "Ready", sub: "for collection / dispatch", tone: "ok" },
];
const priority = (j: Job) => j.dueDay === "Today" ? (j.risk !== "ok" ? "Urgent" : "Today") : j.dueDay === "Tomorrow" ? "High" : "Normal";

function Queue() {
  const s = useDemo();
  const byrne = s.jobs.find((j) => j.id === CHANGE.jobId)!;
  const inCol = (c: string) => s.jobs.filter((j) => j.board === c && j.stage !== "Invoiced");
  return (
    <>
      <Head title="Production queue" sub="Every card is the live job record. When a docket changes, the card stops the press." actions={<>
        <Badge tone="cyan" dot>{s.jobs.filter((j) => j.board && j.board !== "Done").length + 1} on the floor</Badge>
      </>} />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,minmax(210px,1fr))", gap: 12, overflowX: "auto", paddingBottom: 6 }} className="d-scroll">
        {COLS.map((c) => {
          const jobs = inCol(c.id);
          const count = jobs.length + (c.id === "Ready" ? 1 : 0);
          return (
            <div key={c.id} style={{ background: "var(--surface-faint, transparent)", border: "1px solid var(--border)", borderRadius: 16, padding: 10, minHeight: 440 }}>
              <div style={{ padding: "4px 6px 12px", display: "flex", alignItems: "baseline", gap: 8 }}>
                <span style={{ width: 8, height: 8, borderRadius: 3, background: c.tone === "neutral" ? "var(--border-strong)" : `var(--${c.tone === "cyan" ? "p-cyan" : c.tone})` }} />
                <div style={{ fontSize: 13.5, fontWeight: 600 }}>{c.label}</div>
                <div style={{ fontSize: 11.5, color: "var(--faint)", flex: 1 }}>{c.sub}</div>
                <Mono style={{ color: "var(--dim)" }}>{count}</Mono>
              </div>
              <div style={{ display: "grid", gap: 8 }}>
                {c.id === "Ready" && <ByrneCard j={byrne} />}
                {jobs.map((j) => <JobCard key={j.id} j={j} done={c.id === "Done"} />)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function JobCard({ j, done }: { j: Job; done?: boolean }) {
  const s = useDemo();
  const p = priority(j);
  return (
    <div className={"d-card d-tile click" + (s.flash.includes(j.id) ? " d-in" : "")} onClick={() => store.openJob(j.id)} style={{ padding: 12, borderRadius: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Mono style={{ fontWeight: 600 }}>{j.id}</Mono>
        {done ? <Badge tone="yellow">Not invoiced</Badge> : <Badge tone={p === "Urgent" ? "bad" : p === "Today" ? "warn" : "neutral"}>{p}</Badge>}
      </div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 7 }}>{j.customer}</div>
      <div style={{ fontSize: 12, color: "var(--dim)" }}>{fmtNum(j.qty)} × {j.product}</div>
      <div style={{ display: "flex", gap: 6, alignItems: "center", marginTop: 10, fontSize: 11.5, color: "var(--dim)", flexWrap: "wrap" }}>
        <Icon d={IC.clock} size={12} /> {done ? j.completed : j.due}
        <span style={{ flex: 1 }} />
        <Mono style={{ fontSize: 10.5, color: "var(--faint)" }}>Docket V{j.docketV}</Mono>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 8, borderTop: "1px solid var(--border)", fontSize: 11.5, color: "var(--dim)" }}>
        <span>{j.resource}</span><Avatar id={j.owner} size={20} />
      </div>
    </div>
  );
}

function ByrneCard({ j }: { j: Job }) {
  const s = useDemo();
  if (s.changeState === "pending") {
    return (
      <div className="d-stop" onClick={() => store.openChange()} style={{ ...stopStripes, borderRadius: 12, padding: 12, cursor: "pointer" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--p-magenta)", fontWeight: 700, fontSize: 12.5, letterSpacing: ".04em" }}>
          <Icon d={IC.alert} size={15} stroke={2.2} /> SPECIFICATION CHANGED — STOP
        </div>
        <div style={{ background: "var(--surface)", borderRadius: 9, padding: 10, marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}><Mono style={{ fontWeight: 600 }}>{j.id}</Mono><Mono style={{ textDecoration: "line-through", color: "var(--faint)", fontSize: 11 }}>Docket V2</Mono></div>
          <div style={{ fontSize: 13, fontWeight: 500, marginTop: 5 }}>{j.customer}</div>
          <div style={{ fontSize: 12, color: "var(--dim)" }}><s>1,000</s> → <b style={{ color: "var(--p-magenta)" }}>2,000</b> cards · <s>2</s> → <b style={{ color: "var(--p-magenta)" }}>5</b> names</div>
          <div style={{ fontSize: 12, marginTop: 8, lineHeight: 1.4 }}>Docket V2 superseded by pending change {CHANGE.id}. Do not print.</div>
        </div>
        <Btn kind="primary" size="sm" icon={IC.arrow} style={{ width: "100%", marginTop: 10 }} onClick={(e) => { e.stopPropagation(); store.openChange(); }}>Review change {CHANGE.id}</Btn>
      </div>
    );
  }
  const approved = s.changeState === "approved";
  return (
    <div className={"d-card d-tile click" + (s.flash.includes(j.id) ? " d-in" : "")} onClick={() => store.openJob(j.id)}
      style={{ padding: 12, borderRadius: 12, borderColor: approved ? "var(--p-cyan-line)" : undefined, background: s.flash.includes(j.id) ? "var(--p-cyan-soft)" : undefined, transition: "background 1.5s" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}><Mono style={{ fontWeight: 600 }}>{j.id}</Mono><Badge tone={approved ? "cyan" : "neutral"}>{approved ? "Re-slotted" : "Resumed"}</Badge></div>
      <div style={{ fontSize: 13, fontWeight: 500, marginTop: 7 }}>{j.customer}</div>
      <div style={{ fontSize: 12, color: "var(--dim)" }}>{fmtNum(j.qty)} × {j.product} · {j.specs.names} names</div>
      <div style={{ fontSize: 11.5, marginTop: 10, color: approved ? "var(--p-cyan)" : "var(--dim)" }}>{approved ? "Docket V3 · re-slotted 16:15 DP1" : "Docket V2 · 16:15 DP1"}</div>
      {approved && <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 4 }}>Waiting on artwork revision from Sarah</div>}
    </div>
  );
}

/* ---------------- Schedule ---------------- */
const WEEK = ["Mon 28", "Tue 29", "Wed 30", "Thu 1", "Fri 2"];
const WEEK_PLAN: Record<string, string[][]> = {
  "Digital Press 1": [["J-10479", "J-10480", "J-10482"], ["J-10484"], ["J-10482"], ["J-10484"], []],
  "Digital Press 2": [["J-10476", "J-10474"], ["J-10470"], ["J-10486", "J-10487"], ["J-10486"], ["J-10487"]],
  "Large Format": [["J-10488"], [], ["J-10488"], [], []],
  Finishing: [["J-10481", "J-10483", "J-10477"], ["J-10483"], ["J-10484"], ["J-10486"], ["J-10484"]],
};
function Schedule() {
  const s = useDemo();
  const [view, setView] = useState<"day" | "week">("day");
  const rows = RESOURCES.filter((r) => r !== "Guillotine");
  const cust = (id: string) => s.jobs.find((j) => j.id === id)?.customer ?? ORDERS.find((o) => o.jobId === id)?.customer ?? "";
  const paused = s.changeState === "pending";
  return (
    <>
      <Head title="Schedule" sub="Press and finishing slots. Same job numbers as the queue and the dockets." actions={<Chips value={view} onChange={setView} options={[{ id: "day", label: "Today" }, { id: "week", label: "This week" }]} />} />
      {view === "day" ? (
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }} className="d-scroll">
            <div style={{ minWidth: 900 }}>
              <div style={{ display: "grid", gridTemplateColumns: "150px 1fr", borderBottom: "1px solid var(--border)" }}>
                <div style={{ padding: "10px 16px", fontSize: 11.5, color: "var(--faint)" }}>Mon 28 Sep</div>
                <div style={{ position: "relative", height: 36 }}>
                  {Array.from({ length: SPAN + 1 }, (_, i) => <Mono key={i} style={{ position: "absolute", left: `${(i / SPAN) * 100}%`, top: 11, fontSize: 10.5, color: "var(--faint)", transform: i === SPAN ? "translateX(-100%)" : i ? "translateX(-50%)" : "translateX(4px)" }}>{hh(8 + i)}</Mono>)}
                </div>
              </div>
              {rows.map((r) => (
                <div key={r} style={{ display: "grid", gridTemplateColumns: "150px 1fr", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ padding: "18px 16px", fontSize: 13, fontWeight: 500 }}>{r}</div>
                  <div style={{ position: "relative", height: 68, backgroundImage: "linear-gradient(to right, var(--border) 1px, transparent 1px)", backgroundSize: `${100 / SPAN}% 100%` }}>
                    {SCHEDULE.filter((b) => b.resource === r).map((b) => {
                      const stop = b.jobId === CHANGE.jobId && paused;
                      const past = b.end <= NOW;
                      const flash = s.flash.includes(b.jobId);
                      return (
                        <div key={b.jobId} className={"d-tile click" + (stop ? " d-stop" : "")} onClick={() => stop ? store.openChange() : store.openJob(b.jobId)} title={`${b.jobId} ${hh(b.start)} to ${hh(b.end)}`}
                          style={{ position: "absolute", top: 10, bottom: 10, left: `calc(${((b.start - 8) / SPAN) * 100}% + 2px)`, width: `calc(${((b.end - b.start) / SPAN) * 100}% - 4px)`, borderRadius: 9, padding: "6px 9px", overflow: "hidden", cursor: "pointer",
                            ...(stop ? stopStripes : { background: flash ? "var(--p-cyan)" : past ? "var(--surface-2)" : "var(--p-cyan-soft)", border: "1px solid " + (past ? "var(--border)" : "var(--p-cyan-line)") }), transition: "background 1.2s" }}>
                          <Mono style={{ fontSize: 11, fontWeight: 600, color: stop ? "var(--p-magenta)" : flash ? "var(--on-accent,#000)" : past ? "var(--dim)" : "var(--ink)" }}>{b.jobId}{stop ? " · PAUSED" : ""}</Mono>
                          <div style={{ fontSize: 11, color: stop ? "var(--p-magenta)" : "var(--dim)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{stop ? "Awaiting CR-118" : cust(b.jobId)}</div>
                        </div>
                      );
                    })}
                    <div style={{ position: "absolute", left: `${((NOW - 8) / SPAN) * 100}%`, top: 0, bottom: 0, width: 2, background: "var(--p-magenta)", zIndex: 2 }} />
                  </div>
                </div>
              ))}
              <div style={{ display: "flex", gap: 18, padding: "12px 16px", fontSize: 11.5, color: "var(--dim)", alignItems: "center" }}>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 12, height: 3, background: "var(--p-magenta)" }} />Now {hh(NOW)}</span>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 12, height: 10, borderRadius: 3, background: "var(--p-cyan-soft)", border: "1px solid var(--p-cyan-line)" }} />Scheduled</span>
                <span style={{ display: "inline-flex", gap: 6, alignItems: "center" }}><span style={{ width: 12, height: 10, borderRadius: 3, ...stopStripes }} />Paused by change control</span>
                <span style={{ flex: 1 }} /><span>Click any block to open the job</span>
              </div>
            </div>
          </div>
        </Card>
      ) : (
        <Card pad={0} style={{ overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }} className="d-scroll">
            <div style={{ display: "grid", gridTemplateColumns: "150px repeat(5,minmax(150px,1fr))", minWidth: 900 }}>
              <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)" }} />
              {WEEK.map((d, i) => <div key={d} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 500, borderBottom: "1px solid var(--border)", borderLeft: "1px solid var(--border)", color: i === 0 ? "var(--p-cyan)" : "var(--dim)" }}>{d}{i === 0 ? " · today" : ""}</div>)}
              {rows.map((r) => (
                <FragmentRow key={r} label={r}>
                  {(WEEK_PLAN[r] || []).map((ids, di) => (
                    <div key={di} style={{ padding: 8, borderLeft: "1px solid var(--border)", borderBottom: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: 5, minHeight: 84 }}>
                      {ids.length === 0 && <span style={{ fontSize: 11, color: "var(--faint)", padding: 4 }}>Open capacity</span>}
                      {ids.map((id) => {
                        const stop = id === CHANGE.jobId && paused;
                        return (
                          <button key={id} className="d-chip" onClick={() => stop ? store.openChange() : store.openJob(id)} style={{ justifyContent: "flex-start", height: "auto", padding: "5px 8px", borderRadius: 8, ...(stop ? stopStripes : {}) }}>
                            <Mono style={{ fontSize: 11, color: stop ? "var(--p-magenta)" : "var(--ink)" }}>{id}</Mono>
                            <span style={{ fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: stop ? "var(--p-magenta)" : undefined }}>{stop ? "paused" : cust(id)}</span>
                          </button>
                        );
                      })}
                    </div>
                  ))}
                </FragmentRow>
              ))}
            </div>
          </div>
        </Card>
      )}
    </>
  );
}
function FragmentRow({ label, children }: { label: string; children: ReactNode }) {
  return <><div style={{ padding: "14px 16px", fontSize: 13, fontWeight: 500, borderBottom: "1px solid var(--border)" }}>{label}</div>{children}</>;
}

/* ---------------- Completed ---------------- */
type Done = { id: string; customer: string; product: string; qty: number; resource: Resource; operator: string; time: string; day: "Today" | "This week"; qc: string; next: "Ready to Invoice" | "Prepaid · Stripe" | "Invoiced" };
const COMPLETED: Done[] = [
  { id: "J-10473", customer: "Summit Property Partners", product: "Presentation Folders", qty: 500, resource: "Finishing", operator: "jack", time: "13:03", day: "Today", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10472", customer: "Harbour View Hotel", product: "Table Menus", qty: 120, resource: "Digital Press 2", operator: "niall", time: "12:10", day: "Today", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10475", customer: "Wexford Motor Group", product: "A1 Posters", qty: 40, resource: "Large Format", operator: "niall", time: "10:22", day: "Today", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10478", customer: "Castle Events", product: "Event Tickets", qty: 800, resource: "Guillotine", operator: "jack", time: "10:05", day: "Today", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10467", customer: "Riverside Yoga", product: "Business Cards", qty: 500, resource: "Digital Press 1", operator: "niall", time: "09:48", day: "Today", qc: "Pass · 1st check", next: "Prepaid · Stripe" },
  { id: "J-10485", customer: "Oakfield Primary School", product: "Certificates", qty: 400, resource: "Digital Press 2", operator: "liam", time: "09:12", day: "Today", qc: "Pass · reprint 40", next: "Ready to Invoice" },
  { id: "J-10489", customer: "The Mill Theatre", product: "Programmes", qty: 300, resource: "Digital Press 1", operator: "niall", time: "08:37", day: "Today", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10466", customer: "Delaney Plumbing", product: "Flyers", qty: 5000, resource: "Digital Press 2", operator: "liam", time: "Sun 17:20", day: "This week", qc: "Pass · reprint 40", next: "Prepaid · Stripe" },
  { id: "J-10465", customer: "Bloom Florists", product: "Posters", qty: 50, resource: "Large Format", operator: "niall", time: "Sun 14:05", day: "This week", qc: "Pass · 1st check", next: "Prepaid · Stripe" },
  { id: "J-10468", customer: "Lennon Architects", product: "Brochures", qty: 200, resource: "Digital Press 1", operator: "jack", time: "Sun 16:40", day: "This week", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10471", customer: "Brightside Dental Group", product: "Presentation Folders", qty: 400, resource: "Finishing", operator: "jack", time: "Sun 11:15", day: "This week", qc: "Pass · 1st check", next: "Ready to Invoice" },
  { id: "J-10464", customer: "St. Anne's Parish", product: "Booklets", qty: 400, resource: "Digital Press 2", operator: "liam", time: "Sat 15:02", day: "This week", qc: "Pass · 1st check", next: "Prepaid · Stripe" },
  { id: "J-10463", customer: "Coastline Surf School", product: "Brochures", qty: 250, resource: "Digital Press 1", operator: "niall", time: "Sat 12:30", day: "This week", qc: "Pass · 1st check", next: "Prepaid · Stripe" },
];

function Completed() {
  const s = useDemo();
  const [range, setRange] = useState<"Today" | "This week">("Today");
  const rows = COMPLETED.filter((c) => range === "This week" || c.day === "Today");
  const nextOf = (c: Done) => s.synced.includes(c.id) ? "Invoiced" : c.next;
  const byRes = RESOURCES.map((r) => ({ r, n: rows.filter((c) => c.resource === r).length }));
  return (
    <>
      <Head title="Completed" sub="Finished, checked and handed to finance without anyone retyping the job." actions={<Chips value={range} onChange={setRange} options={[{ id: "Today", label: "Today", count: 7 }, { id: "This week", label: "This week", count: COMPLETED.length }]} />} />
      <Grid cols="minmax(0,1fr) 280px">
        <Card pad={0} style={{ overflow: "hidden" }}>
          <Table rows={rows} rowKey={(c) => c.id} onRow={(c) => store.openJob(c.id)} cols={[
            { key: "t", label: "Completed", w: "90px", render: (c) => <Mono>{c.time}</Mono> },
            { key: "id", label: "Job", w: "90px", render: (c) => <JobLink id={c.id} onOpen={store.openJob} /> },
            { key: "c", label: "Customer", w: "1.4fr", render: (c) => <span style={{ fontWeight: 500 }}>{c.customer}</span> },
            { key: "p", label: "Product", w: "1.2fr", render: (c) => <span style={{ color: "var(--dim)" }}>{fmtNum(c.qty)} × {c.product}</span> },
            { key: "r", label: "Resource", w: "1fr", render: (c) => <span style={{ fontSize: 12 }}>{c.resource}</span> },
            { key: "o", label: "Operator", w: "100px", render: (c) => <Person id={c.operator} /> },
            { key: "q", label: "QC", w: "130px", render: (c) => <Badge tone="ok"><Icon d={IC.check} size={11} stroke={2.4} />{c.qc}</Badge> },
            { key: "n", label: "Moved to", w: "140px", render: (c) => { const n = nextOf(c); return <Badge tone={n === "Ready to Invoice" ? "yellow" : "ok"}>{n}</Badge>; } },
          ]} />
        </Card>
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Card title="First-time QC pass">
            <div style={{ fontSize: 34, fontWeight: 600, letterSpacing: "-1px" }}>{Math.round((rows.filter((c) => c.qc.includes("1st")).length / rows.length) * 100)}%</div>
            <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 6 }}>{rows.filter((c) => !c.qc.includes("1st")).length} short reprint, logged on the job</div>
          </Card>
          <Card title="By resource">
            {byRes.map(({ r, n }) => (
              <div key={r} style={{ display: "grid", gridTemplateColumns: "1fr 90px 20px", alignItems: "center", gap: 8, fontSize: 12.5, padding: "4px 0" }}>
                <span>{r}</span>
                <div style={{ height: 6, borderRadius: 4, overflow: "hidden" }}><div style={{ width: `${(n / Math.max(...byRes.map((x) => x.n), 1)) * 100}%`, height: "100%", background: "var(--p-cyan)" }} /></div>
                <Mono style={{ textAlign: "right" }}>{n}</Mono>
              </div>
            ))}
          </Card>
          <Card title="Handed to finance" sub="No re-keying into Big Red Cloud">
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <b>{rows.filter((c) => nextOf(c) === "Ready to Invoice").length}</b> account jobs waiting in Ready to Invoice<br />
              <b>{rows.filter((c) => nextOf(c) === "Prepaid · Stripe").length}</b> prepaid online, nothing to chase
            </div>
            <Btn size="sm" style={{ marginTop: 12 }} icon={IC.arrow} onClick={() => store.go("Finance", "ready")}>Open Ready to Invoice</Btn>
          </Card>
        </div>
      </Grid>
    </>
  );
}

