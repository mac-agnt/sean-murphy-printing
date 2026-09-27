/* Murphy Print demo data. One source of truth: every module reads from here
   (through the store), so a job number, value or name never disagrees between
   screens. All figures are demo data. */

export type Stage =
  | "Quote" | "Approved" | "Artwork" | "Artwork Approval" | "Production"
  | "Finishing" | "Ready" | "Dispatched" | "Ready to Invoice" | "Invoiced";

export type Risk = "ok" | "watch" | "risk";

export type Staff = { id: string; name: string; first: string; initials: string; role: string; tint: string; real?: boolean };

export const STAFF: Staff[] = [
  { id: "sean", name: "Sean Murphy", first: "Sean", initials: "SM", role: "Owner / Managing Director", tint: "#6fcfe4", real: true },
  { id: "sarah", name: "Sarah Byrne", first: "Sarah", initials: "SB", role: "Artwork", tint: "#e07aa8" },
  { id: "liam", name: "Liam O'Connor", first: "Liam", initials: "LO", role: "Production", tint: "#e7c35a" },
  { id: "niall", name: "Niall Doyle", first: "Niall", initials: "ND", role: "Print Operator", tint: "#8fd6a8" },
  { id: "emma", name: "Emma Walsh", first: "Emma", initials: "EW", role: "Customer Service", tint: "#b5a6f0" },
  { id: "aoife", name: "Aoife Kelly", first: "Aoife", initials: "AK", role: "Accounts", tint: "#f0a878" },
  { id: "jack", name: "Jack Brennan", first: "Jack", initials: "JB", role: "Finishing / Dispatch", tint: "#9fc2e8" },
];
export const staff = (id: string) => STAFF.find((s) => s.id === id) || STAFF[0];

export type Resource = "Digital Press 1" | "Digital Press 2" | "Large Format" | "Finishing" | "Guillotine";
export const RESOURCES: Resource[] = ["Digital Press 1", "Digital Press 2", "Large Format", "Finishing", "Guillotine"];

export type Specs = {
  size: string; stock: string; print: string; finish: string;
  names?: number; pages?: string; packaging: string; delivery: string;
};

export type Job = {
  id: string;
  customerId: string;
  customer: string;
  contact: string;
  product: string;
  qty: number;
  stage: Stage;
  /** Finer status inside the stage (artwork status, press state, etc.). */
  status: string;
  owner: string; // staff id
  due: string; // display
  dueDay: "Today" | "Tomorrow" | "This week" | "Next week";
  docketV: number;
  value: number;
  risk: Risk;
  source: "PrintLogic" | "Website";
  quote?: string;
  order?: string;
  paid: "Account" | "Paid · Stripe" | "Paid · Clover" | "Due on collection";
  resource?: Resource;
  /** Production board column. */
  board?: "Ready" | "Printing" | "Finishing" | "QC" | "Done";
  specs: Specs;
  completed?: string;
  notes?: string;
};

const cards = (names: number): Specs => ({ size: "85 × 55 mm", stock: "400gsm silk", print: "Double-sided colour", finish: "Matt laminate", names, packaging: "Boxed per name", delivery: "Collection" });

