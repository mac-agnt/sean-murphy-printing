import { useState } from "react";
import { useDemo, store, metrics } from "../../demo/store";
import { ORDERS, ONLINE_TREND, ONLINE_PRODUCTS, PAYMENT_EXCEPTIONS, EFFICIENCY, fmtEUR, fmtNum, type Order } from "../../demo/data";
import { Page, Head, Card, Grid, Badge, Btn, Chips, Icon, IC, Label, Stat, Table, Mono, Money, JobLink, Timeline, Flow, DemoTag, type Tone } from "../../demo/ui";

export default function OnlineOrders() {
  const s = useDemo();
  const sec = s.section["Online Orders"];
  return (
    <Page>
      {sec === "overview" && <Overview />}
      {sec === "orders" && <Orders />}
      {sec === "products" && <Products />}
      {sec === "payments" && <Payments />}
      {sec === "exceptions" && <Exceptions />}
    </Page>
  );
}

const timeOf = (o: Order) => (o.when.match(/\d\d:\d\d/) || ["10:02"])[0];
const addMin = (t: string, m: number) => { const [h, mm] = t.split(":").map(Number); const x = h * 60 + mm + m; return String(Math.floor(x / 60)).padStart(2, "0") + ":" + String(x % 60).padStart(2, "0"); };

function orderTimeline(o: Order) {
  const t = timeOf(o);
  const items: { t: string; text: string; tone?: Tone; who?: string }[] = [
    { t, text: `Website order ${o.id} submitted: ${fmtNum(o.qty)} ${o.product}`, tone: "neutral", who: "Website" },
    { t, text: `Stripe payment confirmed, ${fmtEUR(o.amount)}`, tone: "yellow", who: "Stripe" },
    { t: addMin(t, 1), text: o.newCustomer ? "New customer record created" : "Customer record matched", tone: "cyan", who: "Online Orders Agent" },
    { t: addMin(t, 1), text: `Job ${o.jobId} created`, tone: "cyan", who: "Online Orders Agent" },
    { t: addMin(t, 1), text: "Digital docket generated", tone: "cyan", who: "Docket Agent" },
    { t: addMin(t, 2), text: "Artwork check queued", tone: "magenta", who: "Sarah Byrne" },
  ];
  if (o.status === "Dispatched" || o.status === "Collected") items.push({ t: "later", text: o.status === "Dispatched" ? "Printed, QC passed, dispatched by courier" : "Printed, QC passed, collected", tone: "ok", who: "Jack Brennan" });
  return items;
}

const statusTone = (st: Order["status"]): Tone => st === "Artwork Queue" ? "magenta" : st === "In Production" ? "cyan" : "ok";

