import { useState } from "react";
import { Page, Head, Card, Grid, Badge, Btn, Icon, IC, Label, Stat, Table, Money, Mono, JobLink, Flow, Bars, DemoTag } from "../../demo/ui";
import { useDemo, store, metrics } from "../../demo/store";
import { INVOICES, DEBTORS, REVENUE_MONTHS, ONLINE_PRODUCTS, CUSTOMERS, fmtEUR, fmtNum, type Job, type Invoice } from "../../demo/data";

const FLOW = ["Completed", "Ready to Invoice", "Review", "Send to Big Red Cloud", "Invoiced"];
const VAT = 0.23;

/* ---------------- Overview ---------------- */
function Overview() {
  const s = useDemo();
  const m = metrics(s);
  const f = m.finance;
  const max = Math.max(...REVENUE_MONTHS.map((r) => r.v));
  return (
    <>
      <Grid cols="repeat(5,minmax(0,1fr))" style={{ marginBottom: 14 }}>
        <Stat label="Revenue MTD" value={fmtEUR(f.revenueMTD)} note={<DemoTag>Demo data</DemoTag>} big />
        <Stat label="Completed not invoiced" value={fmtEUR(m.rtiValue)} tone="yellow" note={m.rti.length + " jobs ready"} onClick={() => store.setSection("Finance", "ready")} />
        <Stat label="Outstanding" value={fmtEUR(f.outstanding)} note={DEBTORS.length + " debtors · 1 overdue"} onClick={() => store.setSection("Finance", "debtors")} />
        <Stat label="Online paid revenue" value={fmtEUR(f.onlinePaid)} tone="cyan" note="This week · Stripe" />
        <Stat label="Average job value" value={fmtEUR(f.avgJob)} note="Last 30 days" />
      </Grid>
      <Card title="Invoice flow" sub="Pulse orchestrates. Big Red Cloud stays the ledger." style={{ marginBottom: 14 }}
        action={<Btn size="sm" kind="primary" icon={IC.arrow} onClick={() => store.setSection("Finance", "ready")}>Review {m.rti.length} ready</Btn>}>
        <Flow steps={FLOW} active={2} tone="yellow" />
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 14, padding: "10px 12px", borderRadius: 10, background: "var(--surface-2)", fontSize: 12.5, color: "var(--dim)" }}>
          <Icon d={IC.layers} size={15} style={{ color: "var(--p-yellow)" }} />
          No re-keying: invoice lines, customer and VAT come straight from the job record that started as the PrintLogic quote. {s.synced.length > 0 && <b style={{ color: "var(--ok)" }}>{s.synced.length} synced today.</b>}
        </div>
      </Card>
      <Grid cols="minmax(0,1.6fr) minmax(0,1fr)">
        <Card title="Revenue by month" sub="Account work vs prepaid online" action={<DemoTag>Demo data</DemoTag>}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, height: 190 }}>
            {REVENUE_MONTHS.map((r, i) => (
              <div key={r.m} title={`${r.m}: ${fmtEUR(r.v)} (online ${fmtEUR(r.online)})`} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 10.5, color: "var(--faint)" }}>{fmtEUR(r.v / 1000)}k</span>
                <div style={{ width: "100%", height: (r.v / max) * 150, display: "flex", flexDirection: "column", borderRadius: "6px 6px 3px 3px", overflow: "hidden" }}>
                  <div style={{ flex: r.online, background: "var(--p-cyan)", opacity: i === REVENUE_MONTHS.length - 1 ? 1 : 0.6 }} />
                  <div style={{ flex: r.v - r.online, background: "var(--surface-2)", border: "1px solid var(--border)" }} />
                </div>
                <span style={{ fontSize: 10.5, color: "var(--faint)" }}>{r.m}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 16, marginTop: 10, fontSize: 11.5, color: "var(--dim)" }}>
            <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: "var(--p-cyan)", marginRight: 6 }} />Online, prepaid</span>
            <span><span style={{ display: "inline-block", width: 9, height: 9, borderRadius: 2, background: "var(--surface-2)", border: "1px solid var(--border)", marginRight: 6 }} />Account</span>
          </div>
        </Card>
        <Card title="Ready to send" sub="Top of the invoice queue">
          {m.rti.map((j) => (
            <div key={j.id} className="d-row click" onClick={() => store.setSection("Finance", "ready")} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "9px 4px", borderTop: "1px solid var(--border)", fontSize: 13 }}>
              <span><Mono>{j.id}</Mono> <span style={{ color: "var(--dim)" }}>{j.customer}</span></span>
              <Money v={j.value} />
            </div>
          ))}
          {m.rti.length === 0 && <div style={{ fontSize: 13, color: "var(--ok)" }}>Everything completed has been invoiced.</div>}
          <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 10, borderTop: "1px solid var(--border-strong)", fontWeight: 600 }}><span>Total</span><Money v={m.rtiValue} style={{ color: "var(--p-yellow)" }} /></div>
        </Card>
      </Grid>
    </>
  );
}