/* 17 live jobs: 6 in artwork, 7 in production, 4 ready to invoice. Live value €12,840. */
export const JOBS: Job[] = [
  // ARTWORK (6)
  { id: "J-10482", customerId: "byrne", customer: "Byrne & Co Solicitors", contact: "Claire Byrne", product: "Business Cards", qty: 1000, stage: "Artwork", status: "Change Requested", owner: "sarah", due: "Thu 1 Oct", dueDay: "This week", docketV: 2, value: 210, risk: "risk", source: "PrintLogic", quote: "Q-2487", paid: "Account", resource: "Digital Press 1", specs: cards(2), notes: "Match previous Byrne & Co card layout. Logo in PMS 541 converted to CMYK." },
  { id: "J-10470", customerId: "dental", customer: "Dublin Dental Centre", contact: "Dr. Ruth Keane", product: "Appointment Cards", qty: 10000, stage: "Artwork", status: "Awaiting Files", owner: "sarah", due: "Tomorrow 09:00", dueDay: "Tomorrow", docketV: 1, value: 780, risk: "risk", source: "PrintLogic", quote: "Q-2471", paid: "Account", resource: "Digital Press 2", specs: { size: "85 × 55 mm", stock: "350gsm uncoated", print: "Double-sided colour", finish: "None (writable reverse)", packaging: "Boxed in 500s", delivery: "Courier" } },
  { id: "J-10486", customerId: "greenline", customer: "Greenline Café", contact: "Tomás Ryan", product: "Folded Menus", qty: 500, stage: "Artwork", status: "Designing", owner: "sarah", due: "Fri 2 Oct", dueDay: "This week", docketV: 1, value: 428, risk: "ok", source: "Website", order: "O-8046", paid: "Paid · Stripe", resource: "Digital Press 2", specs: { size: "A4 folded to A5", stock: "300gsm silk", print: "Double-sided colour", finish: "Gloss laminate, scored and folded", packaging: "Shrink-wrapped in 50s", delivery: "Courier" } },
  { id: "J-10484", customerId: "harbourview", customer: "Harbour View Hotel", contact: "Niamh Costello", product: "Brochures", qty: 250, stage: "Artwork Approval", status: "Proof Sent", owner: "sarah", due: "Mon 5 Oct", dueDay: "Next week", docketV: 1, value: 1120, risk: "ok", source: "PrintLogic", quote: "Q-2482", paid: "Account", resource: "Digital Press 1", specs: { size: "A4", stock: "170gsm silk, 300gsm cover", print: "Full colour throughout", finish: "Saddle stitched, soft-touch cover", pages: "16pp + cover", packaging: "Boxed in 50s", delivery: "Van delivery" } },
  { id: "J-10487", customerId: "kavanagh", customer: "Kavanagh Physio", contact: "Eoin Kavanagh", product: "A5 Flyers", qty: 2500, stage: "Artwork", status: "Customer Review", owner: "sarah", due: "Fri 2 Oct", dueDay: "This week", docketV: 1, value: 240, risk: "ok", source: "Website", order: "O-8045", paid: "Paid · Stripe", resource: "Digital Press 2", specs: { size: "A5", stock: "170gsm gloss", print: "Double-sided colour", finish: "None", packaging: "Boxed", delivery: "Collection" } },
  { id: "J-10488", customerId: "castle", customer: "Castle Events", contact: "Dara Quinn", product: "A2 Posters", qty: 150, stage: "Artwork", status: "Approved", owner: "sarah", due: "Tomorrow 10:00", dueDay: "Tomorrow", docketV: 1, value: 610, risk: "watch", source: "PrintLogic", quote: "Q-2490", paid: "Account", resource: "Large Format", specs: { size: "A2", stock: "200gsm satin poster", print: "Single-sided colour", finish: "None", packaging: "Rolled in tubes of 25", delivery: "Collection" }, notes: "Rush job. Customer asked for tomorrow 10:00." },
  // PRODUCTION (7)
  { id: "J-10479", customerId: "nova", customer: "Nova Electrical", contact: "Brian Nolan", product: "A5 Flyers", qty: 5000, stage: "Production", status: "Printing", owner: "niall", due: "Today 16:00", dueDay: "Today", docketV: 1, value: 865, risk: "watch", source: "PrintLogic", quote: "Q-2479", paid: "Account", resource: "Digital Press 1", board: "Printing", specs: { size: "A5", stock: "170gsm gloss", print: "Double-sided colour", finish: "None", packaging: "Boxed in 1,000s", delivery: "Collection" } },
  { id: "J-10474", customerId: "oakfield", customer: "Oakfield Primary School", contact: "Máire Hogan", product: "Booklets", qty: 300, stage: "Production", status: "Ready for press", owner: "liam", due: "Today 17:00", dueDay: "Today", docketV: 1, value: 690, risk: "ok", source: "PrintLogic", quote: "Q-2474", paid: "Account", resource: "Digital Press 2", board: "Ready", specs: { size: "A5", stock: "130gsm silk", print: "Full colour throughout", finish: "Saddle stitched", pages: "24pp self cover", packaging: "Boxed in 50s", delivery: "Van delivery" } },
  { id: "J-10476", customerId: "fitzgerald", customer: "Fitzgerald Auctioneers", contact: "Paul Fitzgerald", product: "Brochures", qty: 500, stage: "Production", status: "Printing", owner: "niall", due: "Today 15:00", dueDay: "Today", docketV: 2, value: 980, risk: "ok", source: "PrintLogic", quote: "Q-2476", paid: "Account", resource: "Digital Press 2", board: "Printing", specs: { size: "A4", stock: "150gsm silk, 350gsm cover", print: "Full colour throughout", finish: "Saddle stitched, matt laminate cover", pages: "8pp + cover", packaging: "Boxed in 100s", delivery: "Van delivery" } },
  { id: "J-10477", customerId: "corrib", customer: "Corrib Pharmacy", contact: "Sinéad Walsh", product: "Folded Leaflets", qty: 5000, stage: "Production", status: "Quality check", owner: "liam", due: "Today 14:00", dueDay: "Today", docketV: 1, value: 420, risk: "ok", source: "PrintLogic", quote: "Q-2477", paid: "Account", resource: "Guillotine", board: "QC", specs: { size: "DL (A4 tri-fold)", stock: "130gsm gloss", print: "Double-sided colour", finish: "Folded", packaging: "Boxed in 500s", delivery: "Courier" } },
  { id: "J-10480", customerId: "liffey", customer: "Liffey Credit Union", contact: "Declan Moore", product: "Letterheads", qty: 2000, stage: "Production", status: "Ready for press", owner: "liam", due: "Today 17:30", dueDay: "Today", docketV: 1, value: 360, risk: "ok", source: "PrintLogic", quote: "Q-2480", paid: "Account", resource: "Digital Press 1", board: "Ready", specs: { size: "A4", stock: "120gsm conqueror laid", print: "Single-sided colour", finish: "None", packaging: "Reams of 500", delivery: "Van delivery" } },
  { id: "J-10481", customerId: "mill", customer: "The Mill Theatre", contact: "Aisling Byrne", product: "A3 Posters", qty: 300, stage: "Finishing", status: "Trimming", owner: "jack", due: "Today 12:00", dueDay: "Today", docketV: 1, value: 395, risk: "ok", source: "PrintLogic", quote: "Q-2481", paid: "Account", resource: "Guillotine", board: "Finishing", specs: { size: "A3", stock: "170gsm silk", print: "Single-sided colour", finish: "Trimmed to bleed", packaging: "Flat packed", delivery: "Collection" } },
  { id: "J-10483", customerId: "hartley", customer: "Hartley Accountants", contact: "Gráinne Hartley", product: "Presentation Folders", qty: 250, stage: "Finishing", status: "Folding and gluing", owner: "jack", due: "Tomorrow 16:00", dueDay: "Tomorrow", docketV: 1, value: 872, risk: "ok", source: "PrintLogic", quote: "Q-2483", paid: "Account", resource: "Finishing", board: "Finishing", specs: { size: "A4 with 150mm pocket", stock: "350gsm silk", print: "Single-sided colour", finish: "Matt laminate, die cut, glued", packaging: "Boxed in 50s", delivery: "Van delivery" } },
  // READY TO INVOICE (4) = €4,870
  { id: "J-10473", customerId: "summit", customer: "Summit Property Partners", contact: "Rob Kiernan", product: "Presentation Folders", qty: 500, stage: "Ready to Invoice", status: "Completed today", owner: "aoife", due: "Today", dueDay: "Today", docketV: 1, value: 1640, risk: "ok", source: "PrintLogic", quote: "Q-2473", paid: "Account", resource: "Finishing", board: "Done", completed: "Today 13:03", specs: { size: "A4 with 150mm pocket", stock: "400gsm silk", print: "Double-sided colour", finish: "Soft-touch laminate, spot UV, die cut", packaging: "Boxed in 50s", delivery: "Van delivery" } },
  { id: "J-10468", customerId: "lennon", customer: "Lennon Architects", contact: "Ciara Lennon", product: "Brochures", qty: 200, stage: "Ready to Invoice", status: "Dispatched", owner: "aoife", due: "Yesterday", dueDay: "Today", docketV: 1, value: 1180, risk: "ok", source: "PrintLogic", quote: "Q-2468", paid: "Account", resource: "Digital Press 1", board: "Done", completed: "Yesterday 16:40", specs: { size: "A4 landscape", stock: "170gsm silk, 350gsm cover", print: "Full colour throughout", finish: "Perfect bound", pages: "32pp + cover", packaging: "Boxed", delivery: "Van delivery" } },
  { id: "J-10471", customerId: "brightside", customer: "Brightside Dental Group", contact: "Karen Doyle", product: "Presentation Folders", qty: 400, stage: "Ready to Invoice", status: "Collected", owner: "aoife", due: "Yesterday", dueDay: "Today", docketV: 1, value: 1250, risk: "ok", source: "PrintLogic", quote: "Q-2470", paid: "Account", resource: "Finishing", board: "Done", completed: "Yesterday 11:15", specs: { size: "A4 with 150mm pocket", stock: "350gsm silk", print: "Single-sided colour", finish: "Matt laminate, die cut", packaging: "Boxed in 50s", delivery: "Collection" } },
  { id: "J-10475", customerId: "wexford", customer: "Wexford Motor Group", contact: "Shane Furlong", product: "A1 Posters", qty: 40, stage: "Ready to Invoice", status: "Collected", owner: "aoife", due: "Today", dueDay: "Today", docketV: 1, value: 800, risk: "ok", source: "PrintLogic", quote: "Q-2475", paid: "Account", resource: "Large Format", board: "Done", completed: "Today 10:22", specs: { size: "A1", stock: "200gsm satin poster", print: "Single-sided colour", finish: "Encapsulated", packaging: "Rolled", delivery: "Collection" } },
];

