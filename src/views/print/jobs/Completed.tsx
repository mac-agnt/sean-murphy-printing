import { useDemo, store } from "../../../demo/store";
import { INVOICES, fmtEUR } from "../../../demo/data";
import { Card, Grid, Badge, Btn, Mono, Money, JobLink, Table, IC, type Col } from "../../../demo/ui";
import { fmt } from "./shared";

type R = { id: string; customer: string; product: string; qty?: number; completed: string; value: number; state: "rti" | "synced" | "invoiced"; inv?: string; docket: string };

export default function Completed() {
  const s = useDemo();
  const done = s.jobs.filter((j) => j.stage === "Ready to Invoice" || j.stage === "Invoiced");
  const rows: R[] = [
    ...done.map((j) => ({ id: j.id, customer: j.customer, product: j.product, qty: j.qty, completed: j.completed || j.due, value: j.value, state: (s.synced.includes(j.id) ? "synced" : "rti") as R["state"], docket: `V${j.docketV} closed` })),
    ...INVOICES.slice(0, 4).map((i) => ({ id: i.jobId, customer: i.customer, product: "Invoiced", completed: i.issued, value: i.amount, state: "invoiced" as const, inv: i.id + " · " + i.status, docket: "Closed" })),
  ];
  const rtiVal = rows.filter((r) => r.state === "rti").reduce((a, r) => a + r.value, 0);
  const cols: Col<R>[] = [
    { key: "j", label: "Job", w: "92px", render: (r) => r.state === "invoiced" ? <Mono>{r.id}</Mono> : <JobLink id={r.id} onOpen={store.openJob} /> },
    { key: "c", label: "Customer", w: "minmax(170px,1.3fr)", render: (r) => r.customer },
    { key: "p", label: "Product", w: "minmax(150px,1fr)", render: (r) => <span style={{ color: "var(--dim)" }}>{r.state === "invoiced" ? "Completed last week" : `${r.product} · ${fmt(r.qty || 0)}`}</span> },
    { key: "t", label: "Completed", w: "130px", render: (r) => <span style={{ fontSize: 12.5 }}>{r.completed}</span> },
    { key: "d", label: "Docket", w: "100px", render: (r) => <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{r.docket}</span> },
    { key: "v", label: "Value", w: "84px", align: "right", render: (r) => <Money v={r.value} /> },
    { key: "i", label: "Invoice", w: "minmax(190px,1.2fr)", render: (r) => r.state === "rti"
      ? <span style={{ display: "flex", gap: 8, alignItems: "center" }}><Badge tone="yellow" dot>Ready to invoice</Badge><button className="d-link" style={{ fontSize: 12 }} onClick={(e) => { e.stopPropagation(); store.go("Finance", "ready"); }}>Finance</button></span>
      : r.state === "synced" ? <Badge tone="ok">Synced to Big Red Cloud</Badge>
      : <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{r.inv}</span> },
  ];
  return (
    <div className="d-in" style={{ display: "grid", gap: 14 }}>
      <Grid cols="minmax(0,1fr) minmax(0,1fr) minmax(0,1.4fr)">
        <Card pad={18}><div style={{ fontSize: 11.5, color: "var(--faint)" }}>Completed today</div><div style={{ fontSize: 30, fontWeight: 600, marginTop: 6 }}>7</div><div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>Dockets closed by QC scan</div></Card>
        <Card pad={18}><div style={{ fontSize: 11.5, color: "var(--faint)" }}>Waiting to invoice</div><div style={{ fontSize: 30, fontWeight: 600, marginTop: 6, color: "var(--p-yellow)" }}>{fmtEUR(rtiVal)}</div><div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>{rows.filter((r) => r.state === "rti").length} jobs, nothing to retype</div></Card>
        <Card pad={18}>
          <div style={{ fontSize: 13.5, fontWeight: 600 }}>Completed → Ready to invoice → Big Red Cloud</div>
          <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 6, lineHeight: 1.5 }}>Finished jobs carry their final specs and value straight to Finance. Approve once and the invoice lands in Big Red Cloud.</div>
          <Btn size="sm" kind="primary" icon={IC.finance} style={{ marginTop: 12 }} onClick={() => store.go("Finance", "ready")}>Review in Finance</Btn>
        </Card>
      </Grid>
      <Card pad={0} title={<span style={{ padding: "0 0 0 18px" }}>Completed this week</span>} style={{ paddingTop: 16 }}>
        <Table cols={cols} rows={rows} rowKey={(r) => r.id} onRow={(r) => r.state !== "invoiced" ? store.openJob(r.id) : store.go("Finance", "invoices")} />
      </Card>
    </div>
  );
}
