import { useState, type ReactNode } from "react";
import { Page, Head, Card, Grid, Badge, Btn, Chips, Icon, IC, Label, Stat, Table, Money, Mono, JobLink, Timeline, StageBadge, DemoTag, type Tone } from "../../demo/ui";
import { useDemo, store } from "../../demo/store";
import { CUSTOMERS, ORDERS, BYRNE_HISTORY, INVOICES, DEBTORS, CHANGE, fmtEUR, fmtNum, customer, type Customer, type Job } from "../../demo/data";

const inputStyle = { height: 34, padding: "0 12px", borderRadius: 10, border: "1px solid var(--border)", background: "var(--surface-2)", color: "var(--ink)", fontSize: 13, outline: "none", minWidth: 240 } as const;

const chTone = (c: Customer["channel"]): Tone => (c === "Online" ? "cyan" : c === "Both" ? "accent" : "neutral");

/* Deterministic past jobs for customers without a hand-written history. */
function pastJobs(c: Customer) {
  if (c.id === "byrne") return BYRNE_HISTORY.filter((h) => h.when !== "Live");
  let h = 0;
  for (const ch of c.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const months = ["14 Sep", "20 Aug", "22 Jul", "25 Jun"];
  const n = c.lifetimeJobs > 3 ? 4 : Math.max(0, c.lifetimeJobs - 1);
  return Array.from({ length: n }, (_, i) => {
    const product = c.frequent[i % c.frequent.length];
    const value = Math.round((c.avgJob * (0.7 + ((h >> (i * 3)) % 7) / 10)) / 5) * 5;
    return { id: "J-10" + (440 - i * 47 - (h % 17)), product, when: months[i], value, state: c.terms === "Prepaid" ? "Paid · Stripe" : "Invoiced · Paid" };
  });
}

function issuesFor(id: string, changeState: string) {
  const out: { tone: Tone; title: string; text: string; action?: ReactNode }[] = [];
  if (id === "byrne") {
    out.push(changeState === "pending"
      ? { tone: "magenta", title: "Change CR-118 pending", text: "J-10482: 1,000 → 2,000 cards, 2 → 5 names. Artwork paused.", action: <Btn size="sm" onClick={() => store.openChange()}>Review change</Btn> }
      : { tone: changeState === "approved" ? "ok" : "neutral", title: "CR-118 " + changeState, text: changeState === "approved" ? "Docket V3 current, artwork revision with Sarah." : "Continuing at 1,000 cards, 2 names." });
  }
  if (id === "dental") out.push({ tone: "bad", title: "Awaiting artwork, 2 days", text: "J-10470 appointment cards. Tomorrow's production slot at risk.", action: <Btn size="sm" onClick={() => store.openJob("J-10470")}>Open job</Btn> });
  if (id === "castle") out.push({ tone: "bad", title: "Invoice overdue", text: "INV-7738 €1,395, due 21 Sep.", action: <Btn size="sm" onClick={() => store.toast("Reminder drafted for Dara Quinn · waiting for Aoife to send", "info")}>Draft reminder</Btn> });
  return out;
}

/* ---------------- Overview ---------------- */
function Overview() {
  const s = useDemo();
  const top = [...CUSTOMERS].sort((a, b) => b.revenue12m - a.revenue12m).slice(0, 7);
  const max = top[0].revenue12m;
  const total = CUSTOMERS.reduce((a, c) => a + c.revenue12m, 0);
  const online = CUSTOMERS.filter((c) => c.channel === "Online").reduce((a, c) => a + c.revenue12m, 0);
  const both = CUSTOMERS.filter((c) => c.channel === "Both").reduce((a, c) => a + c.revenue12m, 0);
  const acct = total - online - both;
  const newOnline = ORDERS.filter((o) => o.newCustomer);
  const issues = [...issuesFor("byrne", s.changeState), ...issuesFor("dental", s.changeState), ...issuesFor("castle", s.changeState)];
  const names = ["Byrne & Co Solicitors", "Dublin Dental Centre", "Castle Events"];
  const ids = ["byrne", "dental", "castle"];
  return (
    <Grid cols="minmax(0,1.5fr) minmax(0,1fr)">
      <Card title="Top accounts by 12-month revenue" sub="Click an account to open its record" action={<DemoTag>Demo data</DemoTag>}>
        {top.map((c, i) => (
          <div key={c.id} className="d-row click" onClick={() => store.openCustomer(c.id)} style={{ display: "grid", gridTemplateColumns: "22px minmax(0,1.3fr) minmax(0,2fr) 80px", gap: 12, alignItems: "center", padding: "9px 6px", borderRadius: 8 }}>
            <Mono style={{ color: "var(--faint)" }}>{i + 1}</Mono>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{c.name}</div>
              <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{c.lifetimeJobs} jobs · since {c.since}</div>
            </div>
            <div style={{ height: 8, borderRadius: 9, background: "var(--surface-2)" }}>
              <div style={{ width: (c.revenue12m / max) * 100 + "%", height: "100%", borderRadius: 9, background: i === 0 ? "var(--p-cyan)" : "var(--p-cyan-soft)", border: "1px solid var(--p-cyan-line)" }} />
            </div>
            <Money v={c.revenue12m} style={{ textAlign: "right", fontSize: 13 }} />
          </div>
        ))}
      </Card>
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <Card title="Account vs online" sub={fmtEUR(total) + " across " + CUSTOMERS.length + " active customers, 12 months"}>
          <div style={{ display: "flex", height: 12, borderRadius: 9, overflow: "hidden", gap: 2 }}>
            <div style={{ flex: acct, background: "var(--border-strong)" }} />
            <div style={{ flex: both, background: "var(--accent)" }} />
            <div style={{ flex: online, background: "var(--p-cyan)" }} />
          </div>
          <Grid cols="repeat(3,1fr)" gap={8} style={{ marginTop: 12 }}>
            {[["Account", acct], ["Both", both], ["Online only", online]].map(([l, v]) => (
              <div key={l as string}><Label>{l}</Label><div style={{ fontSize: 15, fontWeight: 600, marginTop: 4 }}>{fmtEUR(v as number)}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{Math.round(((v as number) / total) * 100)}%</div></div>
            ))}
          </Grid>
        </Card>
        <Card title="New online customers this week" action={<Badge tone="cyan">{newOnline.length}</Badge>} pad={16}>
          {newOnline.map((o) => (
            <div key={o.id} style={{ display: "flex", justifyContent: "space-between", gap: 8, padding: "7px 0", borderTop: "1px solid var(--border)", fontSize: 12.5 }}>
              <span>{o.customer}<span style={{ color: "var(--faint)" }}> · {o.product}</span></span>
              <span style={{ color: "var(--dim)" }}>{fmtEUR(o.amount)} · {o.when}</span>
            </div>
          ))}
        </Card>
      </div>
      <Card title="Customers with open issues" style={{ gridColumn: "1 / -1" }}>
        <Grid cols="repeat(auto-fit,minmax(260px,1fr))">
          {issues.map((it, i) => (
            <div key={i} className="d-card click" onClick={() => store.openCustomer(ids[i])} style={{ padding: 14, borderTop: "2px solid " + (it.tone === "magenta" ? "var(--p-magenta)" : it.tone === "bad" ? "var(--bad)" : "var(--border)") }}>
              <div style={{ fontSize: 12, color: "var(--faint)" }}>{names[i]}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{it.title}</div>
              <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 4, lineHeight: 1.45 }}>{it.text}</div>
              {it.action && <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>{it.action}</div>}
            </div>
          ))}
        </Grid>
      </Card>
    </Grid>
  );
}