/* The Byrne & Co change: detected from Claire Byrne's email at 11:24. */
export const CHANGE = {
  id: "CR-118",
  jobId: "J-10482",
  customer: "Byrne & Co Solicitors",
  from: "Claire Byrne <claire@byrneco.ie>",
  received: "Today 11:24",
  subject: "RE: Business cards - quick change",
  email:
    "Hi Emma,\n\nSorry to do this mid-way. We have three new solicitors starting next month so can we go to 2,000 cards and add three more names? Updated names and titles attached. Same design as before.\n\nThanks,\nClaire",
  fields: [
    { k: "Quantity", from: "1,000", to: "2,000" },
    { k: "Names", from: "2", to: "5" },
    { k: "Artwork", from: "V2 approved", to: "Revision required" },
    { k: "Production", from: "Queued, Digital Press 1", to: "Temporarily paused" },
    { k: "Commercial", from: "€210", to: "€475 · requote / approval required" },
  ],
  newQty: 2000,
  newNames: 5,
  valueBefore: 210,
  valueAfter: 475,
  confidence: 0.97,
};

export type DocketVersion = { v: number; created: string; by: string; reason: string; qty: number; names?: number; status: "Current" | "Superseded" };

export const DOCKETS: Record<string, DocketVersion[]> = {
  "J-10482": [
    { v: 1, created: "Today 09:08", by: "Docket Agent", reason: "Created from approved quote Q-2487", qty: 1000, names: 2, status: "Superseded" },
    { v: 2, created: "Today 10:12", by: "Sarah Byrne", reason: "Artwork V2 attached, proof approved", qty: 1000, names: 2, status: "Current" },
  ],
};