/* ---------------- Overview ---------------- */
function Overview() {
  const s = useDemo();
  const m = metrics(s);
  const first = ONLINE_TREND[0].v, last = ONLINE_TREND[ONLINE_TREND.length - 1].v;
  const growth = Math.round(((last - first) / first) * 100);
  const o = ORDERS[0];
  return (
    <>
      <Head title="Online orders" sub="Paid on the website, built into a job, queued for artwork. Nobody in the office touched it." actions={<>
        <Btn icon={IC.online} onClick={() => store.setSection("Online Orders", "orders")}>All orders</Btn>
      </>} />
      <Grid cols="repeat(6,minmax(0,1fr))" style={{ marginBottom: 14 }}>
        <Stat label="Orders this week" value={m.onlineCount} note={`${ORDERS.filter((x) => x.newCustomer).length} new customers`} />
        <Stat label="Revenue" value={fmtEUR(m.onlineRevenue)} tone="yellow" note="All prepaid" />
        <Stat label="Paid before production" value="100%" tone="ok" note="Zero payment chasing" />
        <Stat label="Jobs auto-created" value={m.onlineCount} tone="cyan" note="From Stripe confirmation" />
        <Stat label="Average order" value={fmtEUR(m.onlineRevenue / m.onlineCount)} note="vs €472 all jobs" />
        <Stat label="Admin touches avoided" value={EFFICIENCY.adminTouchesAvoided} note={<DemoTag />} />
      </Grid>

      <Grid cols="minmax(0,1.35fr) minmax(0,1fr)" style={{ marginBottom: 14 }}>
        <Card title="Online order revenue, last 12 weeks" sub="Website orders are becoming a growth channel" action={<Badge tone="cyan">+{growth}% since July</Badge>}>
          <AreaChart data={ONLINE_TREND.map((d) => ({ label: d.w, v: d.v }))} />
        </Card>

        <Card pad={0} style={{ overflow: "hidden", borderColor: "var(--p-cyan-line)" }}>
          <div style={{ padding: "18px 20px 14px", borderBottom: "1px solid var(--border)", display: "flex", gap: 12, alignItems: "flex-start" }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Mono style={{ color: "var(--dim)" }}>{o.id}</Mono><Icon d={IC.arrow} size={12} style={{ color: "var(--faint)" }} /><JobLink id={o.jobId} onOpen={store.openJob} /></div>
              <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-.4px", marginTop: 6 }}>{o.customer}</div>
              <div style={{ fontSize: 12.5, color: "var(--dim)" }}>{fmtNum(o.qty)} {o.product} · <Money v={o.amount} /></div>
            </div>
            <Badge tone="yellow" style={{ fontWeight: 600, letterSpacing: ".04em" }}>PAID · STRIPE</Badge>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 150px" }}>
            <div style={{ padding: 20 }}><Timeline items={orderTimeline(o).slice(0, 6)} /></div>
            <div style={{ borderLeft: "1px solid var(--border)", padding: 20, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", background: "var(--p-cyan-soft)" }}>
              <div style={{ fontSize: 64, fontWeight: 600, lineHeight: 1, color: "var(--p-cyan)", letterSpacing: "-3px" }}>0</div>
              <div style={{ fontFamily: "var(--mono)", fontSize: 10.5, letterSpacing: ".12em", marginTop: 8, color: "var(--ink)" }}>MANUAL DATA ENTRY</div>
              <div style={{ fontSize: 11.5, color: "var(--dim)", marginTop: 8 }}>2 minutes, order to artwork queue</div>
            </div>
          </div>
        </Card>
      </Grid>

      <Grid cols="minmax(0,1.35fr) minmax(0,1fr)">
        <Card title="How a web order moves" sub="Triggered by Stripe payment confirmation">
          <Flow steps={["Website order", "Stripe payment", "Job created", "Docket", "Production queue"]} active={4} tone="cyan" />
          <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 14, lineHeight: 1.5 }}>Specs, artwork file and delivery details arrive with the order, so the job record and docket are complete from the first minute. Big Red Cloud receives the paid invoice data on completion.</div>
        </Card>
        <Card title="Same order, two ways in">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)" }}>
              <Label>Phone or email order today</Label>
              <div style={{ fontSize: 30, fontWeight: 600, color: "var(--warn)", margin: "6px 0" }}>6</div>
              <div style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.5 }}>manual steps: take specs, quote, payment link, chase payment, write docket, key into Big Red Cloud</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--p-cyan-soft)", border: "1px solid var(--p-cyan-line)" }}>
              <Label>Website order</Label>
              <div style={{ fontSize: 30, fontWeight: 600, color: "var(--p-cyan)", margin: "6px 0" }}>0</div>
              <div style={{ fontSize: 11.5, color: "var(--dim)", lineHeight: 1.5 }}>manual steps. Paid, built and queued before anyone opens the inbox.</div>
            </div>
          </div>
        </Card>
      </Grid>
    </>
  );
}