/* ---------------- Accounts + record ---------------- */
function Accounts() {
  const s = useDemo();
  const [q, setQ] = useState("");
  if (s.customerId) return <Record id={s.customerId} />;
  const active = (id: string) => s.jobs.filter((j) => j.customerId === id && j.stage !== "Invoiced").length;
  const rows = CUSTOMERS.filter((c) => (c.name + " " + c.contact + " " + c.frequent.join(" ")).toLowerCase().includes(q.toLowerCase()));
  return (
    <Card pad={0}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: 14, borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customer, contact or product" style={inputStyle} />
        <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{rows.length} of {CUSTOMERS.length} accounts · synced from PrintLogic and the website</span>
      </div>
      <Table<Customer> rowKey={(c) => c.id} rows={rows} onRow={(c) => store.openCustomer(c.id)} empty="No customers match that search."
        cols={[
          { key: "n", label: "Customer", w: "minmax(180px,2fr)", render: (c) => <div><div style={{ fontWeight: 500 }}>{c.name}</div><div style={{ fontSize: 11.5, color: "var(--faint)" }}>{c.contact}</div></div> },
          { key: "a", label: "Active jobs", w: "90px", align: "right", render: (c) => { const n = active(c.id); return n ? <Badge tone="cyan">{n}</Badge> : <span style={{ color: "var(--faint)" }}>0</span>; } },
          { key: "l", label: "Lifetime jobs", w: "100px", align: "right", render: (c) => fmtNum(c.lifetimeJobs) },
          { key: "r", label: "12m revenue", w: "110px", align: "right", render: (c) => <Money v={c.revenue12m} /> },
          { key: "o", label: "Outstanding", w: "110px", align: "right", render: (c) => c.outstanding ? <Money v={c.outstanding} style={{ color: c.id === "castle" ? "var(--bad)" : "var(--p-yellow)" }} /> : <span style={{ color: "var(--faint)" }}>€0</span> },
          { key: "c", label: "Channel", w: "100px", render: (c) => <Badge tone={chTone(c.channel)}>{c.channel}</Badge> },
          { key: "f", label: "Usually orders", w: "minmax(160px,1.6fr)", render: (c) => <span style={{ color: "var(--dim)", fontSize: 12.5 }}>{c.frequent.join(", ")}</span> },
        ]} />
    </Card>
  );
}