export type Order = { id: string; jobId: string; customer: string; product: string; qty: number; amount: number; when: string; status: "Artwork Queue" | "In Production" | "Dispatched" | "Collected"; payment: "Paid · Stripe"; newCustomer?: boolean };

/* 11 online orders this week = €4,620 (avg €420). */
export const ORDERS: Order[] = [
  { id: "O-8046", jobId: "J-10486", customer: "Greenline Café", product: "Folded Menus", qty: 500, amount: 428, when: "Today 12:14", status: "Artwork Queue", payment: "Paid · Stripe", newCustomer: true },
  { id: "O-8045", jobId: "J-10487", customer: "Kavanagh Physio", product: "A5 Flyers", qty: 2500, amount: 240, when: "Today 08:41", status: "Artwork Queue", payment: "Paid · Stripe" },
  { id: "O-8044", jobId: "J-10467", customer: "Riverside Yoga", product: "Business Cards", qty: 500, amount: 387, when: "Yesterday 19:02", status: "Collected", payment: "Paid · Stripe", newCustomer: true },
  { id: "O-8043", jobId: "J-10466", customer: "Delaney Plumbing", product: "Flyers", qty: 5000, amount: 390, when: "Yesterday 14:26", status: "Dispatched", payment: "Paid · Stripe" },
  { id: "O-8042", jobId: "J-10465", customer: "Bloom Florists", product: "Posters", qty: 50, amount: 575, when: "Yesterday 09:55", status: "Dispatched", payment: "Paid · Stripe" },
  { id: "O-8041", jobId: "J-10464", customer: "St. Anne's Parish", product: "Booklets", qty: 400, amount: 318, when: "Sat 26 Sep", status: "Collected", payment: "Paid · Stripe" },
  { id: "O-8040", jobId: "J-10463", customer: "Coastline Surf School", product: "Brochures", qty: 250, amount: 460, when: "Sat 26 Sep", status: "Dispatched", payment: "Paid · Stripe", newCustomer: true },
  { id: "O-8039", jobId: "J-10462", customer: "McGrath Butchers", product: "Menus", qty: 300, amount: 295, when: "Fri 25 Sep", status: "Collected", payment: "Paid · Stripe" },
  { id: "O-8038", jobId: "J-10461", customer: "Emerald Tutors", product: "Folded Leaflets", qty: 2000, amount: 530, when: "Fri 25 Sep", status: "Dispatched", payment: "Paid · Stripe" },
  { id: "O-8037", jobId: "J-10460", customer: "Hollow Oak Bakery", product: "Business Cards", qty: 1000, amount: 385, when: "Thu 24 Sep", status: "Collected", payment: "Paid · Stripe" },
  { id: "O-8036", jobId: "J-10459", customer: "Pinewood Crèche", product: "Presentation Folders", qty: 150, amount: 612, when: "Thu 24 Sep", status: "Dispatched", payment: "Paid · Stripe", newCustomer: true },
];