function AreaChart({ data }: { data: { label: string; v: number }[] }) {
  const W = 600, H = 190, P = 6;
  const max = Math.max(...data.map((d) => d.v)) * 1.12;
  const x = (i: number) => P + (i / (data.length - 1)) * (W - 2 * P);
  const y = (v: number) => H - (v / max) * H;
  const line = data.map((d, i) => `${i ? "L" : "M"}${x(i)},${y(d.v)}`).join(" ");
  const [hov, setHov] = useState<number | null>(null);
  const h = hov ?? data.length - 1;
  return (
    <div>
      <div style={{ position: "relative" }}>
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height: 200, display: "block", overflow: "visible" }} onMouseLeave={() => setHov(null)}>
          <defs>
            <linearGradient id="onl-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--p-cyan)" stopOpacity=".32" /><stop offset="1" stopColor="var(--p-cyan)" stopOpacity="0" /></linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((f) => <line key={f} x1={0} x2={W} y1={H * f} y2={H * f} stroke="var(--border)" strokeDasharray="3 4" vectorEffect="non-scaling-stroke" />)}
          <path d={`${line} L${x(data.length - 1)},${H} L${x(0)},${H} Z`} fill="url(#onl-g)" />
          <path d={line} fill="none" stroke="var(--p-cyan)" strokeWidth={2} vectorEffect="non-scaling-stroke" />
          <line x1={x(h)} x2={x(h)} y1={0} y2={H} stroke="var(--border-strong)" vectorEffect="non-scaling-stroke" />
          {data.map((d, i) => <rect key={i} x={x(i) - (W / data.length) / 2} y={0} width={W / data.length} height={H} fill="transparent" onMouseEnter={() => setHov(i)} />)}
        </svg>
        <div style={{ position: "absolute", left: `${(x(h) / W) * 100}%`, top: `${(y(data[h].v) / H) * 200}px`, width: 10, height: 10, borderRadius: 9, background: "var(--p-cyan)", transform: "translate(-50%,-50%)", boxShadow: "0 0 0 4px var(--p-cyan-soft)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", left: `min(max(${(x(h) / W) * 100}%, 60px), calc(100% - 60px))`, top: -6, transform: "translate(-50%,-100%)", fontSize: 12, padding: "3px 8px", borderRadius: 7, background: "var(--surface-2)", border: "1px solid var(--border)", whiteSpace: "nowrap", pointerEvents: "none" }}>
          <Mono style={{ color: "var(--faint)" }}>w/c {data[h].label}</Mono> <b>{fmtEUR(data[h].v)}</b>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        {data.map((d, i) => <Mono key={i} style={{ fontSize: 10, color: i === h ? "var(--ink)" : "var(--faint)", visibility: i % 2 === 0 || i === data.length - 1 ? "visible" : "hidden" }}>{d.label}</Mono>)}
      </div>
    </div>
  );
}

