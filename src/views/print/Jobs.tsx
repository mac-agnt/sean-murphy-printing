import { useDemo, metrics } from "../../demo/store";
import { COMPANY } from "../../demo/config";
import { Page, Head } from "../../demo/ui";
import Overview from "./jobs/Overview";
import Live from "./jobs/Live";
import Detail from "./jobs/Detail";
import Dockets from "./jobs/Dockets";
import Changes from "./jobs/Changes";
import Completed from "./jobs/Completed";

const HEADS: Record<string, { title: string; sub: string }> = {
  overview: { title: "Jobs", sub: "Every job in the building, from approved quote to invoice, on one live record." },
  live: { title: "Live Jobs", sub: "All live work across artwork, production and finishing. Click a job for its full record." },
  dockets: { title: "Dockets", sub: "Digital dockets with printable copies. Versions are tracked, superseded copies are caught by QR." },
  changes: { title: "Change Control", sub: "Customer changes detected, compared, paused and approved before anyone prints the wrong thing." },
  completed: { title: "Completed", sub: "Finished work this week and where each job sits on the way to Big Red Cloud." },
};

export default function Jobs() {
  const s = useDemo();
  const sec = s.section.Jobs || "overview";
  if (sec === "live" && s.jobId) return <Page><Detail id={s.jobId} /></Page>;
  if (sec === "dockets" && s.docket) return <Page><Dockets /></Page>;
  const h = HEADS[sec] || HEADS.overview;
  const m = metrics(s);
  const sub = sec === "overview" ? `${m.liveCount} live jobs at ${COMPANY.name}. ${h.sub}` : h.sub;
  return (
    <Page>
      <Head title={h.title} sub={sub} />
      {sec === "overview" && <Overview />}
      {sec === "live" && <Live />}
      {sec === "dockets" && <Dockets />}
      {sec === "changes" && <Changes />}
      {sec === "completed" && <Completed />}
    </Page>
  );
}