/* Online revenue, last 12 weeks (this week last). */
export const ONLINE_TREND = [
  { w: "6 Jul", v: 1480 }, { w: "13 Jul", v: 1720 }, { w: "20 Jul", v: 1610 }, { w: "27 Jul", v: 2050 },
  { w: "3 Aug", v: 2240 }, { w: "10 Aug", v: 2130 }, { w: "17 Aug", v: 2710 }, { w: "24 Aug", v: 3020 },
  { w: "31 Aug", v: 3380 }, { w: "7 Sep", v: 3560 }, { w: "14 Sep", v: 4110 }, { w: "21 Sep", v: 4620 },
];

export const ONLINE_PRODUCTS = [
  { name: "Business Cards", orders: 38, revenue: 13870, repeat: 62 },
  { name: "Flyers", orders: 31, revenue: 11020, repeat: 48 },
  { name: "Folded Leaflets", orders: 17, revenue: 7640, repeat: 41 },
  { name: "Brochures", orders: 12, revenue: 6290, repeat: 33 },
  { name: "Posters", orders: 14, revenue: 5930, repeat: 29 },
  { name: "Presentation Folders", orders: 8, revenue: 4710, repeat: 50 },
  { name: "Menus", orders: 11, revenue: 3980, repeat: 55 },
  { name: "Booklets", orders: 6, revenue: 2440, repeat: 17 },
];

export const PAYMENT_EXCEPTIONS = [
  { id: "O-8032", customer: "Lakeside Gym", issue: "Card declined, customer retried and paid 4 minutes later", state: "Resolved", when: "Mon 21 Sep" },
  { id: "O-8047", customer: "Ferns Community Hall", issue: "Uploaded artwork is RGB at 96dpi. Order held before job creation, customer emailed for print-ready file.", state: "Open", when: "Today 13:40" },
];

export type Customer = {
  id: string; name: string; contact: string; email: string; phone: string; since: number;
  lifetimeJobs: number; revenue12m: number; avgJob: number; outstanding: number;
  frequent: string[]; pricing: string; terms: string; channel: "Account" | "Online" | "Both";
};