/* ---------------- Orders ---------------- */
function Orders() {
  const s = useDemo();
  const [f, setF] = useState<"all" | "live" | "done">("all");
  const rows = ORDERS.filter((o) => f === "all" || (f === "live" ? o.status === "Artwork Queue" || o.status === "In Production" : o.status === "Dispatched" || o.status === "Collected"));
  const sel = ORDERS.find((o) => o.id === s.orderId);
  return (
    <>
      <Head title="Orders" sub="Every website order this week, each one already a job." actions={<Chips value={f} onChange={setF} options={[
        { id: "all", label: "All", count: ORDERS.length },
        { id: "live", label: "In progress", count: ORDERS.filter((o) => o.status === "Artwork Queue" || o.status === "In Production").length },
        { id: "done", label: "Dispatched / collected", count: ORDERS.filter((o) => o.status === "Dispatched" || o.status === "Collected").length },
      ]} />} />
      <Grid cols={sel ? "minmax(0,1fr) 360px" : "minmax(0,1fr)"}>
        <Card pad={0} style={{ overflow: "hidden" }}>
          <Table rows={rows} rowKey={(o) => o.id} selected={s.orderId} onRow={(o) => store.openOrder(o.id)} cols={[
            { key: "id", label: "Order", w: "86px", render: (o) => <Mono style={{ fontWeight: 600 }}>{o.id}</Mono> },
            { key: "c", label: "Customer", w: "1.4fr", render: (o) => <span style={{ fontWeight: 500 }}>{o.customer}{o.newCustomer && <Badge tone="cyan" style={{ marginLeft: 8, height: 18, fontSize: 10.5 }}>New</Badge>}</span> },
            { key: "p", label: "Product", w: "1.2fr", render: (o) => <span style={{ color: "var(--dim)" }}>{o.product}</span> },
            { key: "q", label: "Qty", w: "70px", align: "right", render: (o) => fmtNum(o.qty) },
            { key: "a", label: "Amount", w: "80px", align: "right", render: (o) => <Money v={o.amount} /> },
            { key: "pd", label: "Paid", w: "110px", render: () => <Badge tone="yellow">Paid · Stripe</Badge> },
            { key: "j", label: "Job created", w: "96px", render: (o) => <JobLink id={o.jobId} onOpen={store.openJob} /> },
            { key: "s", label: "Status", w: "126px", render: (o) => <Badge tone={statusTone(o.status)} dot>{o.status}</Badge> },
            { key: "w", label: "When", w: "116px", render: (o) => <span style={{ fontSize: 12, color: "var(--dim)" }}>{o.when}</span> },
          ]} />
        </Card>
        {sel && (
          <Card key={sel.id} className="d-in" action={<Btn size="sm" kind="ghost" icon={IC.x} onClick={() => store.closeOrder()} />} title={<Mono style={{ fontSize: 14 }}>{sel.id}</Mono>} sub={sel.when}>
            <div style={{ fontSize: 19, fontWeight: 600, letterSpacing: "-.3px" }}>{sel.customer}</div>
            <div style={{ fontSize: 12.5, color: "var(--dim)", marginBottom: 12 }}>{fmtNum(sel.qty)} {sel.product}</div>
            <div style={{ display: "flex", gap: 6, marginBottom: 16, flexWrap: "wrap" }}>
              <Badge tone="yellow">PAID · STRIPE <Money v={sel.amount} /></Badge><Badge tone={statusTone(sel.status)} dot>{sel.status}</Badge>
            </div>
            <Timeline items={orderTimeline(sel)} />
            <div style={{ marginTop: 16, padding: 12, borderRadius: 10, background: "var(--p-cyan-soft)", border: "1px solid var(--p-cyan-line)", fontSize: 12.5 }}>
              <b style={{ color: "var(--p-cyan)" }}>0 manual data entry.</b> Specs, file and payment flowed straight into {sel.jobId}.
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <Btn kind="primary" icon={IC.jobs} onClick={() => store.openJob(sel.jobId)}>Open {sel.jobId}</Btn>
              <Btn icon={IC.docket} onClick={() => store.openDocket(sel.jobId)}>Docket</Btn>
            </div>
          </Card>
        )}
      </Grid>
    </>
  );
}

/* ---------------- Products ---------------- */
function Products() {
  const top = Math.max(...ONLINE_PRODUCTS.map((p) => p.revenue));
  const total = ONLINE_PRODUCTS.reduce((a, p) => a + p.revenue, 0);
  return (
    <>
      <Head title="Products" sub="What people buy on the website, and how often they come back." actions={<DemoTag>Demo product catalogue</DemoTag>} />
      <Grid min={240}>
        {ONLINE_PRODUCTS.map((p, i) => (
          <Card key={p.name} className="d-tile" pad={18} style={i === 0 ? { borderColor: "var(--p-cyan-line)" } : undefined}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontSize: 14.5, fontWeight: 600 }}>{p.name}</div>
              <Mono style={{ color: "var(--faint)" }}>{Math.round((p.revenue / total) * 100)}% of sales</Mono>
            </div>
            <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-.8px", marginTop: 10 }}>{fmtEUR(p.revenue)}</div>
            <div style={{ height: 5, borderRadius: 4, background: "var(--surface-2)", marginTop: 8, overflow: "hidden" }}>
              <div style={{ width: `${(p.revenue / top) * 100}%`, height: "100%", background: "var(--p-cyan)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", marginTop: 14, gap: 6 }}>
              <div><Label>Orders</Label><div style={{ fontSize: 15, fontWeight: 500, marginTop: 3 }}>{p.orders}</div></div>
              <div><Label>Avg value</Label><div style={{ fontSize: 15, fontWeight: 500, marginTop: 3 }}>{fmtEUR(p.revenue / p.orders)}</div></div>
              <div><Label>Repeat</Label><div style={{ fontSize: 15, fontWeight: 500, marginTop: 3, color: p.repeat >= 50 ? "var(--ok)" : "var(--ink)" }}>{p.repeat}%</div></div>
            </div>
            <div style={{ display: "flex", gap: 2, marginTop: 10 }}>
              {Array.from({ length: 20 }, (_, k) => <span key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: k < p.repeat / 5 ? "var(--ok)" : "var(--surface-2)" }} />)}
            </div>
          </Card>
        ))}
      </Grid>
    </>
  );
}

