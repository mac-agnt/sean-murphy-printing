import type { ReactNode } from "react";
import { useDemo, store } from "../../../demo/store";
import { CHANGE, EVENTS, customer, staff, type Job } from "../../../demo/data";
import { Head, Card, Grid, Badge, Btn, Icon, IC, Mono, Money, StageBadge, Avatar, Timeline, toneColor, type Tone } from "../../../demo/ui";
import { STAGES, STAGE_LABEL, docketsFor, eventsFor, EventRow, KV, fmt } from "./shared";

function Stepper({ j, paused }: { j: Job; paused: boolean }) {
  const at = STAGES.indexOf(j.stage);
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${STAGES.length},1fr)`, gap: 4 }}>
      {STAGES.map((st, i) => {
        const done = i < at, cur = i === at;
        const col = cur ? (paused ? "var(--p-magenta)" : "var(--p-cyan)") : done ? "var(--ok)" : "var(--border-strong)";
        return (
          <div key={st} style={{ minWidth: 0 }}>
            <div className={cur && paused ? "d-stop" : undefined} style={{ height: 5, borderRadius: 4, background: col, opacity: done || cur ? 1 : .5 }} />
            <div style={{ fontSize: 11, marginTop: 7, color: cur ? "var(--ink)" : done ? "var(--dim)" : "var(--faint)", fontWeight: cur ? 600 : 400, lineHeight: 1.3 }}>
              {done && <Icon d={IC.check} size={10} stroke={2.4} style={{ marginRight: 3, color: "var(--ok)", verticalAlign: -1 }} />}
              {STAGE_LABEL[st] || st}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Doc({ icon, name, meta, tone, onClick, strike }: { icon: string; name: ReactNode; meta: string; tone?: Tone; onClick?: () => void; strike?: boolean }) {
  return (
    <div className={"d-row" + (onClick ? " click" : "")} onClick={onClick} style={{ display: "grid", gridTemplateColumns: "30px 1fr auto", gap: 10, alignItems: "center", padding: "8px 8px", margin: "0 -8px", borderRadius: 9 }}>
      <span style={{ width: 28, height: 28, borderRadius: 8, background: "var(--surface-2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", color: tone ? toneColor(tone) : "var(--dim)" }}><Icon d={icon} size={13} /></span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, textDecoration: strike ? "line-through" : undefined, color: strike ? "var(--dim)" : "var(--ink)" }}>{name}</div>
        <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{meta}</div>
      </div>
      {onClick && <Icon d={IC.arrow} size={12} style={{ color: "var(--faint)" }} />}
    </div>
  );
}

export default function Detail({ id }: { id: string }) {
  const s = useDemo();
  const j = s.jobs.find((x) => x.id === id);
  if (!j) return <Card>Job {id} not found. <button className="d-link" onClick={store.closeJob}>Back</button></Card>;
  const hero = j.id === CHANGE.jobId;
  const pending = hero && s.changeState === "pending";
  const approved = hero && s.changeState === "approved";
  const rejected = hero && s.changeState === "rejected";
  const cust = customer(j.customerId);
  const versions = docketsFor(s, j);
  const evs = eventsFor(s, j.id);

  const banner = pending
    ? { tone: "magenta" as Tone, title: "CHANGE REQUIRES APPROVAL", text: "Claire Byrne asked for 2,000 cards and 5 names at 11:24. Artwork and production are paused on Docket V2 until you decide.", icon: IC.pause }
    : approved ? { tone: "ok" as Tone, title: "Change approved · Docket V3 current", text: "Docket V2 superseded. Sarah Byrne is revising artwork to V3. J-10482 re-slotted on Digital Press 1.", icon: IC.check }
    : rejected ? { tone: "neutral" as Tone, title: "Change rejected · continuing on Docket V2", text: "Work resumed at 1,000 cards, 2 names. Emma Walsh has a drafted reply for Claire Byrne.", icon: IC.x }
    : j.risk === "risk" ? { tone: "bad" as Tone, title: "AT RISK", text: j.id === "J-10470" ? "Waiting on customer artwork for 2 days. Tomorrow's 09:00 slot on Digital Press 2 at risk." : "Flagged by Ops Watchdog.", icon: IC.alert }
    : null;

  const specs: { k: string; from?: string; v: ReactNode; note?: string }[] = [
    { k: "Quantity", from: pending ? "1,000" : undefined, v: pending ? "2,000" : fmt(j.qty), note: approved ? "previously 1,000" : undefined },
    ...(j.specs.names !== undefined ? [{ k: "Names", from: pending ? "2" : undefined, v: pending ? "5" : String(j.specs.names), note: approved ? "previously 2" : undefined }] : []),
    { k: "Finished size", v: j.specs.size },
    { k: "Stock", v: j.specs.stock },
    { k: "Print", v: j.specs.print },
    { k: "Finish", v: j.specs.finish },
    ...(j.specs.pages ? [{ k: "Pages", v: j.specs.pages }] : []),
    ...(hero ? [{ k: "Artwork", from: pending ? "V2 approved" : undefined, v: pending ? "Revision required" : approved ? "Revision V3" : "V2 approved", note: approved ? "V2 retained for reference" : undefined }] : [{ k: "Artwork", v: j.status }]),
    { k: "Packaging", v: j.specs.packaging },
    { k: "Delivery", v: j.specs.delivery },
  ];

  const timeline: { t: string; text: ReactNode; tone?: Tone }[] = hero ? [
    { t: "09:03", text: "Quote Q-2487 approved in PrintLogic", tone: "neutral" },
    { t: "09:06", text: "Job automatically created. No re-keying.", tone: "cyan" },
    { t: "09:08", text: "Docket V1 generated", tone: "cyan" },
    { t: "10:12", text: "Artwork started · V2 attached, Docket V2 current", tone: "accent" },
    { t: "11:24", text: "Customer change received by email", tone: "magenta" },
    { t: "11:25", text: "AI extracted requested changes (97% confidence)", tone: "magenta" },
    { t: "11:25", text: "Production and artwork progression paused", tone: "magenta" },
    { t: "11:27", text: "Approval requested from Sean", tone: "magenta" },
    ...s.events.slice(EVENTS.length).filter((e) => e.jobId === j.id).map((e) => ({ t: e.t, text: e.text, tone: (e.kind === "person" ? "ok" : "cyan") as Tone })),
  ] : [
    { t: j.source === "Website" ? "Paid" : "Quote", text: j.source === "Website" ? `Website order ${j.order} paid via Stripe` : `Quote ${j.quote} approved in PrintLogic`, tone: "neutral" },
    { t: "Auto", text: "Job created and Docket V1 generated", tone: "cyan" },
    ...evs.map((e) => ({ t: e.t, text: e.text, tone: (e.kind === "attention" ? "magenta" : e.kind === "person" ? "accent" : "cyan") as Tone })),
    { t: "Now", text: `${j.stage} · ${j.status}`, tone: "accent" },
  ];

  const val = hero ? { base: CHANGE.valueBefore, delta: CHANGE.valueAfter - CHANGE.valueBefore, final: pending || approved ? CHANGE.valueAfter : CHANGE.valueBefore } : { base: j.value, delta: 0, final: j.value };
  const invoice = j.stage === "Invoiced" || s.synced.includes(j.id) ? "Invoiced · synced to Big Red Cloud" : j.stage === "Ready to Invoice" ? "Ready to invoice" : "Not yet invoiced";

  return (
    <div className="d-in">
      <Head back={{ label: "Live Jobs", onClick: store.closeJob }}
        title={<span style={{ display: "inline-flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}><Mono style={{ fontSize: 34, letterSpacing: "-1px", fontWeight: 600 }}>{j.id}</Mono><span style={{ color: "var(--dim)", fontWeight: 400 }}>{j.product}</span></span>}
        sub={<span style={{ display: "inline-flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <button className="d-link" onClick={() => store.openCustomer(j.customerId)}>{j.customer}</button>
          <span>· {j.contact}</span><StageBadge stage={j.stage} /><span>Due {j.due}</span>
        </span>}
        actions={<>
          <Btn icon={IC.docket} onClick={() => store.openDocket(j.id)}>Open docket V{j.docketV}</Btn>
          <Btn icon={IC.print} onClick={() => { store.openDocket(j.id); setTimeout(() => window.print(), 350); }}>Print docket</Btn>
        </>} />

      {banner && (
        <div className={pending ? "d-stop" : undefined} style={{ display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap", padding: "16px 20px", borderRadius: 16, marginBottom: 14, background: banner.tone === "magenta" ? "var(--p-magenta-soft)" : banner.tone === "ok" ? "var(--ok-soft)" : banner.tone === "bad" ? "var(--bad-soft)" : "var(--surface-2)", border: "1px solid " + (banner.tone === "magenta" ? "var(--p-magenta-line)" : "var(--border)") }}>
          <span style={{ width: 38, height: 38, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--surface)", color: toneColor(banner.tone) }}><Icon d={banner.icon} size={18} /></span>
          <div style={{ flex: 1, minWidth: 240 }}>
            <div style={{ fontFamily: pending ? "var(--mono)" : undefined, letterSpacing: pending ? ".08em" : undefined, fontSize: pending ? 13 : 15, fontWeight: 600, color: toneColor(banner.tone) }}>{banner.title}</div>
            <div style={{ fontSize: 13, color: "var(--body)", marginTop: 3 }}>{banner.text}</div>
          </div>
          {pending && <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <Btn kind="primary" icon={IC.check} onClick={store.approveChange}>Approve Change</Btn>
            <Btn kind="danger" icon={IC.x} onClick={store.rejectChange}>Reject</Btn>
            <Btn icon={IC.edit} onClick={() => store.openChange()}>Edit</Btn>
            <Btn icon={IC.mail} onClick={() => store.toast("Draft opened for Emma Walsh to Claire Byrne", "info")}>Contact Customer</Btn>
          </div>}
          {approved && <Btn icon={IC.docket} onClick={() => store.openDocket(j.id, 3)}>Open Docket V3</Btn>}
        </div>
      )}

      <Card style={{ marginBottom: 14 }} pad={18}><Stepper j={j} paused={pending} /></Card>

      <Grid cols="minmax(0,1.15fr) minmax(0,1fr) minmax(0,.9fr)">
        <Card title="Specifications" sub={pending ? "Requested change shown against current docket" : `Docket V${j.docketV} · ${versions.find((v) => v.status === "Current")?.created || ""}`}>
          {specs.map((x) => x.from
            ? <KV key={x.k} k={x.k} tone="magenta" v={<span><span style={{ color: "var(--dim)", textDecoration: "line-through" }}>{x.from}</span> <Icon d={IC.arrow} size={11} style={{ verticalAlign: -1, margin: "0 4px" }} /> <b style={{ fontWeight: 600 }}>{x.v}</b></span>} />
            : <KV key={x.k} k={x.k} v={x.v} note={x.note} tone={x.note ? "ok" : undefined} />)}
          {j.notes && <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 12, lineHeight: 1.5 }}>{j.notes}</div>}
        </Card>

        <Card title="Timeline" sub="Today">
          <Timeline items={timeline} />
        </Card>

        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Card title="Commercial">
            <KV k="Quote value" v={<Money v={val.base} />} note={j.quote} />
            {hero && <KV k="Change value" v={<span style={{ color: rejected ? "var(--faint)" : "var(--p-magenta)" }}>+<Money v={val.delta} /></span>} note={pending ? "Requote awaiting approval" : rejected ? "Not applied" : "Q-2487-R1 in PrintLogic"} />}
            <KV k="Final job value" v={<b style={{ fontWeight: 600, fontSize: 15 }}><Money v={val.final} /></b>} />
            <KV k="Payment" v={j.paid === "Account" ? "Account · " + (cust?.terms || "30 days") : j.paid} />
            <KV k="Invoice" v={<span style={{ color: invoice.startsWith("Ready") ? "var(--p-yellow)" : undefined }}>{invoice}</span>} />
          </Card>
          <Card title="Documents" pad={16}>
            {j.quote && <Doc icon={IC.docket} name={`Quote ${j.quote}`} meta="PrintLogic · source record" />}
            {j.order && <Doc icon={IC.online} name={`Order ${j.order}`} meta="Website · Paid via Stripe" onClick={() => store.openOrder(j.order!)} />}
            {hero && <><Doc icon={IC.layers} name="Artwork V1" meta="Superseded" strike /><Doc icon={IC.layers} name="Artwork V2" meta={approved ? "Superseded by V3 revision" : "Proof approved 10:12"} /><Doc icon={IC.mail} name="Customer email" meta="Claire Byrne · 11:24" tone="magenta" onClick={() => store.openChange()} /></>}
            {versions.map((d) => <Doc key={d.v} icon={IC.qr} tone={d.status === "Current" ? "cyan" : undefined} name={d.status === "Current" ? `Current Docket V${d.v}` : `Docket V${d.v}`} meta={`${d.status} · ${d.created}`} strike={d.status === "Superseded"} onClick={() => store.openDocket(j.id, d.v)} />)}
          </Card>
        </div>
      </Grid>

      <Grid cols="minmax(0,1.6fr) minmax(0,1fr)" style={{ marginTop: 14 }}>
        <Card title="Activity" sub="People, agents and connected systems on this job">
          {evs.length === 0 && <div style={{ fontSize: 13, color: "var(--dim)" }}>No activity yet today.</div>}
          {evs.slice().reverse().map((e, i) => <EventRow key={i} e={e} />)}
        </Card>
        <Card title="People" sub="Who touches this job">
          {Array.from(new Set([j.owner, "sean", hero ? "emma" : "liam", j.stage === "Ready to Invoice" ? "aoife" : "jack"])).map((p) => (
            <div key={p} style={{ display: "flex", gap: 10, alignItems: "center", padding: "8px 0", borderBottom: "1px solid var(--border)" }}>
              <Avatar id={p} size={28} />
              <div style={{ flex: 1 }}><div style={{ fontSize: 13 }}>{staff(p).name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{staff(p).role}</div></div>
              {p === j.owner && <Badge tone="accent">Owner</Badge>}
            </div>
          ))}
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 12 }}>Resource: {j.resource || "Unassigned"}</div>
        </Card>
      </Grid>
    </div>
  );
}