export const CUSTOMERS: Customer[] = [
  { id: "byrne", name: "Byrne & Co Solicitors", contact: "Claire Byrne", email: "claire@byrneco.ie", phone: "01 555 0198", since: 2009, lifetimeJobs: 34, revenue12m: 14860, avgJob: 437, outstanding: 0, frequent: ["Business Cards", "Presentation Folders", "Letterheads"], pricing: "Trade account, 10% on stationery", terms: "30 days", channel: "Account" },
  { id: "summit", name: "Summit Property Partners", contact: "Rob Kiernan", email: "rob@summitpp.ie", phone: "01 555 0311", since: 2016, lifetimeJobs: 22, revenue12m: 11240, avgJob: 511, outstanding: 0, frequent: ["Presentation Folders", "Brochures", "Signboards"], pricing: "Standard price list", terms: "30 days", channel: "Account" },
  { id: "nova", name: "Nova Electrical", contact: "Brian Nolan", email: "brian@novaelectrical.ie", phone: "087 555 2210", since: 2019, lifetimeJobs: 15, revenue12m: 4380, avgJob: 292, outstanding: 935, frequent: ["A5 Flyers", "Business Cards", "Van Graphics"], pricing: "Standard price list", terms: "14 days", channel: "Account" },
  { id: "dental", name: "Dublin Dental Centre", contact: "Dr. Ruth Keane", email: "ruth@dublindental.ie", phone: "01 555 0764", since: 2014, lifetimeJobs: 27, revenue12m: 6920, avgJob: 256, outstanding: 0, frequent: ["Appointment Cards", "Letterheads", "Leaflets"], pricing: "Healthcare rate card", terms: "30 days", channel: "Account" },
  { id: "greenline", name: "Greenline Café", contact: "Tomás Ryan", email: "tomas@greenlinecafe.ie", phone: "086 555 4410", since: 2026, lifetimeJobs: 1, revenue12m: 428, avgJob: 428, outstanding: 0, frequent: ["Folded Menus"], pricing: "Website prices", terms: "Prepaid", channel: "Online" },
  { id: "harbourview", name: "Harbour View Hotel", contact: "Niamh Costello", email: "events@harbourview.ie", phone: "01 555 0907", since: 2012, lifetimeJobs: 41, revenue12m: 17350, avgJob: 423, outstanding: 2410, frequent: ["Brochures", "Menus", "Wedding Stationery"], pricing: "Hospitality account, 8%", terms: "30 days", channel: "Both" },
  { id: "kavanagh", name: "Kavanagh Physio", contact: "Eoin Kavanagh", email: "eoin@kavanaghphysio.ie", phone: "085 555 1180", since: 2023, lifetimeJobs: 6, revenue12m: 1310, avgJob: 218, outstanding: 0, frequent: ["A5 Flyers", "Appointment Cards"], pricing: "Website prices", terms: "Prepaid", channel: "Online" },
  { id: "castle", name: "Castle Events", contact: "Dara Quinn", email: "dara@castleevents.ie", phone: "087 555 3321", since: 2018, lifetimeJobs: 19, revenue12m: 7260, avgJob: 382, outstanding: 1395, frequent: ["Posters", "Roller Banners", "Tickets"], pricing: "Standard price list", terms: "14 days", channel: "Account" },
  { id: "oakfield", name: "Oakfield Primary School", contact: "Máire Hogan", email: "office@oakfieldps.ie", phone: "01 555 0450", since: 2011, lifetimeJobs: 24, revenue12m: 3540, avgJob: 148, outstanding: 0, frequent: ["Booklets", "Newsletters", "Certificates"], pricing: "Schools rate", terms: "30 days", channel: "Account" },
  { id: "fitzgerald", name: "Fitzgerald Auctioneers", contact: "Paul Fitzgerald", email: "paul@fitzgeraldauctioneers.ie", phone: "01 555 0632", since: 2008, lifetimeJobs: 52, revenue12m: 12970, avgJob: 250, outstanding: 1860, frequent: ["Brochures", "Sale Boards", "Business Cards"], pricing: "Trade account, 10%", terms: "30 days", channel: "Account" },
  { id: "corrib", name: "Corrib Pharmacy", contact: "Sinéad Walsh", email: "sinead@corribpharmacy.ie", phone: "091 555 0220", since: 2020, lifetimeJobs: 11, revenue12m: 2940, avgJob: 267, outstanding: 0, frequent: ["Folded Leaflets", "Posters"], pricing: "Standard price list", terms: "30 days", channel: "Both" },
  { id: "liffey", name: "Liffey Credit Union", contact: "Declan Moore", email: "d.moore@liffeycu.ie", phone: "01 555 0877", since: 2005, lifetimeJobs: 63, revenue12m: 9820, avgJob: 156, outstanding: 0, frequent: ["Letterheads", "Compliment Slips", "Annual Report"], pricing: "Contract pricing", terms: "30 days", channel: "Account" },
  { id: "mill", name: "The Mill Theatre", contact: "Aisling Byrne", email: "box@milltheatre.ie", phone: "01 555 0515", since: 2015, lifetimeJobs: 38, revenue12m: 6130, avgJob: 161, outstanding: 0, frequent: ["A3 Posters", "Programmes", "Flyers"], pricing: "Arts rate", terms: "30 days", channel: "Account" },
  { id: "hartley", name: "Hartley Accountants", contact: "Gráinne Hartley", email: "grainne@hartley.ie", phone: "01 555 0299", since: 2017, lifetimeJobs: 14, revenue12m: 3680, avgJob: 263, outstanding: 0, frequent: ["Presentation Folders", "Letterheads"], pricing: "Standard price list", terms: "30 days", channel: "Account" },
  { id: "lennon", name: "Lennon Architects", contact: "Ciara Lennon", email: "ciara@lennonarch.ie", phone: "01 555 0743", since: 2021, lifetimeJobs: 9, revenue12m: 5470, avgJob: 608, outstanding: 0, frequent: ["Brochures", "Large Format Boards"], pricing: "Standard price list", terms: "30 days", channel: "Account" },
  { id: "brightside", name: "Brightside Dental Group", contact: "Karen Doyle", email: "karen@brightside.ie", phone: "01 555 0188", since: 2019, lifetimeJobs: 17, revenue12m: 6040, avgJob: 355, outstanding: 0, frequent: ["Presentation Folders", "Appointment Cards"], pricing: "Healthcare rate card", terms: "30 days", channel: "Account" },
  { id: "wexford", name: "Wexford Motor Group", contact: "Shane Furlong", email: "marketing@wexfordmotors.ie", phone: "053 555 0120", since: 2018, lifetimeJobs: 21, revenue12m: 8110, avgJob: 386, outstanding: 1640, frequent: ["A1 Posters", "Window Graphics", "Brochures"], pricing: "Standard price list", terms: "30 days", channel: "Account" },
];
export const customer = (id: string) => CUSTOMERS.find((c) => c.id === id);