/* ---------------- Payments ---------------- */
function Payments() {
  const fee = (a: number) => Math.round((a * 0.015 + 0.25) * 100) / 100;
  const paidOut = ORDERS.slice(5);
  const pending = ORDERS.slice(0, 5);
  const sum = (l: Order[]) => l.reduce((a, o) => a + o.amount - fee(o.amount), 0);
  const eur2 = (n: number) => "€" + n.toLocaleString("en-IE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return (
    <>
      <Head title="Payments" sub="Stripe handles website payments. Pulse reads each confirmation and never holds card data." />
      <Grid cols="minmax(0,1fr) 320px">
        <Card pad={0} style={{ overflow: "hidden" }} title={<span style={{ padding: "18px 20px 0", display: "block" }}>Stripe payments this week</span>}>
          <Table dense rows={ORDERS} rowKey={(o) => o.id} onRow={(o) => store.openOrder(o.id)} cols={[
            { key: "w", label: "Date", w: "120px", render: (o) => <span style={{ fontSize: 12, color: "var(--dim)" }}>{o.when}</span> },
            { key: "pi", label: "Payment", w: "130px", render: (o) => <Mono style={{ color: "var(--dim)" }}>pi_{o.id.slice(2)}{o.jobId.slice(-3)}</Mono> },
            { key: "o", label: "Order", w: "80px", render: (o) => <Mono>{o.id}</Mono> },
            { key: "c", label: "Customer", w: "1.3fr", render: (o) => o.customer },
            { key: "a", label: "Gross", w: "80px", align: "right", render: (o) => eur2(o.amount) },
            { key: "f", label: "Fee", w: "70px", align: "right", render: (o) => <span style={{ color: "var(--faint)" }}>{eur2(fee(o.amount))}</span> },
            { key: "s", label: "Status", w: "100px", render: () => <Badge tone="ok"><Icon d={IC.check} size={11} stroke={2.4} />Succeeded</Badge> },
            { key: "p", label: "Payout", w: "100px", render: (o) => <span style={{ fontSize: 12, color: paidOut.includes(o) ? "var(--dim)" : "var(--p-yellow)" }}>{paidOut.includes(o) ? "Paid out" : "Tue 29 Sep"}</span> },
          ]} />
        </Card>
        <div style={{ display: "grid", gap: 14, alignContent: "start" }}>
          <Card title="Next payout" sub="To AIB business account">
            <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: "-1px", color: "var(--p-yellow)" }}>{eur2(sum(pending))}</div>
            <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 6 }}>Tue 29 Sep · {pending.length} payments, net of fees</div>
            <div style={{ borderTop: "1px solid var(--border)", marginTop: 14, paddingTop: 12, fontSize: 12.5, display: "grid", gridTemplateColumns: "1fr auto", rowGap: 6 }}>
              <span style={{ color: "var(--dim)" }}>Paid out Fri 25 Sep</span><span>{eur2(sum(paidOut))}</span>
              <span style={{ color: "var(--dim)" }}>Gross this week</span><span>{fmtEUR(ORDERS.reduce((a, o) => a + o.amount, 0))}</span>
              <span style={{ color: "var(--dim)" }}>Fees</span><span>{eur2(ORDERS.reduce((a, o) => a + fee(o.amount), 0))}</span>
              <span style={{ color: "var(--dim)" }}>Failed / refunded</span><span>0</span>
            </div>
            <div style={{ marginTop: 10 }}><DemoTag>Demo fees</DemoTag></div>
          </Card>
          <Card title="Counter payments" sub="Clover / AIB terminal">
            <div style={{ fontSize: 12.5, lineHeight: 1.55, color: "var(--body)" }}>Card payments at the counter go through the Clover / AIB terminal. That terminal is <b>not integrated</b> with Pulse. Staff mark the payment against the job, and it shows as <Badge tone="neutral">Paid · Clover</Badge>.</div>
            <Btn size="sm" style={{ marginTop: 12 }} onClick={() => store.go("Settings")}>View connected systems</Btn>
          </Card>
        </div>
      </Grid>
    </>
  );
}

