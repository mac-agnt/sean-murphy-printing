import { useState } from "react";
import { useDemo, store, metrics } from "../../../demo/store";
import { CHANGE, type Job } from "../../../demo/data";
import { Card, Chips, Table, Badge, Mono, Money, Person, StageBadge, RiskBadge, JobLink, type Col } from "../../../demo/ui";
import { fmt } from "./shared";

type F = "all" | "artwork" | "production" | "rti" | "risk" | "online";

export default function Live() {
  const s = useDemo();
  const m = metrics(s);
  const [f, setF] = useState<F>("all");
  const test: Record<F, (j: Job) => boolean> = {
    all: () => true,
    artwork: (j) => j.stage === "Artwork" || j.stage === "Artwork Approval",
    production: (j) => j.stage === "Production" || j.stage === "Finishing",
    rti: (j) => j.stage === "Ready to Invoice",
    risk: (j) => j.risk === "risk",
    online: (j) => j.source === "Website",
  };
  const rows = m.live.filter(test[f]);
  const opts: { id: F; label: string }[] = [
    { id: "all", label: "All" }, { id: "artwork", label: "Artwork" }, { id: "production", label: "Production" },
    { id: "rti", label: "Ready to Invoice" }, { id: "risk", label: "At risk" }, { id: "online", label: "Online" },
  ];
  const total = rows.reduce((a, j) => a + j.value, 0);

  const cols: Col<Job>[] = [
    { key: "id", label: "Job", w: "92px", render: (j) => <JobLink id={j.id} onOpen={store.openJob} /> },
    { key: "c", label: "Customer", w: "minmax(170px,1.4fr)", render: (j) => (
      <div style={{ minWidth: 0 }}>
        <div style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.customer}</div>
        <div style={{ fontSize: 11.5, color: "var(--faint)" }}>{j.source === "Website" ? "Website · " + j.order : "PrintLogic · " + j.quote}</div>
      </div>) },
    { key: "p", label: "Product", w: "minmax(130px,1fr)", render: (j) => j.product },
    { key: "q", label: "Quantity", w: "90px", align: "right", render: (j) => <span style={{ fontVariantNumeric: "tabular-nums" }}>{fmt(j.qty)}</span> },
    { key: "s", label: "Stage", w: "minmax(150px,1fr)", render: (j) => (
      <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: "flex-start" }}>
        <StageBadge stage={j.stage} />
        <span style={{ fontSize: 11.5, color: j.id === CHANGE.jobId && s.changeState === "pending" ? "var(--p-magenta)" : "var(--faint)" }}>{j.status}</span>
      </div>) },
    { key: "o", label: "Owner", w: "96px", render: (j) => <Person id={j.owner} /> },
    { key: "d", label: "Due", w: "118px", render: (j) => <span style={{ color: j.dueDay === "Today" ? "var(--ink)" : "var(--dim)", whiteSpace: "nowrap" }}>{j.due}</span> },
    { key: "k", label: "Docket", w: "76px", render: (j) => (
      <button className="d-link" onClick={(e) => { e.stopPropagation(); store.openDocket(j.id); }}><Mono>V{j.docketV}</Mono></button>) },
    { key: "v", label: "Value", w: "84px", align: "right", render: (j) => <Money v={j.value} /> },
    { key: "r", label: "Risk", w: "100px", render: (j) => j.id === CHANGE.jobId && s.changeState === "pending" ? <Badge tone="magenta" dot>Change</Badge> : <RiskBadge risk={j.risk} /> },
  ];

  return (
    <Card pad={0} className="d-in">
      <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 16px", borderBottom: "1px solid var(--border)", flexWrap: "wrap" }}>
        <Chips options={opts.map((o) => ({ ...o, count: m.live.filter(test[o.id]).length }))} value={f} onChange={setF} />
        <div style={{ flex: 1 }} />
        <span style={{ fontSize: 12.5, color: "var(--dim)" }}>{rows.length} jobs · <Money v={total} style={{ color: "var(--ink)" }} /></span>
      </div>
      <Table cols={cols} rows={rows} rowKey={(j) => j.id} onRow={(j) => store.openJob(j.id)} empty="No live jobs match this filter." />
      <div style={{ padding: "10px 16px", fontSize: 11.5, color: "var(--faint)" }}>Jobs arrive from approved PrintLogic quotes and paid website orders. Click any row for the full record.</div>
    </Card>
  );
}
