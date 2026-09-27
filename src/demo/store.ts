/* Frontend-only demo store. Every print module (and the Pulse core pages via
   PulseLogic) reads from here, so approving a change or sending an invoice
   updates Jobs, Production, Finance, Home and Activity together. */
import { useSyncExternalStore } from "react";
import {
  JOBS, CHANGE, DOCKETS, EVENTS, ORDERS, FINANCE, EFFICIENCY,
  type Job, type DocketVersion, type ActEvent,
} from "./data";

export type DemoPage = "Jobs" | "Production" | "Online Orders" | "Customers" | "Finance";

export const SECTIONS: Record<DemoPage, { id: string; label: string }[]> = {
  Jobs: [
    { id: "overview", label: "Overview" }, { id: "live", label: "Live Jobs" }, { id: "dockets", label: "Dockets" },
    { id: "changes", label: "Changes" }, { id: "completed", label: "Completed" },
  ],
  Production: [
    { id: "overview", label: "Overview" }, { id: "artwork", label: "Artwork" }, { id: "queue", label: "Production Queue" },
    { id: "schedule", label: "Schedule" }, { id: "completed", label: "Completed" },
  ],
  "Online Orders": [
    { id: "overview", label: "Overview" }, { id: "orders", label: "Orders" }, { id: "products", label: "Products" },
    { id: "payments", label: "Payments" }, { id: "exceptions", label: "Exceptions" },
  ],
  Customers: [
    { id: "overview", label: "Overview" }, { id: "accounts", label: "Accounts" }, { id: "contacts", label: "Contacts" },
    { id: "history", label: "Job History" }, { id: "repeat", label: "Repeat Work" },
  ],
  Finance: [
    { id: "overview", label: "Overview" }, { id: "ready", label: "Ready to Invoice" }, { id: "invoices", label: "Invoices" },
    { id: "debtors", label: "Debtors" }, { id: "revenue", label: "Revenue" },
  ],
};
export const DEMO_PAGES = Object.keys(SECTIONS) as DemoPage[];

export type ChangeState = "pending" | "approved" | "rejected";

export type DemoState = {
  jobs: Job[];
  changeState: ChangeState;
  dockets: Record<string, DocketVersion[]>;
  events: ActEvent[];
  /** Job ids whose invoice has been pushed to Big Red Cloud. */
  synced: string[];
  syncing: string | null;
  section: Record<DemoPage, string>;
  /** Open job detail (Jobs page) or null for the section view. */
  jobId: string | null;
  /** Open docket (Jobs → Dockets) and version shown. */
  docket: { jobId: string; v: number } | null;
  customerId: string | null;
  orderId: string | null;
  toast: { text: string; tone: "ok" | "info" } | null;
  /** Flash highlight for rows that just changed. */
  flash: string[];
};

const initial = (): DemoState => ({
  jobs: JOBS.map((j) => ({ ...j, specs: { ...j.specs } })),
  changeState: "pending",
  dockets: JSON.parse(JSON.stringify(DOCKETS)),
  events: EVENTS.slice(),
  synced: [],
  syncing: null,
  section: { Jobs: "overview", Production: "overview", "Online Orders": "overview", Customers: "overview", Finance: "overview" },
  jobId: null,
  docket: null,
  customerId: null,
  orderId: null,
  toast: null,
  flash: [],
});

let state = initial();
const subs = new Set<() => void>();
const emit = () => subs.forEach((f) => f());
const set = (patch: Partial<DemoState> | ((s: DemoState) => Partial<DemoState>)) => {
  state = { ...state, ...(typeof patch === "function" ? patch(state) : patch) };
  emit();
};

let navigator: ((page: string) => void) | null = null;
let toastTimer: ReturnType<typeof setTimeout> | undefined;
let flashTimer: ReturnType<typeof setTimeout> | undefined;

const clock = () => {
  const d = new Date();
  return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
};