function Fact({ k, v }: { k: string; v: ReactNode }) {
  return <div style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "7px 0", borderTop: "1px solid var(--border)", fontSize: 13 }}><span style={{ color: "var(--dim)" }}>{k}</span><span style={{ textAlign: "right" }}>{v}</span></div>;
}

function Record({ id }: { id: string }) {
  const s = useDemo();
  const c = customer(id);
  if (!c) return null;
  const jobs = s.jobs.filter((j) => j.customerId === id && j.stage !== "Invoiced");
  const past = pastJobs(c);
  const invs = INVOICES.filter((i) => i.customer === c.name);
  const debt = DEBTORS.find((d) => d.customer === c.name);
  const issues = issuesFor(id, s.changeState);
  const jobIds = new Set(s.jobs.filter((j) => j.customerId === id).map((j) => j.id));
  const events = s.events.filter((e) => e.jobId && jobIds.has(e.jobId)).slice(-8).reverse();
  return (
    <>
      <Head back={{ label: "All accounts", onClick: () => store.closeCustomer() }} title={c.name}
        sub={<>{c.contact} · {c.email} · {c.phone} · customer since {c.since}</>}
        actions={<><Badge tone={chTone(c.channel)}>{c.channel}</Badge><Btn icon={IC.mail} onClick={() => store.toast("Email to " + c.contact + " opened in Outlook", "info")}>Email</Btn></>} />
      <Grid cols="repeat(5,minmax(0,1fr))" style={{ marginBottom: 14 }}>
        <Stat label="Active jobs" value={jobs.length} tone={jobs.length ? "cyan" : undefined} />
        <Stat label="Lifetime jobs" value={c.lifetimeJobs} />
        <Stat label="12-month revenue" value={fmtEUR(c.revenue12m)} />
        <Stat label="Average job" value={fmtEUR(c.avgJob)} />
        <Stat label="Outstanding" value={fmtEUR(c.outstanding)} tone={c.outstanding ? "yellow" : "ok"} />
      </Grid>
      <Grid cols="minmax(0,1.6fr) minmax(0,1fr)">
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Card title="Active jobs" sub="Live from the job record" pad={0} style={{ paddingTop: 16 }}>
            <div style={{ padding: "0 16px" }} />
            <Table<Job> dense rowKey={(j) => j.id} rows={jobs} onRow={(j) => store.openJob(j.id)} empty="No live jobs."
              cols={[
                { key: "id", label: "Job", w: "90px", render: (j) => <JobLink id={j.id} onOpen={store.openJob} /> },
                { key: "p", label: "Product", w: "1.4fr", render: (j) => <span>{j.product} <span style={{ color: "var(--faint)" }}>× {fmtNum(j.qty)}</span></span> },
                { key: "s", label: "Stage", w: "140px", render: (j) => <StageBadge stage={j.stage} /> },
                { key: "d", label: "Docket", w: "70px", render: (j) => <Mono>V{j.docketV}</Mono> },
                { key: "v", label: "Value", w: "80px", align: "right", render: (j) => <Money v={j.value} /> },
              ]} />
          </Card>
          <Card title="Bought before" sub={c.id === "byrne" ? "Last six jobs" : "Recent jobs"} pad={0} style={{ paddingTop: 16 }}>
            <Table dense rowKey={(r) => r.id} rows={past} empty="First order with us."
              cols={[
                { key: "id", label: "Job", w: "90px", render: (r) => <Mono>{r.id}</Mono> },
                { key: "p", label: "Product", w: "1.5fr", render: (r) => r.product },
                { key: "w", label: "Date", w: "80px", render: (r) => <span style={{ color: "var(--dim)" }}>{r.when}</span> },
                { key: "s", label: "Status", w: "130px", render: (r) => <Badge tone="ok">{r.state}</Badge> },
                { key: "v", label: "Value", w: "80px", align: "right", render: (r) => <Money v={r.value} /> },
              ]} />
          </Card>
          <Card title="Recent activity" sub="From the shared job record">
            {events.length ? <Timeline items={events.map((e) => ({ t: e.t, text: e.text, who: e.who, tone: e.kind === "attention" ? "magenta" : e.kind === "system" ? "cyan" : e.kind === "agent" ? "accent" : "ok" }))} /> : <div style={{ color: "var(--dim)", fontSize: 13 }}>No activity today.</div>}
          </Card>
        </div>
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          {issues.length > 0 && (
            <Card title="Open changes and issues" style={{ borderColor: "var(--p-magenta-line)" }}>
              {issues.map((it, i) => (
                <div key={i} style={{ padding: "10px 0", borderTop: i ? "1px solid var(--border)" : undefined }}>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Badge tone={it.tone} dot>{it.title}</Badge></div>
                  <div style={{ fontSize: 12.5, color: "var(--dim)", margin: "6px 0 8px" }}>{it.text}</div>
                  {it.action}
                </div>
              ))}
              {id === "byrne" && <div style={{ fontSize: 11.5, color: "var(--faint)" }}>Change {CHANGE.id} · received {CHANGE.received} · value {fmtEUR(CHANGE.valueBefore)} → {fmtEUR(CHANGE.valueAfter)}</div>}
            </Card>
          )}
          <Card title="What they usually order">
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>{c.frequent.map((f, i) => <Badge key={f} tone={i === 0 ? "cyan" : "neutral"}>{f}</Badge>)}</div>
          </Card>
          <Card title="Pricing and terms" sub="From PrintLogic">
            <Fact k="Price list" v={c.pricing} />
            <Fact k="Payment terms" v={c.terms} />
            <Fact k="Contact" v={c.contact} />
          </Card>
          <Card title="Anything unpaid" sub="Balances from Big Red Cloud">
            <Fact k="Outstanding" v={<Money v={c.outstanding} style={{ color: c.outstanding ? "var(--p-yellow)" : "var(--ok)", fontWeight: 600 }} />} />
            {debt && <Fact k="Oldest item" v={debt.oldest + " · " + debt.days + " days"} />}
            {invs.map((i) => <Fact key={i.id} k={i.id} v={<span>{fmtEUR(i.amount)} <Badge tone={i.status === "Paid" ? "ok" : i.status === "Overdue" ? "bad" : "neutral"}>{i.status}</Badge></span>} />)}
            {!c.outstanding && !invs.length && <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 6 }}>Nothing owed. All invoices paid.</div>}
          </Card>
        </div>
      </Grid>
    </>
  );
}