/* Previous jobs for the Byrne & Co history. */
export const BYRNE_HISTORY = [
  { id: "J-10482", product: "Business Cards", when: "Live", value: 210, state: "Change pending" },
  { id: "J-10391", product: "Presentation Folders", when: "12 Aug", value: 980, state: "Invoiced · Paid" },
  { id: "J-10344", product: "Letterheads", when: "18 Jul", value: 360, state: "Invoiced · Paid" },
  { id: "J-10297", product: "Business Cards", when: "24 Jun", value: 185, state: "Invoiced · Paid" },
  { id: "J-10233", product: "Compliment Slips", when: "29 May", value: 240, state: "Invoiced · Paid" },
  { id: "J-10180", product: "Presentation Folders", when: "30 Apr", value: 1120, state: "Invoiced · Paid" },
];

export type Invoice = { id: string; jobId: string; customer: string; amount: number; issued: string; due: string; status: "Paid" | "Sent" | "Overdue"; brc: "Synced" };

export const INVOICES: Invoice[] = [
  { id: "INV-7741", jobId: "J-10469", customer: "Harbour View Hotel", amount: 1340, issued: "Fri 25 Sep", due: "25 Oct", status: "Sent", brc: "Synced" },
  { id: "INV-7740", jobId: "J-10466", customer: "Delaney Plumbing", amount: 390, issued: "Thu 24 Sep", due: "Prepaid", status: "Paid", brc: "Synced" },
  { id: "INV-7739", jobId: "J-10458", customer: "Fitzgerald Auctioneers", amount: 1860, issued: "Wed 23 Sep", due: "23 Oct", status: "Sent", brc: "Synced" },
  { id: "INV-7738", jobId: "J-10457", customer: "Castle Events", amount: 1395, issued: "Mon 7 Sep", due: "21 Sep", status: "Overdue", brc: "Synced" },
  { id: "INV-7737", jobId: "J-10452", customer: "Harbour View Hotel", amount: 1140, issued: "Fri 4 Sep", due: "4 Oct", status: "Sent", brc: "Synced" },
  { id: "INV-7736", jobId: "J-10449", customer: "Liffey Credit Union", amount: 720, issued: "Thu 3 Sep", due: "3 Oct", status: "Paid", brc: "Synced" },
  { id: "INV-7735", jobId: "J-10446", customer: "Oakfield Primary School", amount: 310, issued: "Wed 2 Sep", due: "2 Oct", status: "Paid", brc: "Synced" },
];

/* Outstanding €8,240 = these debtors (J-10473 not yet invoiced, so not included). */
export const DEBTORS = [
  { customer: "Harbour View Hotel", amount: 2410, oldest: "4 Sep", days: 23, bucket: "0-30" },
  { customer: "Fitzgerald Auctioneers", amount: 1860, oldest: "23 Sep", days: 4, bucket: "0-30" },
  { customer: "Castle Events", amount: 1395, oldest: "7 Sep", days: 20, bucket: "Overdue" },
  { customer: "Nova Electrical", amount: 935, oldest: "15 Sep", days: 12, bucket: "0-30" },
  { customer: "Wexford Motor Group", amount: 1640, oldest: "28 Aug", days: 30, bucket: "30-60" },
];

export const REVENUE_MONTHS = [
  { m: "Apr", v: 51240, online: 2900 }, { m: "May", v: 54810, online: 4100 }, { m: "Jun", v: 49930, online: 5250 },
  { m: "Jul", v: 47620, online: 7020 }, { m: "Aug", v: 52480, online: 10110 }, { m: "Sep", v: 48620, online: 15670 },
];

export const FINANCE = {
  revenueMTD: 48620,
  completedNotInvoiced: 4870,
  outstanding: 8240,
  onlinePaid: 4620,
  avgJob: 472,
};

export const EFFICIENCY = { duplicatesAvoided: 187, hoursSaved: 12.4, adminTouchesAvoided: 27 };

export type EventKind = "person" | "agent" | "system" | "attention";
export type ActEvent = { t: string; kind: EventKind; who: string; text: string; jobId?: string; src?: string };