export const store = {
  get: () => state,
  subscribe(fn: () => void) { subs.add(fn); return () => { subs.delete(fn); }; },
  /** PulseLogic registers its page router here. */
  setNavigator(fn: (page: string) => void) { navigator = fn; },

  go(page: string, section?: string, extra?: Partial<DemoState>) {
    if (section && (DEMO_PAGES as string[]).includes(page)) {
      set((s) => ({ section: { ...s.section, [page as DemoPage]: section }, ...(extra || {}) }));
    } else if (extra) set(extra);
    navigator?.(page);
  },
  setSection(page: DemoPage, id: string) {
    set((s) => ({
      section: { ...s.section, [page]: id },
      ...(page === "Jobs" ? { jobId: null, docket: null } : {}),
      ...(page === "Customers" ? { customerId: null } : {}),
      ...(page === "Online Orders" ? { orderId: null } : {}),
    }));
  },
  openJob(id: string) { store.go("Jobs", "live", { jobId: id, docket: null }); },
  closeJob() { set({ jobId: null }); },
  openDocket(jobId: string, v?: number) {
    const j = state.jobs.find((x) => x.id === jobId);
    store.go("Jobs", "dockets", { jobId: null, docket: { jobId, v: v ?? j?.docketV ?? 1 } });
  },
  setDocketVersion(v: number) { if (state.docket) set({ docket: { ...state.docket, v } }); },
  closeDocket() { set({ docket: null }); },
  openCustomer(id: string) { store.go("Customers", "accounts", { customerId: id }); },
  closeCustomer() { set({ customerId: null }); },
  openOrder(id: string) { store.go("Online Orders", "orders", { orderId: id }); },
  closeOrder() { set({ orderId: null }); },
  openChange() { store.go("Jobs", "changes", { jobId: null, docket: null }); },

  toast(text: string, tone: "ok" | "info" = "ok") {
    set({ toast: { text, tone } });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => set({ toast: null }), 3600);
  },
  flash(ids: string[]) {
    set({ flash: ids });
    clearTimeout(flashTimer);
    flashTimer = setTimeout(() => set({ flash: [] }), 2600);
  },
  log(e: Omit<ActEvent, "t"> & { t?: string }) {
    set((s) => ({ events: s.events.concat([{ t: e.t || clock(), ...e } as ActEvent]) }));
  },

  /** CR-118: approve the Byrne & Co change. Docket V2 → superseded, V3 current. */
  approveChange() {
    if (state.changeState !== "pending") return;
    const t = clock();
    set((s) => {
      const versions: DocketVersion[] = (s.dockets[CHANGE.jobId] || []).map((d) => ({ ...d, status: "Superseded" as const }));
      versions.push({ v: 3, created: "Today " + t, by: "Docket Agent", reason: "CR-118 approved: 2,000 cards, 5 names", qty: CHANGE.newQty, names: CHANGE.newNames, status: "Current" });
      return {
        changeState: "approved",
        dockets: { ...s.dockets, [CHANGE.jobId]: versions },
        jobs: s.jobs.map((j) => j.id !== CHANGE.jobId ? j : {
          ...j, qty: CHANGE.newQty, docketV: 3, value: CHANGE.valueAfter, status: "Revision in progress", risk: "watch",
          specs: { ...j.specs, names: CHANGE.newNames },
        }),
        events: s.events.concat([
          { t, kind: "person", who: "Sean Murphy", text: "Sean approved change CR-118 for J-10482.", jobId: CHANGE.jobId },
          { t, kind: "agent", who: "Docket Agent", text: "Docket V3 generated for J-10482 (2,000 cards, 5 names).", jobId: CHANGE.jobId },
          { t, kind: "agent", who: "Docket Agent", text: "Docket V2 marked superseded. Printed copies flagged via QR.", jobId: CHANGE.jobId },
          { t, kind: "agent", who: "Change Control", text: "Sarah Byrne assigned artwork revision on J-10482.", jobId: CHANGE.jobId },
          { t, kind: "agent", who: "Production Agent", text: "Production queue updated: J-10482 re-slotted on Digital Press 1.", jobId: CHANGE.jobId },
          { t, kind: "system", who: "PrintLogic", src: "PrintLogic", text: "Revised quote Q-2487-R1 (€475) written back to PrintLogic.", jobId: CHANGE.jobId },
        ]),
      };
    });
    store.flash([CHANGE.jobId]);
    store.toast("CR-118 approved · Docket V3 is now current · Sarah notified");
  },
  rejectChange() {
    if (state.changeState !== "pending") return;
    const t = clock();
    set((s) => ({
      changeState: "rejected",
      jobs: s.jobs.map((j) => j.id !== CHANGE.jobId ? j : { ...j, status: "Designing", risk: "ok" }),
      events: s.events.concat([
        { t, kind: "person", who: "Sean Murphy", text: "Sean rejected change CR-118. J-10482 continues at 1,000 cards, 2 names.", jobId: CHANGE.jobId },
        { t, kind: "agent", who: "Change Control", text: "Reply drafted to Claire Byrne for Emma Walsh to review.", jobId: CHANGE.jobId },
      ]),
    }));
    store.toast("CR-118 rejected · work resumed on Docket V2", "info");
  },
  resetChange() {
    set((s) => ({
      changeState: "pending",
      dockets: { ...s.dockets, [CHANGE.jobId]: JSON.parse(JSON.stringify(DOCKETS[CHANGE.jobId])) },
      jobs: s.jobs.map((j) => j.id !== CHANGE.jobId ? j : { ...JOBS.find((x) => x.id === CHANGE.jobId)!, specs: { ...JOBS.find((x) => x.id === CHANGE.jobId)!.specs } }),
    }));
  },

  /** Push a ready-to-invoice job to Big Red Cloud. */
  sendInvoice(jobId: string) {
    const j = state.jobs.find((x) => x.id === jobId);
    if (!j || state.synced.includes(jobId) || state.syncing) return;
    set({ syncing: jobId });
    setTimeout(() => {
      const t = clock();
      set((s) => ({
        syncing: null,
        synced: s.synced.concat([jobId]),
        jobs: s.jobs.map((x) => x.id !== jobId ? x : { ...x, stage: "Invoiced", status: "Invoice synced" }),
        events: s.events.concat([
          { t, kind: "person", who: "Sean Murphy", text: `Sean approved invoice for ${jobId} (${j.customer}).`, jobId },
          { t, kind: "system", who: "Big Red Cloud", src: "Big Red Cloud", text: `Big Red Cloud invoice sync completed for ${jobId} (€${j.value.toLocaleString("en-IE")}).`, jobId },
        ]),
      }));
      store.flash([jobId]);
      store.toast(`${jobId} synced to Big Red Cloud · no re-keying`);
    }, 1100);
  },

  reset() { state = initial(); emit(); },
};