/* ---------------- Contacts ---------------- */
const ROLES: Record<string, string> = { byrne: "Office Manager", summit: "Marketing Lead", nova: "Director", dental: "Practice Principal", greenline: "Owner", harbourview: "Events Manager", kavanagh: "Owner", castle: "Producer", oakfield: "School Secretary", fitzgerald: "Principal", corrib: "Pharmacist", liffey: "Operations Manager", mill: "Box Office", hartley: "Partner", lennon: "Principal", brightside: "Group Admin", wexford: "Marketing" };
function Contacts() {
  return (
    <Card pad={0}>
      <Table<Customer> dense rowKey={(c) => c.id} rows={CUSTOMERS} onRow={(c) => store.openCustomer(c.id)}
        cols={[
          { key: "n", label: "Name", w: "1.2fr", render: (c) => <span style={{ fontWeight: 500 }}>{c.contact}</span> },
          { key: "co", label: "Company", w: "1.5fr", render: (c) => <span style={{ color: "var(--dim)" }}>{c.name}</span> },
          { key: "r", label: "Role", w: "1fr", render: (c) => ROLES[c.id] },
          { key: "e", label: "Email", w: "1.6fr", render: (c) => <Mono>{c.email}</Mono> },
          { key: "p", label: "Phone", w: "120px", render: (c) => <Mono>{c.phone}</Mono> },
          { key: "pc", label: "Prefers", w: "100px", render: (c) => <Badge tone={c.channel === "Online" ? "cyan" : "neutral"}>{c.channel === "Online" ? "Website" : c.phone.startsWith("08") ? "Phone" : "Email"}</Badge> },
        ]} />
    </Card>
  );
}