/* ---------------- Ready to invoice ---------------- */
function lines(j: Job) {
  const main = Math.round(j.value * 0.86);
  const setup = j.value - main;
  return [
    { d: `${j.product}, ${j.specs.size}, ${j.specs.stock}, ${j.specs.print}`, q: fmtNum(j.qty), a: main },
    { d: `${j.specs.finish} · prepress and setup`, q: "1", a: setup },
  ];
}

function SyncCell({ j }: { j: Job }) {
  const s = useDemo();
  if (s.synced.includes(j.id)) return <Badge tone="ok"><Icon d={IC.check} size={12} stroke={2.4} />Synced</Badge>;
  if (s.syncing === j.id) return <Badge tone="yellow"><span className="d-spin" style={{ display: "inline-flex" }}><Icon d={IC.sync} size={12} /></span>Syncing</Badge>;
  return <Badge tone="neutral">Not sent</Badge>;
}

function Ready() {
  const s = useDemo();
  const rti = s.jobs.filter((j) => j.stage === "Ready to Invoice" || s.synced.includes(j.id)).sort((a, b) => b.value - a.value);
  const [sel, setSel] = useState<string>("J-10473");
  const j = rti.find((x) => x.id === sel) || rti[0];
  const pending = rti.filter((x) => !s.synced.includes(x.id));
  const sendAll = () => {
    const ids = pending.map((x) => x.id);
    ids.forEach((id, i) => setTimeout(() => store.sendInvoice(id), i * 1300));
  };
  const Action = ({ x }: { x: Job }) => s.synced.includes(x.id)
    ? <span style={{ fontSize: 12, color: "var(--ok)" }}>Big Red Cloud sync complete</span>
    : s.syncing === x.id
      ? <Btn size="sm" disabled><span className="d-spin" style={{ display: "inline-flex" }}><Icon d={IC.sync} size={13} /></span>Syncing</Btn>
      : <Btn size="sm" kind="primary" disabled={!!s.syncing} onClick={(e) => { e.stopPropagation(); setSel(x.id); store.sendInvoice(x.id); }}>Approve & Send to Big Red Cloud</Btn>;
  const L = j ? lines(j) : [];
  const net = j ? j.value : 0;
  return (
    <Grid cols="minmax(0,1.75fr) minmax(320px,1fr)">
      <Card pad={0}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, padding: 14, borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
          <Flow compact steps={FLOW} active={pending.length ? 2 : 4} tone="yellow" />
          <Btn size="sm" icon={IC.sync} disabled={!pending.length || !!s.syncing} onClick={sendAll}>Send all ({pending.length})</Btn>
        </div>
        <Table<Job> rowKey={(x) => x.id} rows={rti} selected={j?.id} onRow={(x) => setSel(x.id)}
          cols={[
            { key: "id", label: "Job", w: "90px", render: (x) => <JobLink id={x.id} onOpen={store.openJob} /> },
            { key: "c", label: "Customer", w: "minmax(150px,1.4fr)", render: (x) => <div><div style={{ fontWeight: 500 }}>{x.customer}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{x.product}</div></div> },
            { key: "d", label: "Completed", w: "120px", render: (x) => <span style={{ color: "var(--dim)" }}>{x.completed || x.due}</span> },
            { key: "v", label: "Value", w: "80px", align: "right", render: (x) => <Money v={x.value} style={{ fontWeight: 600 }} /> },
            { key: "p", label: "Payment", w: "100px", render: (x) => <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{x.paid}</span> },
            { key: "b", label: "Big Red Cloud Status", w: "150px", render: (x) => <SyncCell j={x} /> },
            { key: "a", label: "Action", w: "250px", render: (x) => <Action x={x} /> },
          ]} />
      </Card>
      {j && (
        <Card title={"Invoice preview · " + j.id} sub="Pulled from the job record" action={s.synced.includes(j.id) ? <Badge tone="ok">Synced</Badge> : <Badge tone="yellow">Review</Badge>}>
          <div style={{ background: "var(--p-paper)", color: "var(--p-paper-ink)", borderRadius: 10, padding: 18, fontSize: 12.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
              <div><div style={{ fontWeight: 700, fontSize: 14 }}>{j.customer}</div><div style={{ color: "var(--p-paper-dim)" }}>Attn: {j.contact}</div></div>
              <div style={{ textAlign: "right", color: "var(--p-paper-dim)" }}><div>Draft invoice</div><div>Terms: {CUSTOMERS.find((c) => c.id === j.customerId)?.terms || "30 days"}</div></div>
            </div>
            {L.map((l, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 50px 70px", gap: 8, padding: "7px 0", borderTop: "1px solid var(--p-paper-line)" }}>
                <span>{l.d}</span><span style={{ textAlign: "right" }}>{l.q}</span><span style={{ textAlign: "right" }}>{fmtEUR(l.a)}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid var(--p-paper-ink)", marginTop: 6, paddingTop: 8, display: "grid", gap: 4 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>Net</span><span>{fmtEUR(net)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between" }}><span>VAT 23%</span><span>€{(net * VAT).toFixed(2)}</span></div>
              <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}><span>Total</span><span>€{(net * (1 + VAT)).toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
            </div>
          </div>
          <div style={{ marginTop: 12, display: "grid", gap: 6, fontSize: 12.5 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--dim)" }}>Source</span><Mono>job {j.id} · Quote {j.quote || "n/a"} · Docket V{j.docketV}</Mono></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--dim)" }}>Fields re-typed</span><b style={{ color: "var(--ok)" }}>0</b></div>
            <div style={{ display: "flex", justifyContent: "space-between" }}><span style={{ color: "var(--dim)" }}>Ledger</span><span>Big Red Cloud</span></div>
          </div>
          <div style={{ marginTop: 14 }}>
            {s.synced.includes(j.id)
              ? <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--ok)", fontSize: 13 }}><Icon d={IC.check} size={15} stroke={2.4} />Big Red Cloud sync complete</div>
              : s.syncing === j.id
                ? <Btn kind="primary" disabled style={{ width: "100%" }}><span className="d-spin" style={{ display: "inline-flex" }}><Icon d={IC.sync} size={14} /></span>Sending to Big Red Cloud</Btn>
                : <Btn kind="primary" style={{ width: "100%" }} disabled={!!s.syncing} onClick={() => store.sendInvoice(j.id)}>Approve & Send to Big Red Cloud</Btn>}
          </div>
        </Card>
      )}
    </Grid>
  );
}

/* ---------------- Invoices ---------------- */
function Invoices() {
  const s = useDemo();
  const fresh: Invoice[] = s.synced.slice().reverse().map((id) => {
    const j = s.jobs.find((x) => x.id === id)!;
    return { id: "INV-" + (7742 + s.synced.indexOf(id)), jobId: id, customer: j.customer, amount: j.value, issued: "Today", due: "27 Oct", status: "Sent", brc: "Synced" };
  });
  const rows = [...fresh, ...INVOICES];
  const tone = (st: Invoice["status"]) => (st === "Paid" ? "ok" : st === "Overdue" ? "bad" : "neutral") as "ok" | "bad" | "neutral";
  return (
    <Card pad={0}>
      <div style={{ display: "flex", gap: 18, padding: 14, borderBottom: "1px solid var(--border)", flexWrap: "wrap", fontSize: 12.5, color: "var(--dim)" }}>
        <span>{rows.length} invoices</span>
        <span>Sent <b style={{ color: "var(--ink)" }}>{fmtEUR(rows.filter((r) => r.status === "Sent").reduce((a, r) => a + r.amount, 0))}</b></span>
        <span>Paid <b style={{ color: "var(--ok)" }}>{fmtEUR(rows.filter((r) => r.status === "Paid").reduce((a, r) => a + r.amount, 0))}</b></span>
        <span>Overdue <b style={{ color: "var(--bad)" }}>{fmtEUR(rows.filter((r) => r.status === "Overdue").reduce((a, r) => a + r.amount, 0))}</b></span>
        <span style={{ marginLeft: "auto" }}>Every invoice lives in Big Red Cloud. Pulse shows status.</span>
      </div>
      <Table<Invoice> rowKey={(r) => r.id} rows={rows} onRow={(r) => store.openJob(r.jobId)}
        cols={[
          { key: "id", label: "Invoice", w: "100px", render: (r) => <Mono>{r.id}</Mono> },
          { key: "j", label: "Job", w: "90px", render: (r) => <JobLink id={r.jobId} onOpen={store.openJob} /> },
          { key: "c", label: "Customer", w: "1.5fr", render: (r) => <span>{r.customer}{s.synced.includes(r.jobId) && <Badge tone="yellow" style={{ marginLeft: 8 }}>New</Badge>}</span> },
          { key: "i", label: "Issued", w: "100px", render: (r) => <span style={{ color: "var(--dim)" }}>{r.issued}</span> },
          { key: "d", label: "Due", w: "90px", render: (r) => <span style={{ color: "var(--dim)" }}>{r.due}</span> },
          { key: "a", label: "Amount", w: "90px", align: "right", render: (r) => <Money v={r.amount} /> },
          { key: "s", label: "Status", w: "90px", render: (r) => <Badge tone={tone(r.status)}>{r.status}</Badge> },
          { key: "b", label: "Big Red Cloud", w: "120px", render: () => <span style={{ fontSize: 12, color: "var(--ok)", display: "inline-flex", gap: 5, alignItems: "center" }}><Icon d={IC.sync} size={12} />Synced</span> },
        ]} />
    </Card>
  );
}

/* ---------------- Debtors ---------------- */
function Debtors() {
  const total = DEBTORS.reduce((a, d) => a + d.amount, 0);
  const buckets = [
    { k: "0-30", label: "0 to 30 days", color: "var(--p-cyan)" },
    { k: "30-60", label: "30 to 60 days", color: "var(--p-yellow)" },
    { k: "Overdue", label: "Overdue", color: "var(--bad)" },
  ].map((b) => ({ ...b, v: DEBTORS.filter((d) => d.bucket === b.k).reduce((a, d) => a + d.amount, 0) }));
  const sorted = [...DEBTORS].sort((a, b) => (a.bucket === "Overdue" ? -1 : b.bucket === "Overdue" ? 1 : b.amount - a.amount));
  return (
    <Grid cols="minmax(0,1fr) minmax(0,1.6fr)">
      <Card title="Outstanding" sub="Balances read from Big Red Cloud">
        <div style={{ fontSize: 40, fontWeight: 600, letterSpacing: "-1.4px" }}>{fmtEUR(total)}</div>
        <div style={{ display: "flex", height: 14, borderRadius: 9, overflow: "hidden", gap: 2, margin: "16px 0" }}>
          {buckets.map((b) => <div key={b.k} style={{ flex: b.v, background: b.color, opacity: 0.85 }} />)}
        </div>
        {buckets.map((b) => (
          <div key={b.k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderTop: "1px solid var(--border)", fontSize: 13 }}>
            <span style={{ display: "inline-flex", gap: 8, alignItems: "center" }}><span style={{ width: 9, height: 9, borderRadius: 2, background: b.color }} />{b.label}</span>
            <span><Money v={b.v} /> <span style={{ color: "var(--faint)", fontSize: 11.5 }}>{Math.round((b.v / total) * 100)}%</span></span>
          </div>
        ))}
        <Label style={{ marginTop: 10 }}>J-10473 and other ready work is not yet invoiced, so not included.</Label>
      </Card>
      <Card title="Debtors" pad={0} style={{ paddingTop: 16 }}>
        <div style={{ height: 2 }} />
        {sorted.map((d) => {
          const od = d.bucket === "Overdue";
          const c = CUSTOMERS.find((x) => x.name === d.customer);
          return (
            <div key={d.customer} className={"d-row" + (c ? " click" : "")} onClick={() => c && store.openCustomer(c.id)}
              style={{ display: "grid", gridTemplateColumns: "minmax(0,1.4fr) minmax(0,1.4fr) 90px 150px", gap: 14, alignItems: "center", padding: "13px 16px", borderTop: "1px solid var(--border)", background: od ? "var(--bad-soft)" : undefined }}>
              <div><div style={{ fontWeight: 500, fontSize: 13 }}>{d.customer}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>Oldest {d.oldest} · {d.days} days · {c?.terms} terms</div></div>
              <div style={{ height: 8, borderRadius: 9, background: "var(--surface-2)" }}><div style={{ width: Math.min(100, (d.days / 60) * 100) + "%", height: "100%", borderRadius: 9, background: od ? "var(--bad)" : d.bucket === "30-60" ? "var(--p-yellow)" : "var(--p-cyan)" }} /></div>
              <Money v={d.amount} style={{ textAlign: "right", fontWeight: 600, color: od ? "var(--bad)" : undefined }} />
              <div style={{ textAlign: "right" }} onClick={(e) => e.stopPropagation()}>
                {od ? <Btn size="sm" kind="danger" icon={IC.mail} onClick={() => store.toast("Reminder drafted for Dara Quinn · INV-7738 €1,395 · ready for Aoife", "info")}>Draft reminder</Btn> : <Badge tone={d.bucket === "30-60" ? "yellow" : "neutral"}>{d.bucket} days</Badge>}
              </div>
            </div>
          );
        })}
      </Card>
    </Grid>
  );
}