/* ---------- Derived numbers (single place so every screen agrees) ---------- */
export const LIVE_STAGES = ["Artwork", "Artwork Approval", "Production", "Finishing", "Ready", "Dispatched", "Ready to Invoice"];

export function metrics(s: DemoState = state) {
  const live = s.jobs.filter((j) => LIVE_STAGES.includes(j.stage));
  const artwork = live.filter((j) => j.stage === "Artwork" || j.stage === "Artwork Approval");
  const production = live.filter((j) => j.stage === "Production" || j.stage === "Finishing");
  const rti = live.filter((j) => j.stage === "Ready to Invoice");
  const attention = live.filter((j) => j.risk === "risk");
  return {
    live, artwork, production, rti, attention,
    liveCount: live.length,
    liveValue: live.reduce((a, j) => a + j.value, 0),
    rtiValue: rti.reduce((a, j) => a + j.value, 0),
    dueToday: live.filter((j) => j.dueDay === "Today" && j.stage !== "Ready to Invoice").length,
    changesPending: s.changeState === "pending" ? 1 : 0,
    onlineCount: ORDERS.length,
    onlineRevenue: ORDERS.reduce((a, o) => a + o.amount, 0),
    finance: FINANCE,
    efficiency: EFFICIENCY,
  };
}

export function useDemo(): DemoState {
  return useSyncExternalStore(store.subscribe, store.get, store.get);
}