/* ---------------- Job history ---------------- */
type HRow = { id: string; customer: string; cid: string; product: string; when: string; value: number; state: string; live: boolean };
function History() {
  const s = useDemo();
  const [f, setF] = useState<"all" | "Account" | "Online" | "Both">("all");
  const rows: HRow[] = [
    ...s.jobs.map((j) => ({ id: j.id, customer: j.customer, cid: j.customerId, product: j.product + " × " + fmtNum(j.qty), when: j.completed || j.due, value: j.value, state: j.stage, live: true })),
    ...ORDERS.filter((o) => !s.jobs.some((j) => j.id === o.jobId)).map((o) => ({ id: o.jobId, customer: o.customer, cid: "", product: o.product + " × " + fmtNum(o.qty), when: o.when, value: o.amount, state: o.status + " · paid", live: false })),
    ...INVOICES.filter((i) => !ORDERS.some((o) => o.jobId === i.jobId)).map((i) => ({ id: i.jobId, customer: i.customer, cid: CUSTOMERS.find((c) => c.name === i.customer)?.id || "", product: i.id, when: i.issued, value: i.amount, state: "Invoiced · " + i.status, live: false })),
  ];
  const chan = (r: HRow): Customer["channel"] => customer(r.cid)?.channel || "Online";
  const shown = rows.filter((r) => f === "all" || chan(r) === f);
  const cnt = (c: string) => rows.filter((r) => chan(r) === c).length;
  return (
    <Card pad={0}>
      <div style={{ padding: 14, borderBottom: "1px solid var(--border)", display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <Chips value={f} onChange={setF} options={[{ id: "all", label: "All", count: rows.length }, { id: "Account", label: "Account", count: cnt("Account") }, { id: "Online", label: "Online", count: cnt("Online") }, { id: "Both", label: "Both", count: cnt("Both") }]} />
        <span style={{ fontSize: 12.5, color: "var(--dim)" }}>Live, completed and invoiced work in one list</span>
      </div>
      <Table<HRow> dense rowKey={(r) => r.id} rows={shown} onRow={(r) => (r.live ? store.openJob(r.id) : r.cid && store.openCustomer(r.cid))}
        cols={[
          { key: "id", label: "Job", w: "90px", render: (r) => <Mono>{r.id}</Mono> },
          { key: "c", label: "Customer", w: "1.4fr", render: (r) => r.customer },
          { key: "p", label: "Product / ref", w: "1.4fr", render: (r) => <span style={{ color: "var(--dim)" }}>{r.product}</span> },
          { key: "ch", label: "Channel", w: "90px", render: (r) => <Badge tone={chTone(chan(r))}>{chan(r)}</Badge> },
          { key: "w", label: "When", w: "130px", render: (r) => <span style={{ color: "var(--dim)" }}>{r.when}</span> },
          { key: "s", label: "Status", w: "170px", render: (r) => <Badge tone={r.live ? (r.state === "Ready to Invoice" ? "yellow" : "cyan") : "ok"}>{r.state}</Badge> },
          { key: "v", label: "Value", w: "80px", align: "right", render: (r) => <Money v={r.value} /> },
        ]} />
    </Card>
  );
}

/* ---------------- Repeat work ---------------- */
const CYCLES = [
  { cid: "liffey", product: "Letterheads", cycle: "Every ~8 weeks", last: "3 Aug", next: "Due now", qty: "2,000", value: 360, due: true, hits: [1, 1, 0, 1, 1, 0, 1, 1] },
  { cid: "byrne", product: "Business Cards", cycle: "Every ~12 weeks", last: "24 Jun", next: "In progress (J-10482)", qty: "1,000", value: 210, due: false, hits: [1, 0, 1, 0, 1, 0, 1, 1] },
  { cid: "oakfield", product: "Booklets", cycle: "Each school term", last: "Today", next: "January", qty: "300", value: 690, due: false, hits: [1, 0, 0, 1, 0, 0, 1, 0] },
  { cid: "dental", product: "Appointment Cards", cycle: "Every ~6 months", last: "Live (J-10470)", next: "March", qty: "10,000", value: 780, due: false, hits: [1, 0, 0, 0, 1, 0, 0, 1] },
  { cid: "mill", product: "A3 Posters", cycle: "Every production run", last: "Today", next: "3 Nov", qty: "300", value: 395, due: false, hits: [1, 1, 1, 0, 1, 1, 1, 1] },
  { cid: "hartley", product: "Letterheads", cycle: "Every ~10 weeks", last: "17 Jul", next: "Due this week", qty: "1,000", value: 245, due: true, hits: [1, 0, 1, 0, 0, 1, 0, 1] },
  { cid: "harbourview", product: "Menus", cycle: "Seasonal", last: "2 Sep", next: "Due, winter menu", qty: "150", value: 420, due: true, hits: [0, 1, 0, 1, 0, 1, 0, 1] },
];
function Repeat() {
  const due = CYCLES.filter((c) => c.due);
  return (
    <Grid cols="minmax(0,1.7fr) minmax(0,1fr)">
      <Card title="Reorder cycles" sub="Detected from job history · last 8 periods" pad={0} style={{ paddingTop: 16 }}>
        <div style={{ height: 4 }} />
        {CYCLES.map((r) => {
          const c = customer(r.cid)!;
          return (
            <div key={r.cid + r.product} className="d-row click" onClick={() => store.openCustomer(r.cid)} style={{ display: "grid", gridTemplateColumns: "minmax(0,1.6fr) minmax(0,1fr) 150px minmax(0,1fr)", gap: 14, alignItems: "center", padding: "11px 16px", borderTop: "1px solid var(--border)" }}>
              <div style={{ minWidth: 0 }}><div style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</div><div style={{ fontSize: 12, color: "var(--dim)" }}>{r.product} × {r.qty}</div></div>
              <div style={{ fontSize: 12.5, color: "var(--dim)" }}>{r.cycle}</div>
              <div style={{ display: "flex", gap: 3 }}>{r.hits.map((h, i) => <span key={i} style={{ flex: 1, height: 14, borderRadius: 3, background: h ? "var(--p-cyan)" : "var(--surface-2)", opacity: h ? 0.4 + i * 0.08 : 1 }} />)}</div>
              <div style={{ fontSize: 12.5, textAlign: "right" }}>{r.due ? <Badge tone="yellow">{r.next}</Badge> : <span style={{ color: "var(--faint)" }}>{r.next}</span>}</div>
            </div>
          );
        })}
      </Card>
      <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
        <Card title="Due for reorder" sub="Pulse drafts the job from the last approved spec" action={<Badge tone="yellow">{due.length}</Badge>}>
          {due.map((r) => {
            const c = customer(r.cid)!;
            return (
              <div key={r.cid} style={{ padding: "12px 0", borderTop: "1px solid var(--border)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><span style={{ fontWeight: 500, fontSize: 13 }}>{c.name}</span><Money v={r.value} style={{ fontSize: 13 }} /></div>
                <div style={{ fontSize: 12, color: "var(--dim)", margin: "3px 0 9px" }}>{r.product} × {r.qty} · last ordered {r.last}</div>
                <Btn size="sm" icon={IC.docket} onClick={() => store.toast("Reorder drafted for " + c.name + " · " + r.product + " · awaiting " + c.contact + "'s OK", "info")}>Draft reorder</Btn>
              </div>
            );
          })}
        </Card>
        <Card pad={16}>
          <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <Icon d={IC.spark} size={16} style={{ color: "var(--accent)", marginTop: 2 }} />
            <div style={{ fontSize: 12.5, color: "var(--dim)", lineHeight: 1.5 }}>Repeat work is {fmtEUR(CYCLES.reduce((a, r) => a + r.value, 0))} per cycle across these accounts. Reorders reuse the last docket, so specs are never retyped.</div>
          </div>
        </Card>
      </div>
    </Grid>
  );
}

export default function Customers() {
  const s = useDemo();
  const sec = s.section.Customers;
  const heads: Record<string, [string, string]> = {
    overview: ["Customers", "Who matters, who's new online, and who needs a call today."],
    accounts: ["Accounts", "Every account with live work, lifetime value and anything owed."],
    contacts: ["Contacts", "The people we actually deal with at each account."],
    history: ["Job history", "Every job across customers, live and completed."],
    repeat: ["Repeat work", "Customers who reorder on a cycle, and who's due."],
  };
  const [t, sub] = heads[sec] || heads.overview;
  return (
    <Page>
      {!(sec === "accounts" && s.customerId) && <Head title={t} sub={sub} />}
      {sec === "accounts" ? <Accounts /> : sec === "contacts" ? <Contacts /> : sec === "history" ? <History /> : sec === "repeat" ? <Repeat /> : <Overview />}
    </Page>
  );
}