/* ---------------- Revenue ---------------- */
function Revenue() {
  const f = metrics().finance;
  const totalProd = ONLINE_PRODUCTS.reduce((a, p) => a + p.revenue, 0);
  return (
    <Grid cols="minmax(0,1.3fr) minmax(0,1fr)">
      <Card title="Monthly revenue" sub="Six months, all channels" action={<DemoTag>Demo data</DemoTag>}>
        <Bars data={REVENUE_MONTHS.map((r) => ({ label: r.m, v: r.v }))} format={(n) => "€" + (n / 1000).toFixed(1) + "k"} tone="yellow" highlightLast />
      </Card>
      <Card title="Online share of revenue" sub="Prepaid work, no chasing">
        <Bars data={REVENUE_MONTHS.map((r) => ({ label: r.m, v: Math.round((r.online / r.v) * 1000) / 10 }))} format={(n) => n + "%"} tone="cyan" highlightLast height={120} />
        <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 8 }}>From {((REVENUE_MONTHS[0].online / REVENUE_MONTHS[0].v) * 100).toFixed(1)}% in April to {((REVENUE_MONTHS[5].online / REVENUE_MONTHS[5].v) * 100).toFixed(1)}% in September.</div>
      </Card>
      <Card title="By product group" sub="Share of product revenue">
        {ONLINE_PRODUCTS.map((p, i) => (
          <div key={p.name} style={{ display: "grid", gridTemplateColumns: "150px 1fr 70px 44px", gap: 12, alignItems: "center", padding: "7px 0", fontSize: 13 }}>
            <span>{p.name}</span>
            <div style={{ height: 8, borderRadius: 9, background: "var(--surface-2)" }}><div style={{ width: (p.revenue / ONLINE_PRODUCTS[0].revenue) * 100 + "%", height: "100%", borderRadius: 9, background: i === 0 ? "var(--p-yellow)" : "var(--p-yellow-soft)", border: "1px solid var(--p-yellow-line)" }} /></div>
            <Money v={p.revenue} style={{ textAlign: "right" }} />
            <span style={{ color: "var(--faint)", fontSize: 11.5, textAlign: "right" }}>{Math.round((p.revenue / totalProd) * 100)}%</span>
          </div>
        ))}
      </Card>
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <Stat label="Average job value" value={fmtEUR(f.avgJob)} note="Account jobs trend higher, online orders average €420" big />
        <Stat label="Revenue MTD" value={fmtEUR(f.revenueMTD)} note="September to date" />
        <Card pad={16}>
          <div style={{ fontSize: 12.5, color: "var(--dim)", lineHeight: 1.5 }}>Figures read from Big Red Cloud and Stripe. Pulse does not keep a ledger, it reports on the one you already have.</div>
        </Card>
      </div>
    </Grid>
  );
}

export default function Finance() {
  const s = useDemo();
  const sec = s.section.Finance;
  const heads: Record<string, [string, string]> = {
    overview: ["Finance", "Finished work goes to Big Red Cloud straight from the job record. Nothing typed twice."],
    ready: ["Ready to invoice", "Review what finished, approve it, and send it to Big Red Cloud."],
    invoices: ["Invoices", "Every invoice, synced with Big Red Cloud."],
    debtors: ["Debtors", "Who owes what, and how long it's been."],
    revenue: ["Revenue", "Where the money comes from, month by month."],
  };
  const [t, sub] = heads[sec] || heads.overview;
  return (
    <Page>
      <Head title={t} sub={sub} />
      {sec === "ready" ? <Ready /> : sec === "invoices" ? <Invoices /> : sec === "debtors" ? <Debtors /> : sec === "revenue" ? <Revenue /> : <Overview />}
    </Page>
  );
}
