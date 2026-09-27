import { Fragment } from "react";
import { useDemo, store, metrics } from "../../../demo/store";
import { CHANGE, staff } from "../../../demo/data";
import { Card, Grid, Stat, Badge, Icon, IC, Mono, Money, DemoTag, StageBadge, Avatar, Btn } from "../../../demo/ui";

export default function Overview() {
  const s = useDemo();
  const m = metrics(s);
  const finishing = m.live.filter((j) => j.stage === "Finishing").length;
  const funnel = [
    { k: "Quote Approved", v: 8, tone: "var(--dim)", note: "In PrintLogic" },
    { k: "Artwork", v: m.artwork.length, tone: "var(--p-magenta)", note: "Incl. proofing" },
    { k: "Production", v: m.production.length, tone: "var(--p-cyan)", note: "On press + finishing" },
    { k: "Finishing", v: finishing, tone: "var(--p-cyan)", note: "Guillotine, fold, glue" },
    { k: "Ready", v: m.rti.length, tone: "var(--p-yellow)", note: "To invoice" },
  ];
  const max = Math.max(...funnel.map((f) => f.v));
  const watch = m.live.filter((j) => j.risk !== "ok").sort((a, b) => (a.risk === "risk" ? -1 : 1) - (b.risk === "risk" ? -1 : 1));
  const today = m.live.filter((j) => j.dueDay === "Today" && j.stage !== "Ready to Invoice").sort((a, b) => a.due.localeCompare(b.due));
  const chain = ["Quote", "Job", "Docket", "Artwork", "Production", "Invoice"];

  return (
    <div className="d-in" style={{ display: "grid", gap: 14 }}>
      <Grid min={150}>
        <Stat label="Live Jobs" value={m.liveCount} note={<Money v={m.liveValue} />} onClick={() => store.setSection("Jobs", "live")} />
        <Stat label="Due Today" value={m.dueToday} note="Next: J-10481 at 12:00" onClick={() => store.setSection("Jobs", "live")} />
        <Stat label="At Risk" value={m.attention.length} tone={m.attention.length ? "bad" : undefined} note="Watchdog flagged" />
        <Stat label="Changes Pending" value={m.changesPending} tone={m.changesPending ? "magenta" : undefined} note={m.changesPending ? "CR-118 awaiting Sean" : "All changes resolved"} onClick={() => store.openChange()} />
        <Stat label="Completed Today" value={7} note="Across all resources" onClick={() => store.setSection("Jobs", "completed")} />
        <Stat label="Ready for Invoice" value={m.rti.length} tone="yellow" note={<Money v={m.rtiValue} />} onClick={() => store.go("Finance", "ready")} />
      </Grid>

      <Grid cols="minmax(0,1.5fr) minmax(0,1fr)">
        <Card title="Workflow" sub="Where the 17 live jobs sit right now, plus approved quotes about to arrive from PrintLogic.">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, alignItems: "end", height: 170 }}>
            {funnel.map((f) => (
              <div key={f.k} style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", height: "100%" }}>
                <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-1px", fontVariantNumeric: "tabular-nums" }}>{f.v}</div>
                <div style={{ height: `${(f.v / max) * 110}px`, minHeight: 6, marginTop: 6, borderRadius: "8px 8px 3px 3px", background: `linear-gradient(180deg, ${f.tone}, transparent 140%)`, opacity: .85, transition: "height .5s var(--ease)" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 8, marginTop: 10, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
            {funnel.map((f, i) => (
              <div key={f.k} style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12.5, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>{f.k}{i < funnel.length - 1 && <Icon d={IC.arrow} size={11} style={{ color: "var(--faint)" }} />}</div>
                <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>{f.note}</div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="One job, one record, zero re-keying" action={<DemoTag />} sub="Every stage reads and writes the same live job. Nothing is typed twice.">
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
            {chain.map((c, i) => (
              <Fragment key={c}>
                <span style={{ padding: "6px 11px", borderRadius: 999, fontSize: 12, background: i === 2 ? "var(--p-cyan-soft)" : "var(--surface-2)", border: "1px solid " + (i === 2 ? "var(--p-cyan-line)" : "var(--border)"), color: i === 2 ? "var(--p-cyan)" : "var(--body)" }}>{c}</span>
                {i < chain.length - 1 && <Icon d={IC.arrow} size={12} style={{ color: "var(--faint)" }} />}
              </Fragment>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 18 }}>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px" }}>{m.efficiency.duplicatesAvoided}</div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>duplicate entries prevented this week</div>
            </div>
            <div style={{ padding: 14, borderRadius: 12, background: "var(--surface-2)" }}>
              <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-1px" }}>{m.efficiency.hoursSaved} <span style={{ fontSize: 15, color: "var(--dim)" }}>hrs</span></div>
              <div style={{ fontSize: 12, color: "var(--dim)", marginTop: 4 }}>admin time saved this week</div>
            </div>
          </div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 12, lineHeight: 1.5 }}>PrintLogic stays the quoting source. Big Red Cloud stays the ledger. Pulse carries the job between them.</div>
        </Card>
      </Grid>

      <Grid cols="minmax(0,1fr) minmax(0,1fr)">
        <Card title="Needs attention" sub="Flagged by Ops Watchdog and Change Control" pad={0} style={{ paddingTop: 18 }}>
          <div style={{ padding: "0 20px 8px" }}>
            {watch.map((j) => {
              const cr = j.id === CHANGE.jobId && s.changeState === "pending";
              return (
                <div key={j.id} className="d-row click" onClick={() => store.openJob(j.id)} style={{ display: "grid", gridTemplateColumns: "4px 1fr auto", gap: 12, padding: "12px 8px", margin: "0 -8px", borderRadius: 10, alignItems: "center" }}>
                  <span style={{ alignSelf: "stretch", borderRadius: 4, background: j.risk === "risk" ? (cr ? "var(--p-magenta)" : "var(--bad)") : "var(--warn)" }} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}><Mono style={{ fontWeight: 600 }}>{j.id}</Mono><span style={{ fontSize: 13 }}>{j.customer}</span></div>
                    <div style={{ fontSize: 12.5, color: "var(--dim)", marginTop: 3 }}>
                      {cr ? "Customer asked for 2,000 cards / 5 names. Artwork paused pending your approval."
                        : j.id === "J-10470" ? "Awaiting artwork from customer for 2 days. Tomorrow's 09:00 slot at risk."
                        : j.id === "J-10482" ? "Change approved. Artwork revision V3 in progress with Sarah."
                        : j.notes || `${j.product}, due ${j.due}.`}
                    </div>
                  </div>
                  {cr ? <Badge tone="magenta" dot>Approval</Badge> : j.risk === "risk" ? <Badge tone="bad">At risk</Badge> : <Badge tone="warn">Watch</Badge>}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="Due today" sub={`${today.length} jobs leave the building today`} pad={0} style={{ paddingTop: 18 }} action={<div style={{ paddingRight: 20 }}><Btn size="sm" onClick={() => store.go("Production", "schedule")}>Schedule</Btn></div>}>
          <div style={{ padding: "0 20px 8px" }}>
            {today.map((j) => (
              <div key={j.id} className="d-row click" onClick={() => store.openJob(j.id)} style={{ display: "grid", gridTemplateColumns: "52px 1fr auto 24px", gap: 12, padding: "10px 8px", margin: "0 -8px", borderRadius: 10, alignItems: "center" }}>
                <Mono style={{ color: "var(--ink)", fontWeight: 600 }}>{j.due.replace("Today ", "")}</Mono>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{j.customer}</div>
                  <div style={{ fontSize: 11.5, color: "var(--faint)" }}><Mono style={{ fontSize: 11 }}>{j.id}</Mono> · {j.product} · {j.qty.toLocaleString("en-IE")}</div>
                </div>
                <StageBadge stage={j.stage} />
                <span title={staff(j.owner).name}><Avatar id={j.owner} size={22} /></span>
              </div>
            ))}
          </div>
        </Card>
      </Grid>
    </div>
  );
}