/* The building's heartbeat, oldest first. */
export const EVENTS: ActEvent[] = [
  { t: "08:41", kind: "system", who: "Stripe", src: "Stripe", text: "Stripe received €240 from Kavanagh Physio for order O-8045.", jobId: "J-10487" },
  { t: "08:42", kind: "agent", who: "Online Orders Agent", text: "Order O-8045 created job J-10487. Docket V1 generated.", jobId: "J-10487" },
  { t: "08:55", kind: "person", who: "Niall Doyle", text: "Started J-10479 on Digital Press 1 (5,000 A5 flyers).", jobId: "J-10479" },
  { t: "09:03", kind: "system", who: "PrintLogic", src: "PrintLogic", text: "Quote Q-2487 approved by Byrne & Co Solicitors.", jobId: "J-10482" },
  { t: "09:06", kind: "agent", who: "Docket Agent", text: "Job J-10482 created from Q-2487. No re-keying.", jobId: "J-10482" },
  { t: "09:08", kind: "agent", who: "Docket Agent", text: "Docket V1 generated for J-10482.", jobId: "J-10482" },
  { t: "10:12", kind: "person", who: "Sarah Byrne", text: "Artwork V2 attached to J-10482. Docket V2 is current.", jobId: "J-10482" },
  { t: "10:22", kind: "person", who: "Jack Brennan", text: "J-10475 collected by Wexford Motor Group.", jobId: "J-10475" },
  { t: "10:31", kind: "attention", who: "Ops Watchdog", text: "J-10470 still waiting on artwork from Dublin Dental Centre (2 days). Tomorrow's slot at risk.", jobId: "J-10470" },
  { t: "11:24", kind: "system", who: "Email", src: "Email", text: "Email from Claire Byrne received on J-10482.", jobId: "J-10482" },
  { t: "11:25", kind: "agent", who: "Change Control", text: "Detected change on J-10482: 1,000 → 2,000 cards, 2 → 5 names.", jobId: "J-10482" },
  { t: "11:25", kind: "attention", who: "Change Control", text: "Artwork and production paused on J-10482 pending approval.", jobId: "J-10482" },
  { t: "11:27", kind: "attention", who: "Change Control", text: "Change CR-118 sent to Sean Murphy for approval.", jobId: "J-10482" },
  { t: "12:14", kind: "system", who: "Stripe", src: "Stripe", text: "Stripe received €428 from Greenline Café.", jobId: "J-10486" },
  { t: "12:15", kind: "agent", who: "Online Orders Agent", text: "Online Order O-8046 created Job J-10486.", jobId: "J-10486" },
  { t: "12:15", kind: "agent", who: "Docket Agent", text: "Docket V1 generated for J-10486.", jobId: "J-10486" },
  { t: "12:16", kind: "agent", who: "Online Orders Agent", text: "Artwork check queued for Sarah Byrne on J-10486.", jobId: "J-10486" },
  { t: "13:03", kind: "person", who: "Jack Brennan", text: "J-10473 completed production and passed QC.", jobId: "J-10473" },
  { t: "13:06", kind: "agent", who: "Finance Agent", text: "Finance Agent moved J-10473 to Ready to Invoice (€1,640).", jobId: "J-10473" },
];

/* Production schedule: today, hours 08-18. */
export const SCHEDULE: { resource: Resource; jobId: string; start: number; end: number }[] = [
  { resource: "Digital Press 1", jobId: "J-10479", start: 8.9, end: 13.5 },
  { resource: "Digital Press 1", jobId: "J-10480", start: 14, end: 16 },
  { resource: "Digital Press 1", jobId: "J-10482", start: 16.25, end: 17.5 },
  { resource: "Digital Press 2", jobId: "J-10476", start: 8.5, end: 12.5 },
  { resource: "Digital Press 2", jobId: "J-10474", start: 13, end: 16.5 },
  { resource: "Large Format", jobId: "J-10488", start: 15, end: 17.75 },
  { resource: "Finishing", jobId: "J-10481", start: 9, end: 11.75 },
  { resource: "Finishing", jobId: "J-10483", start: 12, end: 15.5 },
  { resource: "Finishing", jobId: "J-10477", start: 15.75, end: 17 },
];

export const SYSTEMS = [
  { name: "PrintLogic", state: "Connected", live: true, purpose: ["Quotes", "Customers", "Job information"], note: "Approved quotes create Pulse jobs through the PrintLogic API." },
  { name: "Big Red Cloud", state: "Connected", live: true, purpose: ["Invoicing", "Accounting", "Customer balances"], note: "Remains the ledger. Pulse sends approved invoice data." },
  { name: "Stripe", state: "Connected", live: true, purpose: ["Website payments"], note: "Payment confirmation triggers job creation." },
  { name: "Email", state: "Connected", live: true, purpose: ["Customer communications", "Change detection"], note: "jobs@ inbox monitored by Change Control." },
  { name: "Website", state: "Connected", live: true, purpose: ["Online orders"], note: "Web orders arrive with specs and artwork attached." },
  { name: "Clover / AIB", state: "Current system", live: false, purpose: ["Counter / in-house payments"], note: "Not integrated. Counter payments are marked against the job by staff." },
];

export const fmtEUR = (n: number) => "€" + Math.round(n).toLocaleString("en-IE");
export const fmtNum = (n: number) => n.toLocaleString("en-IE");