/* ---------------- Exceptions ---------------- */
function Exceptions() {
  const open = PAYMENT_EXCEPTIONS.filter((e) => e.state === "Open").length;
  return (
    <>
      <Head title="Exceptions" sub={`${PAYMENT_EXCEPTIONS.length} exceptions this week, ${open} open. Everything else went straight through.`} />
      <Grid cols="minmax(0,1.3fr) minmax(0,1fr)">
        <div style={{ display: "grid", gap: 12, alignContent: "start" }}>
          {PAYMENT_EXCEPTIONS.slice().sort((a) => a.state === "Open" ? -1 : 1).map((e) => {
            const isOpen = e.state === "Open";
            return (
              <Card key={e.id} style={isOpen ? { borderColor: "var(--p-magenta-line)" } : undefined}>
                <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                  <Mono style={{ fontWeight: 600 }}>{e.id}</Mono><span style={{ fontWeight: 500 }}>{e.customer}</span>
                  <span style={{ flex: 1 }} />
                  <span style={{ fontSize: 12, color: "var(--faint)" }}>{e.when}</span>
                  <Badge tone={isOpen ? "magenta" : "ok"} dot>{e.state}</Badge>
                </div>
                <div style={{ fontSize: 13, color: "var(--body)", marginTop: 10, lineHeight: 1.5 }}>{e.issue}</div>
                <div style={{ marginTop: 12 }}>
                  <Flow compact tone={isOpen ? "magenta" : "ok"} active={isOpen ? 2 : 3} steps={isOpen ? ["Order received", "Check failed", "Held before job", "Customer emailed", "Job created"] : ["Payment failed", "Customer retried", "Paid", "Job created"]} />
                </div>
                {isOpen && <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
                  <Btn size="sm" kind="primary" icon={IC.mail} onClick={() => store.toast(`Reminder sent to ${e.customer} for a print-ready file`)}>Send reminder</Btn>
                  <Btn size="sm" onClick={() => store.toast(`${e.id} assigned to Emma Walsh`, "info")}>Assign to Emma</Btn>
                </div>}
              </Card>
            );
          })}
        </div>
        <Card title="How Pulse handles exceptions">
          {[
            ["Nothing half-made", "A problem order is held before a job or docket exists, so nothing reaches the artwork queue or a press."],
            ["Customer told first", "The customer gets a plain email explaining what is needed, with a link to fix it."],
            ["One owner", "Emma sees the exception here and on her task list. No inbox digging."],
            ["Resumes automatically", "Once paid or fixed, the job, docket and artwork check are created in the usual 2 minutes."],
          ].map(([h, t], i) => (
            <div key={h} style={{ display: "grid", gridTemplateColumns: "26px 1fr", gap: 10, padding: "10px 0", borderTop: i ? "1px solid var(--border)" : "none" }}>
              <span style={{ width: 22, height: 22, borderRadius: 7, background: "var(--p-cyan-soft)", color: "var(--p-cyan)", display: "flex", alignItems: "center", justifyContent: "center" }}><Icon d={IC.check} size={12} stroke={2.4} /></span>
              <div><div style={{ fontSize: 13, fontWeight: 600 }}>{h}</div><div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 2, lineHeight: 1.5 }}>{t}</div></div>
            </div>
          ))}
          <div style={{ marginTop: 10, padding: 12, borderRadius: 10, background: "var(--surface-2)", fontSize: 12.5 }}>
            <b>{ORDERS.length}</b> of {ORDERS.length + 1} orders this week went through with no exception.
          </div>
        </Card>
      </Grid>
    </>
  );
}
