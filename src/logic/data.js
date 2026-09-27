/* Demo data and pure helpers for the Pulse prototype (Murphy Print demo). */

import { store as demoStore, metrics as demoMetrics } from "../demo/store";
import { ONLINE_TREND, ORDERS } from "../demo/data";
const INK="var(--ink)", BODY="var(--body)", DIM="var(--dim)", FAINT="var(--faint)";
const LIME="var(--accent)", GREEN="var(--ok)", AMBER="var(--warn)", RED="var(--bad)", NEUTRAL="var(--neutral)";
const MONO="var(--mono)";

const ICONS = {
  navJobs:"M6.4 3.6h7.4l4.2 4.2v12.6H6.4V3.6Z M13.4 3.8v4.2h4.2 M9 11.6h6 M9 14.8h6 M9 18h3.6",
  navProduction:"M7 9V4.2h10V9 M7 17.6H4.6v-8h14.8v8H17 M7.4 14h9.2v6.2H7.4V14Z M16.4 11.8h.01",
  navOnline:"M3.6 5h16.8v11.2H3.6V5Z M9 20h6 M12 16.2V20 M8 10.8l2.6 2.4 5.4-5",
  navCustomers:"M9.5 11a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4Z M3.4 19.6c.8-2.9 3.2-4.6 6.1-4.6s5.3 1.7 6.1 4.6 M16 5a3 3 0 0 1 0 5.8 M17.6 15.2c1.6.6 2.6 2 3 4.4",
  navFinance:"M4 6.4h16v11.2H4V6.4Z M4 10h16 M7.4 14.2h3.2",
  navHome:"M12 3.2 3.6 9.1v10a1.5 1.5 0 0 0 1.5 1.5h13.8a1.5 1.5 0 0 0 1.5-1.5v-10L12 3.2Z M8.9 13.1h2l1-2.6 1.5 5 1.1-2.4h1.6",
  navAgents:"M12 2.4v2.3 M12 2.4a.9.9 0 1 0 0-.02 M8.2 6.5h7.6A2.2 2.2 0 0 1 18 8.7v5.1a2.2 2.2 0 0 1-2.2 2.2H8.2A2.2 2.2 0 0 1 6 13.8V8.7a2.2 2.2 0 0 1 2.2-2.2Z M9.9 10.6v1.4 M14.1 10.6v1.4 M6 10h-1.9 M18 10h1.9 M9.2 18.6h5.6 M9.2 21.2h5.6",
  navDash:"M4 5.6h7.2v5.1H4V5.6Z M13.6 5.6H20v8.6h-6.4V5.6Z M4 13.1h7.2v5.3H4v-5.3Z M13.6 16.6H20v1.8h-6.4v-1.8Z",
  navWork:"M9.4 4.4h5.2a1.4 1.4 0 0 1 1.4 1.4v1.1h2.4A1.6 1.6 0 0 1 20 8.5v9.1a1.6 1.6 0 0 1-1.6 1.6H5.6A1.6 1.6 0 0 1 4 17.6V8.5a1.6 1.6 0 0 1 1.6-1.6H8V5.8a1.4 1.4 0 0 1 1.4-1.4Z M8 6.9h8 M9.6 13.3l1.8 1.8 3.4-3.6",
  navRecords:"M12 3.6c3.9 0 7 1.1 7 2.5S15.9 8.6 12 8.6 5 7.5 5 6.1 8.1 3.6 12 3.6Z M5 6.1v5.7c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5V6.1 M5 11.8v5.7c0 1.4 3.1 2.5 7 2.5s7-1.1 7-2.5v-5.7",
  navActivity:"M4.6 4.6h14.8A1.6 1.6 0 0 1 21 6.2v11.6a1.6 1.6 0 0 1-1.6 1.6H4.6A1.6 1.6 0 0 1 3 17.8V6.2a1.6 1.6 0 0 1 1.6-1.6Z M6 12.4h2.2l1.5-4.1 2.3 8 1.9-5.4 1.2 1.5H18",
  navAdmin:"M12 2.9 5 5.6v5.9c0 4 2.8 7.1 7 8.6 4.2-1.5 7-4.6 7-8.6V5.6L12 2.9Z M12 8.6a2 2 0 1 1 0 4 2 2 0 0 1 0-4Z M8.8 16.3a3.6 3.6 0 0 1 6.4 0",
  helios:"M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-4-.8L3 21l1.9-4.9A8.3 8.3 0 0 1 4 11.5 8.4 8.4 0 0 1 12 3a8.4 8.4 0 0 1 9 8.5Z M8 12h1.6l1.2-2.6 1.6 5 1.4-2.4H16",
  inbox:"M3 13h4l1.5 3h7l1.5-3h4 M3 13l2.4-7A2 2 0 0 1 7.3 4.6h9.4a2 2 0 0 1 1.9 1.4L21 13v4.4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V13Z",
  work:"M6 4.6h12a1.6 1.6 0 0 1 1.6 1.6v12.2A1.6 1.6 0 0 1 18 20H6a1.6 1.6 0 0 1-1.6-1.6V6.2A1.6 1.6 0 0 1 6 4.6Z M8.4 10.4l1.9 1.9 3.9-3.9 M8.4 15.6h7.2",
  approvals:"M12 3.6 19.5 6v6.1c0 4-3.1 6.9-7.5 8.3-4.4-1.4-7.5-4.3-7.5-8.3V6L12 3.6Z M9.2 12.2l2 2 3.6-3.7",
  insights:"M4.5 19.5V13 M9.7 19.5V7.5 M14.9 19.5v-8 M20 19.5V5",
  people:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9",
  orgs:"M4.5 20V6.4A1.4 1.4 0 0 1 5.9 5h6.2a1.4 1.4 0 0 1 1.4 1.4V20 M13.5 10.5h4.6A1.4 1.4 0 0 1 19.5 12v8 M3 20h18 M7.5 8.5h2.5 M7.5 12h2.5 M7.5 15.5h2.5",
  teams:"M9 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 12Z M16.5 12.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M2.6 19.6c.8-2.8 3.2-4.4 6.4-4.4s5.6 1.6 6.4 4.4 M17 15.4c2.2.4 3.7 1.8 4.3 4.2",
  locations:"M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z M12 12.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z",
  visits:"M8 4v3 M16 4v3 M4.5 9.5h15 M6.4 6h11.2A1.9 1.9 0 0 1 19.5 8v10a1.9 1.9 0 0 1-1.9 1.9H6.4A1.9 1.9 0 0 1 4.5 18V8A1.9 1.9 0 0 1 6.4 6Z M9 13.5l1.6 1.6 3.4-3.4",
  autos:"M18.5 8.5A5 5 0 0 0 8.9 7.3 3.8 3.8 0 0 0 6 14.6 M8 17.5l3.2 3.2 M11.2 20.7l3.2-3.2 M11.2 20.7V9.6",
  health:"M3 12.5h3.4l2-5 3 10 2.2-5H21",
  modules:"M6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v10.8a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2V6.6a2.2 2.2 0 0 1 2.2-2.2Z M4.4 9.6h15.2 M9.6 19.6V9.6",
  agents:"M8.5 3.6h7A2.4 2.4 0 0 1 17.9 6v5.6a2.4 2.4 0 0 1-2.4 2.4h-7A2.4 2.4 0 0 1 6.1 11.6V6a2.4 2.4 0 0 1 2.4-2.4Z M9.6 8.2h.01 M14.4 8.2h.01 M12 14v2.6 M7.6 20.4h8.8 M12 16.6c-2.4 0-4.4 1.7-4.4 3.8h8.8c0-2.1-2-3.8-4.4-3.8Z",
  dash:"M4.4 4.4h6v6h-6v-6Z M13.6 4.4h6v3.6h-6V4.4Z M13.6 11.6h6v8h-6v-8Z M4.4 14h6v5.6h-6V14Z",
  files:"M5 7.2a1.8 1.8 0 0 1 1.8-1.8h3l1.8 2.2h5.6A1.8 1.8 0 0 1 19 9.4v7.4a1.8 1.8 0 0 1-1.8 1.8H6.8A1.8 1.8 0 0 1 5 16.8V7.2Z",
  pulseLine:"M2.5 12.5h3.6l2.1-6.4 3.2 12.2 2.6-8.4 1.8 2.6h5.7",
  records:"M6.4 3.6h7.4l4.2 4.2v12.6H6.4V3.6Z M13.4 3.8v4.2h4.2 M9 12.4h6 M9 16h4",
  tree:"M4.5 6h5 M4.5 12h5 M4.5 18h5 M12.5 6h7 M12.5 12h7 M12.5 18h7",
  graph:"M7 7.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M17.6 10.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M9.4 21.4a2.4 2.4 0 1 0 0-4.8 2.4 2.4 0 0 0 0 4.8Z M8.6 6.4l7.6 2.6 M15.8 11.4l-5.6 5.2",
  bell:"M6 8.5a6 6 0 0 1 12 0c0 6.5 2.6 8.5 2.6 8.5H3.4S6 15 6 8.5Z M10.3 20.5a1.94 1.94 0 0 0 3.4 0"
};

const REC_SECTIONS = [
  {id:"customers", label:"Customers", blurb:"Every account and online customer, with what they order and what they owe."},
  {id:"jobs", label:"Jobs", blurb:"One live record per job, from approved quote to invoice."},
  {id:"quotes", label:"Quotes", blurb:"PrintLogic quotes, each linked to the job it became."},
  {id:"products", label:"Products", blurb:"The catalogue customers order from, online and over the counter."},
  {id:"files", label:"Files", blurb:"Artwork, dockets, quotes and customer emails, filed against the job."},
  {id:"ontology", label:"Ontology", blurb:"How a customer, quote, job, docket, artwork, change, production run, payment and invoice connect."}
];
/* Records directory rows are built from the demo store in PulseLogic; this
   list only holds quotes that have not become jobs yet. */
const CONTACTS = [
  ["Q-2492","Harbour View Hotel","Wedding stationery set",1280,"Sent · awaiting reply","harbourview"],
  ["Q-2491","Liffey Credit Union","Compliment slips, 2,000",240,"Sent · awaiting reply","liffey"],
  ["Q-2489","Fitzgerald Auctioneers","Sale boards, 12",690,"Follow-up due Thu","fitzgerald"]
];
const FILE_TREE = [
  {type:"folder", id:"f-10482", name:"Jobs / J-10482", depth:0},
  {type:"file", id:"fl-1", name:"Artwork V1.pdf", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"Artwork V1 · business cards, 2 names",
   facts:[["TYPE","PDF · 2 pages"],["ADDED","Today 10:12"],["INDEXED","Both pages"],["OWNER","Sarah Byrne"]],
   body:["First layout for Byrne & Co, matched to the previous card design. Two names: Claire Byrne and Mark Doherty.",
     "Logo supplied in PMS 541 and converted to CMYK for Digital Press 1. Superseded by V2 after a spacing correction."],
   links:[["Byrne & Co Solicitors","customer","byrne"],["J-10482","job","J-10482"],["Docket V1","ontology"]]},
  {type:"file", id:"fl-2", name:"Artwork V2.pdf", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"Artwork V2 · proof approved",
   facts:[["TYPE","PDF · 2 pages"],["ADDED","Today 10:12"],["INDEXED","Both pages"],["OWNER","Sarah Byrne"]],
   body:["The proof Claire Byrne approved this morning: 1,000 cards, 2 names, 85 × 55 mm, 400gsm silk, matt laminate.",
     "Attached to Docket V2. If CR-118 is approved, Sarah revises this to V3 with five names."],
   links:[["Byrne & Co Solicitors","customer","byrne"],["J-10482","job","J-10482"],["CR-118","ontology"]]},
  {type:"file", id:"fl-3", name:"Customer email 11:24.eml", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"RE: Business cards, quick change",
   facts:[["TYPE","Email · 1 attachment"],["RECEIVED","Today 11:24"],["INDEXED","Body and attachment"],["FROM","Claire Byrne"]],
   body:["Claire asks to go from 1,000 to 2,000 cards and add three names for new solicitors starting next month. Same design.",
     "Change Control read this at 11:25, extracted the quantity and names change, paused artwork and raised CR-118 for Sean."],
   links:[["Byrne & Co Solicitors","customer","byrne"],["J-10482","job","J-10482"],["Change Request","ontology"]]},
  {type:"file", id:"fl-4", name:"Docket V1.pdf", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"Docket V1 · superseded",
   facts:[["TYPE","PDF · 1 page"],["CREATED","Today 09:08"],["STATUS","Superseded"],["BY","Docket Agent"]],
   body:["Generated automatically from approved quote Q-2487. Nobody typed it: customer, product, quantity and specs came across from PrintLogic.",
     "Printed copies carry a QR code. Scanning it now opens the current version, not this one."],
   links:[["J-10482","job","J-10482"],["Quote Q-2487","ontology"]]},
  {type:"file", id:"fl-5", name:"Docket V2.pdf", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"Docket V2 · current until CR-118 is decided",
   facts:[["TYPE","PDF · 1 page"],["CREATED","Today 10:12"],["STATUS","Current"],["BY","Sarah Byrne"]],
   body:["Artwork V2 attached, proof approved. This is the copy travelling with the physical sample.",
     "On approval of CR-118 it is marked superseded and Docket V3 is printed for the press room."],
   links:[["J-10482","job","J-10482"],["Docket","ontology"]]},
  {type:"file", id:"fl-6", name:"Quote Q-2487.pdf", depth:1, parent:"f-10482", indexed:true,
   path:"Jobs / J-10482 · Byrne & Co Solicitors", title:"Quote Q-2487 · €210",
   facts:[["TYPE","PDF · 1 page"],["SOURCE","PrintLogic"],["APPROVED","Today 09:03"],["VALUE","€210"]],
   body:["1,000 business cards, 2 names, trade account pricing. Approved by Claire Byrne at 09:03.",
     "Approval in PrintLogic created J-10482 in Pulse at 09:06 with no re-keying."],
   links:[["Byrne & Co Solicitors","customer","byrne"],["J-10482","job","J-10482"],["Quote","ontology"]]},
  {type:"folder", id:"f-10486", name:"Jobs / J-10486", depth:0},
  {type:"file", id:"fl-7", name:"Order O-8046.pdf", depth:1, parent:"f-10486", indexed:true,
   path:"Jobs / J-10486 · Greenline Café", title:"Website order O-8046 · €428 paid",
   facts:[["TYPE","PDF · 1 page"],["RECEIVED","Today 12:14"],["PAYMENT","Paid · Stripe"],["SOURCE","Website"]],
   body:["500 folded menus, A4 folded to A5, 300gsm silk, gloss laminate. Paid by card through Stripe before anyone touched it.",
     "The job, docket and artwork check were created by 12:16. Zero manual data entry."],
   links:[["Greenline Café","customer","greenline"],["J-10486","job","J-10486"],["Payment","ontology"]]},
  {type:"file", id:"fl-8", name:"Menu artwork (customer upload).pdf", depth:1, parent:"f-10486", indexed:true,
   path:"Jobs / J-10486 · Greenline Café", title:"Customer artwork · folded menu",
   facts:[["TYPE","PDF · 2 pages"],["UPLOADED","Today 12:14"],["PREFLIGHT","CMYK, 300dpi, 3mm bleed"],["OWNER","Sarah Byrne"]],
   body:["Uploaded with the website order. Preflight passed, so it went straight to Sarah's artwork queue.",
     "Fold marks set for A4 to A5. No changes requested by the customer so far."],
   links:[["Greenline Café","customer","greenline"],["J-10486","job","J-10486"],["Artwork","ontology"]]},
  {type:"folder", id:"f-10473", name:"Jobs / J-10473", depth:0},
  {type:"file", id:"fl-9", name:"Docket V1 (signed off).pdf", depth:1, parent:"f-10473", indexed:true,
   path:"Jobs / J-10473 · Summit Property Partners", title:"Docket V1 · all stages signed",
   facts:[["TYPE","PDF · 1 page"],["COMPLETED","Today 13:03"],["QC","Passed · Jack Brennan"],["STATUS","Current"]],
   body:["Artwork, production, finishing, quality check and dispatch all signed off. 500 presentation folders, soft-touch laminate and spot UV.",
     "Finance Agent moved the job to Ready to Invoice at 13:06."],
   links:[["Summit Property Partners","customer","summit"],["J-10473","job","J-10473"],["Production","ontology"]]},
  {type:"file", id:"fl-10", name:"Invoice draft €1,640.pdf", depth:1, parent:"f-10473", indexed:false,
   path:"Jobs / J-10473 · Summit Property Partners", title:"Invoice draft · ready for Big Red Cloud",
   facts:[["TYPE","PDF · 1 page"],["VALUE","€1,640"],["STATUS","Awaiting approval"],["LEDGER","Big Red Cloud"]],
   body:["Built from the job record, not retyped. Approving it sends the invoice data to Big Red Cloud, which stays the ledger.",
     "Not indexed: the figures Pulse quotes come from the job and Big Red Cloud, not from this PDF."],
   links:[["Summit Property Partners","customer","summit"],["J-10473","job","J-10473"],["Invoice","ontology"]]},
  {type:"folder", id:"f-tpl", name:"Templates", depth:0},
  {type:"file", id:"fl-11", name:"Docket template.pdf", depth:1, parent:"f-tpl", indexed:false,
   path:"Templates", title:"Docket template · production job ticket",
   facts:[["TYPE","PDF · 1 page"],["UPDATED","14 Sep 2026"],["USED BY","Docket Agent"],["OWNER","Sean Murphy"]],
   body:["The printed ticket that travels with the physical sample: job number, customer, specs, artwork version, due date, QR code and a sign-off strip.",
     "Every docket version is stamped Current or Superseded so the press room never works from an old copy."],
   links:[["Docket","ontology"]]}
];
/* Print ontology: one record spine from customer to invoice. x/y are in a
   1000 × 520 schema canvas. The example column follows Byrne & Co. */
const ONTO_NODES = [
  {id:"Customer", x:90, y:110, tint:"#6fcfe4", source:"PrintLogic", count:"412",
   note:"Accounts and online customers. Balances are read from Big Red Cloud, never copied.",
   example:"Byrne & Co Solicitors", facts:[["Contact","Claire Byrne"],["Since","2009"],["Lifetime jobs","34"],["Outstanding","€0"]], go:["customer","byrne"]},
  {id:"Quote", x:290, y:110, tint:"#9fb4c8", source:"PrintLogic", count:"64 this week",
   note:"Priced in PrintLogic. An approved quote is what creates the job.",
   example:"Q-2487 · €210", facts:[["Approved","Today 09:03"],["Product","Business Cards"],["Conversion","58% this week"]], go:["job","J-10482"]},
  {id:"Job", x:500, y:110, tint:"#e8e2d4", source:"Pulse", count:"17 live",
   note:"The one live record. Everything else hangs off it, so nothing is typed twice.",
   example:"J-10482 · Business Cards", facts:[["Stage","Artwork"],["Owner","Sarah Byrne"],["Due","Thu 1 Oct"]], go:["job","J-10482"]},
  {id:"Docket", x:710, y:110, tint:"#c9b98a", source:"Pulse", count:"3 versions on J-10482",
   note:"The printed job ticket. Versioned: one is Current, older ones are Superseded and say so on the QR.",
   example:"Docket V3", facts:[["Status","Current after approval"],["Replaces","V2"],["Printed","With QR code"]], go:["docket","J-10482"]},
  {id:"Artwork", x:900, y:110, tint:"#e07aa8", source:"Pulse", count:"6 in queue",
   note:"Proofs and revisions, each attached to a docket version.",
   example:"Artwork V3", facts:[["Owner","Sarah Byrne"],["Change","2 → 5 names"],["Previous","V2 approved"]], go:["job","J-10482"]},
  {id:"Change Request", x:500, y:300, tint:"#e07aa8", source:"Email", count:"1 pending",
   note:"Raised when Change Control reads a spec change in a customer email. Pauses the job until approved.",
   example:"CR-118", facts:[["Quantity","1,000 → 2,000"],["Names","2 → 5"],["Value","€210 → €475"]], go:["change",""]},
  {id:"Production", x:290, y:420, tint:"#7fc9b0", source:"Pulse", count:"7 in production",
   note:"Press, finishing and QC against a resource. Reads the current docket only.",
   example:"Digital Press 1", facts:[["Slot","Today 16:15"],["Status","Paused for CR-118"],["Next","Finishing"]], go:["page","Production"]},
  {id:"Payment", x:710, y:420, tint:"#a9bfa0", source:"Stripe", count:"11 online this week",
   note:"Stripe for website orders, Clover / AIB at the counter, or on account.",
   example:"Account", facts:[["Terms","30 days"],["Method","On account"],["Stripe","Not used for this job"]], go:["page","Finance"]},
  {id:"Invoice", x:500, y:490, tint:"#e7c35a", source:"Big Red Cloud", count:"4 ready",
   note:"Prepared from the job and sent to Big Red Cloud on approval. Big Red Cloud stays the ledger.",
   example:"Not yet invoiced", facts:[["Status","Job still in artwork"],["Ledger","Big Red Cloud"],["Re-keying","None"]], go:["page","Finance"]}
];
const ONTO_EDGES = [
  ["Customer","Quote","requests"],["Quote","Job","creates"],["Job","Docket","prints as"],["Docket","Artwork","carries"],
  ["Job","Change Request","revised by"],["Change Request","Docket","new version"],
  ["Job","Production","runs on"],["Production","Invoice","completes into"],
  ["Payment","Invoice","settles"],["Payment","Job","prepays"]
];
const REC_TEMPLATES = [
  ["Field sheet","Records","Labelled fields in a grid — the default for a person, organisation or location.",
   "M5 5.5h14v13H5v-13Z M5 10h14 M12 10v8.5","grid"],
  ["Contact card","Records","A portrait, key fields and every linked record in one compact panel.",
   "M12 11.5a3.4 3.4 0 1 0 0-6.8 3.4 3.4 0 0 0 0 6.8Z M5.5 19c.8-3 3.3-4.7 6.5-4.7s5.7 1.7 6.5 4.7","card"],
  ["Directory","Records","A sortable table of many records at once, built for lists.",
   "M4.5 6.5h15 M4.5 12h15 M4.5 17.5h15 M4.5 6.5h.01 M4.5 12h.01 M4.5 17.5h.01","rows"],
  ["Timeline","Case work","Ordered events with who did what and when. Good for a case or a claim.",
   "M12 3.5v17 M12 7.5h6 M12 13h-6 M12 18h6","timeline"],
  ["Kanban board","Case work","Cards in columns by status. For anything that moves through stages.",
   "M5 5h4.5v14H5V5Z M9.75 5h4.5v9h-4.5V5Z M14.5 5H19v6h-4.5V5Z","kanban"],
  ["Checklist","Case work","Ticked steps in order, with an owner and a due date on each.",
   "M5 6.5h2l1.4 1.4L11 5.5 M5 12.5h2l1.4 1.4 2.6-2.4 M5 18.5h2l1.4 1.4 2.6-2.4 M15 6.5h4 M15 12.5h4 M15 18.5h4","checklist"],
  ["Ledger","Finance","Rows and running totals. For anything with amounts and dates.",
   "M4 6h16 M4 12h16 M4 18h16 M9 3.5v17","ledger"],
  ["Invoice","Finance","Line items, totals and a status — built to be sent, not just stored.",
   "M7 3.5h10v17H7v-17Z M9.5 8h5 M9.5 11.5h5 M9.5 15h3","invoice"],
  ["Document","Notes","Long-form text with linked records pulled out down the side.",
   "M7 3.5h7l5 5v12H7v-17Z M14 3.7v5h5 M10 13h6 M10 16.5h4","document"],
  ["Gallery","Notes","A wall of images and files with a caption on each — for a site or a job.",
   "M4.5 6h6v6h-6V6Z M13.5 6h6v6h-6V6Z M4.5 14h6v4h-6v-4Z M13.5 14h6v4h-6v-4Z","gallery"],
  ["Map & locations","Ops","A pinboard of places, with the record's fields beside each pin.",
   "M12 21s6.5-5.6 6.5-11a6.5 6.5 0 1 0-13 0C5.5 15.4 12 21 12 21Z M12 12.8a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z","map"],
  ["Schedule","Ops","A calendar of bookings against this record, with recurring rules.",
   "M8 4v3 M16 4v3 M4.5 9.5h15 M6.4 6h11.2A1.9 1.9 0 0 1 19.5 8v10a1.9 1.9 0 0 1-1.9 1.9H6.4A1.9 1.9 0 0 1 4.5 18V8A1.9 1.9 0 0 1 6.4 6Z","schedule"]
];
const REC_TEMPLATE_CATS = ["All","Records","Case work","Finance","Notes","Ops"];

/* ---- admin hub ---- */
/* ---- admin hub: 13 settings areas in five groups ---- */
const PEOPLE = [
  ["Sean Murphy","Owner / Managing Director","sean@murphyprint.ie","Front office","active","Admin","2 min ago"],
  ["Aoife Kelly","Accounts","aoife@murphyprint.ie","Front office","active","Manager","6 min ago"],
  ["Liam O'Connor","Production","liam@murphyprint.ie","Press room","active","Manager","14 min ago"],
  ["Emma Walsh","Customer Service","emma@murphyprint.ie","Front office","active","Standard","3 min ago"],
  ["Sarah Byrne","Artwork","sarah@murphyprint.ie","Studio","active","Standard","1 min ago"],
  ["Niall Doyle","Print Operator","niall@murphyprint.ie","Press room","active","Standard","22 min ago"],
  ["Jack Brennan","Finishing / Dispatch","jack@murphyprint.ie","Finishing","active","Standard","9 min ago"]
];
const ROLE_LEVELS = ["Admin","Manager","Standard","External"];
const PERM_KEYS = [["view","View jobs"],["edit","Edit jobs"],["approve","Approve changes and invoices"]];
const GRANT_DEFS = [
  ["view","View jobs","Jobs, dockets and customers in scope"],
  ["edit","Edit jobs","Update specs, stages and notes"],
  ["approve","Approve changes","Say yes to change requests and rush jobs"],
  ["pay","Send invoices","Push approved invoices to Big Red Cloud"],
  ["export","Export data","Download and share out"],
  ["agents","Manage agents","Create and grant agents"],
  ["settings","Change settings","Systems, roles, dockets"],
  ["audit","Read the audit log","Every action, everyone"]
];
const ROLE_SCOPES = ["All records","Their location","Assigned only"];
const DEFAULT_PERMS = {Admin:{view:true,edit:true,approve:true}, Manager:{view:true,edit:true,approve:true},
  Standard:{view:true,edit:true,approve:false}, External:{view:true,edit:false,approve:false}};
const INTEGRATIONS = [
  {name:"PrintLogic", blurb:"Quotation source. Approved quotes create Pulse jobs through the PrintLogic API, with customer and job information attached.", tint:"#6fcfe4", status:"connected", statusKind:"ok",
   glyph:"M6.4 3.6h7.4l4.2 4.2v12.6H6.4V3.6Z M13.4 3.8v4.2h4.2 M9 12h6 M9 15.5h6",
   lastSync:"1 min ago", usage:"37 jobs created this week", auth:"API key", scopes:["Quotes","Customers","Job information"]},
  {name:"Big Red Cloud", blurb:"Remains the ledger. Pulse sends approved invoice data and reads customer balances back.", tint:"#e7c35a", status:"connected", statusKind:"ok",
   glyph:"M4 6.4h16v11.2H4V6.4Z M4 10h16 M7.4 14.2h3.2",
   lastSync:"13:18", usage:"invoices synced on approval", auth:"API key", scopes:["Invoicing","Accounting","Customer balances"]},
  {name:"Stripe", blurb:"Website payments. A confirmed payment is what triggers job creation for an online order.", tint:"#9fb4ff", status:"connected", statusKind:"ok",
   glyph:"M3.6 6h16.8v12H3.6V6Z M3.6 10h16.8 M7 14.5h4",
   lastSync:"12:14", usage:"11 payments this week · €4,620", auth:"OAuth 2.0", scopes:["Website payments"]},
  {name:"Email", blurb:"Customer communications. The jobs@ inbox is read by Change Control for specification changes.", tint:"#e07aa8", status:"connected", statusKind:"ok",
   glyph:"M4 7.2 12 13 20 7.2 M4 7.2v10.6h16V7.2 M4 7.2 8.5 4h7L20 7.2",
   lastSync:"2 min ago", usage:"1 change detected today", auth:"OAuth 2.0", scopes:["Customer communications","Change detection"]},
  {name:"Website", blurb:"Online orders arrive with specs and artwork attached, and land as jobs once Stripe confirms payment.", tint:"#7fc9b0", status:"connected", statusKind:"ok",
   glyph:"M3.6 5h16.8v11.2H3.6V5Z M9 20h6 M12 16.2V20",
   lastSync:"12:14", usage:"11 orders this week", auth:"Webhook", scopes:["Online orders"]},
  {name:"Clover / AIB", blurb:"Current system for counter and in-house card payments. Not an API integration: staff mark counter payments against the job.", tint:"#9aa39a", status:"current system", statusKind:"off", action:"Marked by staff",
   glyph:"M5 5.5h14v13H5v-13Z M8 9h8 M8 12.5h3 M13 12.5h3 M8 15.5h3 M13 15.5h3",
   lastSync:"Not synced", usage:"Counter payments", auth:"None", scopes:["Counter / in-house payments"]}
];
/* Background catalogue. Each entry is pure CSS so a tile is the real thing at
   thumbnail size, not a picture of it. */
const BG_DEFS = [
  {id:"bloom", name:"Bloom", cat:"Signature",
   css:"background:radial-gradient(60% 48% at 50% 34%, var(--accent-faint), transparent 72%), radial-gradient(44% 38% at 16% 84%, rgba(255,255,255,.05), transparent 70%)",
   thumb:"background:radial-gradient(62% 58% at 46% 34%, var(--accent-soft), transparent 74%), radial-gradient(50% 46% at 82% 84%, rgba(255,255,255,.08), transparent 72%), var(--surface-2)"},
  {id:"mist", name:"Mist", cat:"Signature",
   css:"background:radial-gradient(52% 44% at 24% 22%, rgba(255,255,255,.07), transparent 70%), radial-gradient(56% 46% at 80% 76%, rgba(255,255,255,.05), transparent 72%)",
   thumb:"background:radial-gradient(58% 52% at 24% 22%, rgba(255,255,255,.16), transparent 72%), radial-gradient(60% 54% at 82% 78%, rgba(255,255,255,.10), transparent 74%), var(--surface-2)"},
  {id:"grid", name:"Grid", cat:"Signature",
   css:"background-image:linear-gradient(var(--border) 1px, transparent 1px),linear-gradient(90deg, var(--border) 1px, transparent 1px);background-size:56px 56px;mask-image:radial-gradient(62% 56% at 50% 46%, #000, transparent 78%);-webkit-mask-image:radial-gradient(62% 56% at 50% 46%, #000, transparent 78%)",
   thumb:"background-color:var(--surface-2);background-image:linear-gradient(var(--border-strong) 1px, transparent 1px),linear-gradient(90deg, var(--border-strong) 1px, transparent 1px);background-size:14px 14px"},
  {id:"none", name:"None", cat:"Signature", css:"", thumb:"background:var(--surface-2)"},

  {id:"aurora", name:"Aurora", cat:"Gradient",
   css:"background:radial-gradient(70% 52% at 18% 8%, var(--bloom-a), transparent 66%), radial-gradient(64% 48% at 84% 22%, var(--bloom-b), transparent 68%), radial-gradient(70% 60% at 50% 104%, var(--bloom-c), transparent 70%);filter:blur(24px)",
   thumb:"background:radial-gradient(72% 60% at 16% 6%, var(--bloom-a), transparent 68%), radial-gradient(66% 54% at 86% 24%, var(--bloom-b), transparent 70%), radial-gradient(74% 66% at 50% 108%, var(--bloom-c), transparent 72%), var(--surface-2)"},
  {id:"horizon", name:"Horizon", cat:"Gradient",
   css:"background:linear-gradient(180deg, transparent 0%, var(--accent-faint) 58%, transparent 100%), radial-gradient(90% 40% at 50% 72%, var(--accent-soft), transparent 70%)",
   thumb:"background:linear-gradient(180deg, var(--surface-2) 0%, var(--accent-faint) 58%, var(--surface-2) 100%), radial-gradient(90% 44% at 50% 74%, var(--accent-soft), transparent 70%)"},
  {id:"dusk", name:"Dusk", cat:"Gradient",
   css:"background:linear-gradient(200deg, var(--bloom-c) -10%, transparent 46%), linear-gradient(20deg, var(--bloom-b) -10%, transparent 52%);opacity:.5",
   thumb:"background:linear-gradient(200deg, var(--bloom-c) -12%, transparent 48%), linear-gradient(20deg, var(--bloom-b) -12%, transparent 54%), var(--surface-2)"},
  {id:"ember", name:"Ember", cat:"Gradient",
   css:"background:radial-gradient(60% 70% at 84% 96%, var(--bloom-a), transparent 64%), radial-gradient(50% 60% at 10% 96%, var(--bloom-c), transparent 66%)",
   thumb:"background:radial-gradient(64% 76% at 84% 100%, var(--bloom-a), transparent 66%), radial-gradient(54% 66% at 8% 100%, var(--bloom-c), transparent 68%), var(--surface-2)"},

  {id:"mesh", name:"Mesh", cat:"Abstract",
   css:"background-image:radial-gradient(var(--border-strong) 1px, transparent 1px);background-size:22px 22px;mask-image:radial-gradient(70% 62% at 50% 46%, #000, transparent 76%);-webkit-mask-image:radial-gradient(70% 62% at 50% 46%, #000, transparent 76%)",
   thumb:"background-color:var(--surface-2);background-image:radial-gradient(var(--border-strong) 1px, transparent 1px);background-size:8px 8px"},
  {id:"contour", name:"Contour", cat:"Abstract",
   css:"background:repeating-radial-gradient(circle at 30% 110%, transparent 0 22px, var(--border) 22px 23px);mask-image:radial-gradient(80% 70% at 40% 80%, #000, transparent 78%);-webkit-mask-image:radial-gradient(80% 70% at 40% 80%, #000, transparent 78%)",
   thumb:"background:repeating-radial-gradient(circle at 26% 116%, var(--surface-2) 0 9px, var(--border-strong) 9px 10px)"},
  {id:"weave", name:"Weave", cat:"Abstract",
   css:"background:repeating-linear-gradient(48deg, transparent 0 16px, var(--border) 16px 17px), repeating-linear-gradient(-48deg, transparent 0 16px, var(--border) 16px 17px);opacity:.7",
   thumb:"background-color:var(--surface-2);background-image:repeating-linear-gradient(48deg, transparent 0 7px, var(--border-strong) 7px 8px), repeating-linear-gradient(-48deg, transparent 0 7px, var(--border-strong) 7px 8px)"},
  {id:"halo", name:"Halo", cat:"Abstract",
   css:"background:repeating-radial-gradient(circle at 50% 50%, transparent 0 46px, var(--accent-line) 46px 47px);mask-image:radial-gradient(60% 60% at 50% 50%, #000, transparent 72%);-webkit-mask-image:radial-gradient(60% 60% at 50% 50%, #000, transparent 72%)",
   thumb:"background:repeating-radial-gradient(circle at 50% 50%, var(--surface-2) 0 11px, var(--accent-line) 11px 12px)"},
  {id:"drift", name:"Drift", cat:"Abstract",
   css:"background:conic-gradient(from 210deg at 32% 38%, var(--bloom-b), transparent 38%), conic-gradient(from 20deg at 76% 70%, var(--bloom-a), transparent 34%);filter:blur(30px);opacity:.6",
   thumb:"background:conic-gradient(from 210deg at 32% 38%, var(--bloom-b), transparent 38%), conic-gradient(from 20deg at 76% 70%, var(--bloom-a), transparent 34%), var(--surface-2)"},
  {id:"scan", name:"Scanlines", cat:"Abstract",
   css:"background:repeating-linear-gradient(0deg, var(--border) 0 1px, transparent 1px 7px);mask-image:linear-gradient(180deg, #000, transparent 88%);-webkit-mask-image:linear-gradient(180deg, #000, transparent 88%)",
   thumb:"background-color:var(--surface-2);background-image:repeating-linear-gradient(0deg, var(--border-strong) 0 1px, transparent 1px 5px)"}
];

const THEMES = [
  {id:"dark", label:"Dark", group:"Dark", bg:"#0b0c0b", surface:"#1a1c19", ink:"#f2f3ef", accent:"#c8f04b"},
  {id:"indigo", label:"Indigo", group:"Dark", bg:"#0a0b13", surface:"#1a1b26", ink:"#f0f1fa", accent:"#8b93ff"},
  {id:"slate", label:"Slate", group:"Dark", bg:"#100e0c", surface:"#211c17", ink:"#f4f0ea", accent:"#e8a14a"},
  {id:"plum", label:"Plum", group:"Dark", bg:"#100a10", surface:"#20151f", ink:"#f6eef4", accent:"#f077b0"},
  {id:"ember", label:"Ember", group:"Dark", bg:"#0b0b0b", surface:"#1c1714", ink:"#f7f3ef", accent:"#f4561a"},
  {id:"harbour", label:"Harbour", group:"Dark", bg:"#0b0e10", surface:"#13171a", ink:"#f3f5f4", accent:"#5ee79a"},
  {id:"cargo", label:"Cargo", group:"Dark", bg:"#0a0a0a", surface:"#1a1c1a", ink:"#f2f5f2", accent:"#4ade80"},
  {id:"ocean", label:"Ocean", group:"Dark", bg:"#080e12", surface:"#141f25", ink:"#eaf4f8", accent:"#4fd4d0"},
  {id:"graphite", label:"Graphite", group:"Dark", bg:"#111112", surface:"#212124", ink:"#f4f4f5", accent:"#f4f4f5"},
  {id:"light", label:"Cream", group:"Light", bg:"#f4f2ed", surface:"#ffffff", ink:"#16181c", accent:"#0071e3"},
  {id:"warm", label:"Warm paper", group:"Light", bg:"#faf5ec", surface:"#fffdf9", ink:"#2a2016", accent:"#c9683f"},
  {id:"mist", label:"Mist", group:"Light", bg:"#eef1f4", surface:"#ffffff", ink:"#141e20", accent:"#0e9f6e"},
  {id:"sand", label:"Sand", group:"Light", bg:"#f6f1e6", surface:"#fffdf7", ink:"#221d12", accent:"#7d5fd6"}
];

const ADMIN_ICONS = {
  people:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9",
  teams:"M9 12a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 12Z M16.5 12.5a2.6 2.6 0 1 0 0-5.2 2.6 2.6 0 0 0 0 5.2Z M2.6 19.6c.8-2.8 3.2-4.4 6.4-4.4s5.6 1.6 6.4 4.4 M17 15.4c2.2.4 3.7 1.8 4.3 4.2",
  structure:"M4.5 20V6.4A1.4 1.4 0 0 1 5.9 5h6.2a1.4 1.4 0 0 1 1.4 1.4V20 M13.5 10.5h4.6A1.4 1.4 0 0 1 19.5 12v8 M3 20h18 M7.5 8.5h2.5 M7.5 12h2.5",
  shield:"M12 3.6 19.5 6v6.1c0 4-3.1 6.9-7.5 8.3-4.4-1.4-7.5-4.3-7.5-8.3V6L12 3.6Z M9.2 12.2l2 2 3.6-3.7",
  agent:"M2 12h4l2.5-6 3.5 12 3-8 2 2h5",
  flow:"M18.5 8.5A5 5 0 0 0 8.9 7.3 3.8 3.8 0 0 0 6 14.6 M8 17.5l3.2 3.2 M11.2 20.7l3.2-3.2 M11.2 20.7V9.6",
  plug:"M9 3.5v5 M15 3.5v5 M6.5 8.5h11v3a5.5 5.5 0 0 1-11 0v-3Z M12 17v3.5",
  modules:"M6.6 4.4h10.8a2.2 2.2 0 0 1 2.2 2.2v10.8a2.2 2.2 0 0 1-2.2 2.2H6.6a2.2 2.2 0 0 1-2.2-2.2V6.6a2.2 2.2 0 0 1 2.2-2.2Z M4.4 9.6h15.2 M9.6 19.6V9.6",
  health:"M3 12.5h3.4l2-5 3 10 2.2-5H21",
  lock:"M6.5 10.5h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 19v-7a1.5 1.5 0 0 1 1.5-1.5Z M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3",
  audit:"M8 3.5h8l3.5 3.5v13a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5V5A1.5 1.5 0 0 1 6 3.5h2Z M9 12h6 M9 16h4",
  brand:"M12 3.5 14.6 9l6.4.6-4.8 4.2 1.4 6.2-5.6-3.3-5.6 3.3 1.4-6.2L3 9.6 9.4 9 12 3.5Z",
  bell:"M6 8.5a6 6 0 0 1 12 0c0 6.5 2.6 8.5 2.6 8.5H3.4S6 15 6 8.5Z M10.3 20.5a1.94 1.94 0 0 0 3.4 0",
  data:"M4.5 7.5c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3Z M4.5 7.5v9c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-9 M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"
};

const ADMIN_CARDS = [
  {id:"people", group:"ORGANISATION", title:"People & access", icon:"people", tint:"#6fcfe4",
   blurb:"The seven people who run the building, and what each can reach.",
   tags:["7 people","5 areas","1 site"],
   footer:"Everyone has signed in today", action:"Review access",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Add, invite or remove staff",""],["Assign areas","Studio · Press room · Finishing · Front office"],
     ["Set who approves changes","Sean Murphy"],["Set who sends invoices","Sean Murphy · Aoife Kelly"],["View last login","7 people tracked"]]},
  {id:"teams", group:"ORGANISATION", title:"Roles & permissions", icon:"shield", tint:"var(--accent)",
   blurb:"Permission templates, and exactly what each person can reach.",
   tags:["4 roles","8 permissions","3 scopes"],
   heroLabel:"THE QUESTION THIS ANSWERS", heroAction:"Show me what someone can access",
   heroText:"Pick a person and see every job, docket, customer and invoice they can reach, resolved through their grants.",
   footer:"Preview Pulse as another user", action:"Open preview",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Create permission templates","4 in use"],["View, edit and export access","per permission"],
     ["Restrict by area or assigned jobs","3 scopes"],["Change approval limit","Sean approves all changes"],["Preview Pulse as another user",""]]},
  {id:"structure", group:"ORGANISATION", title:"Company profile", icon:"structure", tint:"#e7c35a",
   blurb:"Who the company is on every docket, invoice and email.",
   tags:["Working name","Europe/Dublin","EUR"], badge:"Name to confirm", badgeKind:"warn",
   footer:"Company name is a working name, to be confirmed", action:"Edit profile",
   listLabel:"COMPANY DETAILS",
   rows:[["Company name","Murphy Print (working name, to be confirmed)"],["Owner","Sean Murphy"],["Established","1986"],
     ["Address","Unit 4, Enterprise Park, Co. Dublin"],["Phone","+353 1 555 0142"],["Jobs inbox","jobs@murphyprint.ie"],
     ["Working hours","08:00 to 17:30, Mon to Fri"],["Currency and timezone","EUR · Europe/Dublin"]]},

  {id:"agents", group:"CONTROL", title:"Agents & AI controls", icon:"agent", tint:"var(--accent)",
   blurb:"What agents may read, what they may do, and where they must stop.",
   tags:["7 agents","214 actions today","€0.41 spent"],
   heroLabel:"GLOBAL CONTROL", heroAction:"Pause every agent",
   heroText:"One switch stops every agent immediately. Anything mid-run finishes its current step and then holds.",
   footer:"Changes and invoices always need a person", action:"Review limits",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Approved agents","7 agents"],["Data agents can read","jobs, dockets, orders, email"],
     ["Actions agents can take","read · draft · pause"],["Customer changes need approval","", true],
     ["Invoices need approval before Big Red Cloud","", true],["Monthly usage cap","€30/month"]]},
  {id:"wf", group:"CONTROL", title:"Workflow controls", icon:"flow", tint:"#9fb4c8",
   blurb:"The guardrails around automation. Building workflows happens in Work.",
   tags:["Sean approves","4 workflows","Retry twice"],
   footer:"Building workflows happens in Work", action:"Open Work",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Who can create workflows","Sean, Liam"],["Pause production on spec change","", true],
     ["Approval rules","changes, invoices, rush jobs"],["Failure handling","retry twice, then notify Liam"],
     ["Global pause","all workflows", false],["Default notification","Home and email"]]},
  {id:"notif", group:"CONTROL", title:"Notifications", icon:"bell", tint:"#e07aa8",
   blurb:"Which events reach people, on which channel, and when not to.",
   tags:["Home","Email","Quiet 19:00 to 07:00"],
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Customer change detected","Sean + Emma", true],["Job at risk of missing due date","Liam", true],
     ["Superseded docket scanned","press room screen", true],["Invoice ready","Aoife", true],
     ["Online order paid","Emma", false],["Quiet hours","19:00 to 07:00"],["Morning briefing","07:30 weekdays"]]},

  {id:"integrations", group:"SYSTEMS", title:"Systems", icon:"plug", tint:"#6fcfe4",
   blurb:"PrintLogic, Big Red Cloud, Stripe, email and the website, and which way data flows.",
   tags:["5 connected","1 current system"],
   footer:"Clover / AIB stays a counter system, not an integration", action:"View systems",
   listLabel:"CONNECTIONS",
   rows:[["PrintLogic","Quotes, customers, job information"],["Big Red Cloud","Invoicing, accounting, balances"],["Stripe","Website payments"],
     ["Email","Communications, change detection"],["Website","Online orders"],["Clover / AIB","Current system, not integrated"]]},
  {id:"modules", group:"SYSTEMS", title:"Dockets & terminology", icon:"modules", tint:"#c9b98a",
   blurb:"How dockets are numbered and printed, and the words Pulse uses.",
   tags:["Docket V-numbering","QR on every ticket"],
   heroLabel:"DOCKET RULES", heroAction:"Edit docket template",
   heroText:"Every docket carries a version and a QR code. When a job changes, the old version prints as Superseded and the QR opens the current one.",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Print QR on dockets","", true],["Mark superseded versions","", true],["Job stages","10 stages, quote to invoiced"],
     ["Production resources","Digital Press 1, Digital Press 2, Large Format, Finishing, Guillotine"],
     ["Sign-off strip","Artwork · Production · Finishing · QC · Dispatch"],["Job number format","J-10xxx"]]},
  {id:"health", group:"SYSTEMS", title:"Data health", icon:"health", tint:"#e2705c",
   blurb:"What is wrong with the data, how bad it is, and the fix.",
   tags:["4 issue types","19 records affected"], badge:"6 duplicates", badgeKind:"warn",
   footer:"Last scanned 12 minutes ago", action:"Fix 2 automatically",
   listLabel:"ISSUES FOUND",
   trend:[64,52,41,33,27,22,19],
   bySeverity:[["High","3",RED],["Medium","10",AMBER],["Low","6",DIM]],
   issues:[["Duplicate customers","6","medium","Same customer in PrintLogic twice under different spellings","Merge"],
     ["Missing billing email","3","high","Account customers with no invoice email for Big Red Cloud","Fix automatically"],
     ["Artwork without a job","4","medium","Customer uploads not yet matched to an order","Review"],
     ["Old dockets still in use","0","low","No superseded docket scanned this week","Review"],
     ["Counter payments not marked","6","low","Clover payments not yet marked against a job","Review"]],
   rows:[]},

  {id:"security", group:"GOVERNANCE", title:"Security", icon:"lock", tint:"#8fa6ff",
   blurb:"Sign-in, sessions, devices and the keys that reach the API.",
   tags:["2FA enforced","3 API keys"],
   footer:"No open recommendations", action:"Review",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Two-factor authentication","enforced", true],["Login policies","30-day session"],["Active sessions","9"],
     ["Press room shared screen","view only", true],["Security alerts","on", true],["API keys","PrintLogic, Big Red Cloud, Stripe"],
     ["Data retention rules","7 years"]]},
  {id:"audit", group:"GOVERNANCE", title:"Audit log", icon:"audit", tint:"#9d8cf5",
   blurb:"A locked history of who changed what. Searchable, exportable, never editable.",
   tags:["Append-only","7-year retention"],
   footer:"Nobody can edit or delete entries", action:"Export",
   listLabel:"WHAT IS RECORDED",
   rows:[["Change approvals","14 this month"],["Docket versions","211"],["Invoices sent to Big Red Cloud","186"],
     ["Permission changes","3"],["Agent actions","1,640"],["Data exports","2"]]},
  {id:"datamgmt", group:"GOVERNANCE", title:"Data management", icon:"data", tint:"#7fc9b0",
   blurb:"Import, export, restore and, carefully, delete.",
   tags:["Backup 02:00","30-day restore"],
   footer:"Last backup completed 02:00 today", action:"Run backup",
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Import data","CSV, PrintLogic"],["Export data","full or per job"],["Backup status","healthy · 02:00 daily"],
     ["Restore previous versions","30 days available"],["Merge records","6 candidates"],
     ["Delete company data","requires two admins"]]},

  {id:"brand", group:"EXPERIENCE", title:"Branding", icon:"brand", tint:"var(--accent)",
   blurb:"Logo, accent colours, docket and email templates.",
   tags:["Ink and paper","3 templates"],
   listLabel:"WHAT YOU CONTROL HERE",
   rows:[["Company logo","to be supplied"],["Accent colours","ink · paper · cyan · magenta · yellow"],
     ["Email templates","3"],["Docket template","V-numbered with QR"],["Agent appearance","7 agents"]]},
  {id:"appearance", group:"EXPERIENCE", title:"Appearance & themes", icon:"brand", tint:"#6fcfe4",
   blurb:"Pick a light or dark theme for how Pulse looks to you.",
   tags:["13 themes","9 dark","4 light"],
   listLabel:"THEMES", rows:[]}
];
const ADMIN_GROUPS = [
  ["ORGANISATION", "repeat(3,1fr)"],
  ["CONTROL", "repeat(3,1fr)"],
  ["SYSTEMS", "repeat(3,1fr)"],
  ["GOVERNANCE", "repeat(3,1fr)"],
  ["EXPERIENCE", "repeat(3,1fr)"]
];

/* ---- activity feeds (Murphy Print) ----
   The live feed is built from the demo store's events (src/demo/data.ts EVENTS
   plus whatever approvals and invoice syncs append), so nothing here drifts. */
const SRC_TINT = {PrintLogic:"#6fcfe4", "Big Red Cloud":"#e7c35a", Stripe:"#9d8cf5", Email:"#e07aa8",
  Website:"#8fd6a8", Pulse:"var(--accent)", Agent:"var(--accent)"};
const SRC_ABBR = {PrintLogic:"PL", "Big Red Cloud":"BR", Stripe:"ST", Email:"EM", Website:"WB", Pulse:"PU", Agent:"AI"};

const DATA_EVENTS = [];
const PEOPLE_EVENTS = [];
const AI_EVENTS = [];

const STREAM_DEFS = [
  {id:"data", title:"Systems", sub:"PrintLogic, Stripe, Email, Big Red Cloud", pool:DATA_EVENTS, every:3200,
   tint:"#6ad0f0", icon:"M4.5 7.5c0-1.7 3.4-3 7.5-3s7.5 1.3 7.5 3-3.4 3-7.5 3-7.5-1.3-7.5-3Z M4.5 7.5v9c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-9 M4.5 12c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3"},
  {id:"people", title:"People", sub:"What the team did on the floor", pool:PEOPLE_EVENTS, every:6400,
   tint:"#f0c04b", icon:"M12 12.5a3.6 3.6 0 1 0 0-7.2 3.6 3.6 0 0 0 0 7.2Z M5 20.2c.9-3.1 3.6-4.9 7-4.9s6.1 1.8 7 4.9"},
  {id:"ai", title:"Agents", sub:"Dockets, changes, orders, invoices", pool:AI_EVENTS, every:4600,
   tint:"var(--accent)", icon:"M2 12h4l2.5-6 3.5 12 3-8 2 2h5"}
];

const NAV = [
  {label:"Home", icon:"helios", page:"Home"},
  {label:"Jobs", icon:"navJobs", page:"Jobs", dot:true},
  {label:"Production", icon:"navProduction", page:"Production"},
  {label:"Online Orders", icon:"navOnline", page:"Online Orders"},
  {label:"Customers", icon:"navCustomers", page:"Customers"},
  {label:"Finance", icon:"navFinance", page:"Finance"},
  {divider:true},
  {label:"Agents", icon:"navAgents", page:"Agents"},
  {label:"Dashboard", icon:"navDash", page:"Dashboard"},
  {label:"Work", icon:"navWork", page:"Work"},
  {label:"Records", icon:"navRecords", page:"Records"},
  {label:"Activity", icon:"pulseLine", page:"Activity", dot:true}
];

/* Inbox items follow the real InboxItem shape: what happened, why it matters, what I can do.
   `target` says where a click goes in the print modules; `live` hides an item
   once the store says it is dealt with (CR-118 decided, J-10473 synced). */
const ITEMS = {
  change:{kind:"Approval", importance:"critical", icon:ICONS.approvals, age:"11:27", target:"change",
    title:"J-10482 · Byrne & Co: specification change",
    why:"Customer asked for 2,000 cards and 5 names (was 1,000 / 2). Artwork paused pending your approval.",
    detail:"Change Control read Claire Byrne's email at 11:24, extracted the new quantity and names, paused artwork and production, and prepared CR-118. Approving creates Docket V3 and marks V2 superseded; the revised quote (€475) goes back to PrintLogic.",
    actionLabel:"Review change", secondaryLabel:"Open job", group:"Approvals",
    fields:[{k:"Change",v:"CR-118"},{k:"Quantity",v:"1,000 → 2,000"},{k:"Names",v:"2 → 5"},{k:"Value",v:"€210 → €475"}],
    history:[{when:"Today 11:24",text:"Email received from Claire Byrne"},{when:"Today 11:25",text:"Change Control paused artwork and production"},{when:"Today 11:27",text:"Approval requested from Sean Murphy"}]},
  artwork:{kind:"Alert", importance:"high", icon:ICONS.health, age:"2d", target:"job:J-10470",
    title:"J-10470 · Dublin Dental Centre: awaiting artwork",
    why:"No files from the customer for 2 days. Tomorrow's 09:00 slot on Digital Press 2 is at risk.",
    detail:"10,000 appointment cards (€780). Emma Walsh chased by email yesterday. If files arrive by 16:00 today the job holds its slot; after that Production Agent will move it to Thursday.",
    actionLabel:"Open job", secondaryLabel:"Chase customer", group:"Alerts",
    fields:[{k:"Job",v:"J-10470"},{k:"Quantity",v:"10,000"},{k:"Due",v:"Tomorrow 09:00"},{k:"Value",v:"€780"}],
    history:[{when:"Fri 25 Sep",text:"Quote Q-2471 approved, job created"},{when:"Yesterday 15:10",text:"Emma Walsh chased artwork by email"},{when:"Today 10:31",text:"Ops Watchdog flagged deadline risk"}]},
  invoice:{kind:"Approval", importance:"normal", icon:ICONS.insights, age:"13:06", target:"finance",
    title:"J-10473 · Summit Property Partners: €1,640 ready to invoice",
    why:"Completed and passed QC at 13:03. Approve to send to Big Red Cloud, no re-keying.",
    detail:"500 presentation folders. Finance Agent has matched the job to quote Q-2473 and prepared the invoice lines. Pulse sends them to Big Red Cloud; Big Red Cloud stays the ledger.",
    actionLabel:"Review invoice", secondaryLabel:"Open job", group:"Approvals",
    fields:[{k:"Job",v:"J-10473"},{k:"Value",v:"€1,640"},{k:"Completed",v:"Today 13:03"},{k:"Ledger",v:"Big Red Cloud"}],
    history:[{when:"Today 13:03",text:"Jack Brennan completed production and QC"},{when:"Today 13:06",text:"Finance Agent moved it to Ready to Invoice"}]}
};
const ORDER = ["change","artwork","invoice"];

const eur = (n) => "€" + Math.round(n).toLocaleString("en-IE");
const ANSWERS = {
  fallback:{tool:"pulse_search", effect:"read",
    text:"I can answer from every job, docket, order and invoice Pulse holds: quotes from PrintLogic, payments from Stripe, customer email and the invoice status in Big Red Cloud. Try a job number, a customer, or ask what needs you today.",
    actions:[["What needs my approval?",1],["Which jobs might miss their deadline?",0]]}
};

/* Answers are built from the live demo store, so they agree with every screen. */
// Turns a plain-English filter name into a full dashboard area — the "primitive
// vibe-coding" bit: no real backend, just a seeded generator so the same phrase
// always produces the same numbers, with direction and vocabulary nudged by
// keywords in the text (expansion/growth trends up, risk/issue trends down, a
// region/cost/people/ops/customer word picks which metrics show).
function synthesizeCustomArea(name){
  const trimmed = (name || "").trim();
  if (!trimmed) return null;
  let seed = 0;
  for (let i = 0; i < trimmed.length; i++) seed = (seed * 31 + trimmed.charCodeAt(i)) >>> 0;
  const rnd = (n) => (((seed >>> (n % 24)) ^ (seed << ((n * 7) % 13))) >>> 0) % 997 / 997;
  const low = trimmed.toLowerCase();
  const has = (...words) => words.some(w => low.indexOf(w) > -1);
  const growth = has("expansion","growth","launch","scale","pilot","new site","open","opening","grow");
  const risk = has("risk","issue","delay","problem","complaint","fault","incident","churn","decline");
  const dir = risk ? -1 : (growth ? 1 : (rnd(2) > 0.45 ? 1 : -1));

  let vocab = "generic";
  if (has("scotland","ireland","wales","england","region","dublin","belfast","cork","galway","london","glasgow","edinburgh"))
    vocab = "region";
  else if (has("cost","spend","budget","saving","margin")) vocab = "cost";
  else if (has("staff","hiring","team","recruit","headcount")) vocab = "people";
  else if (has("supplier","stock","inventory","warehouse","fleet")) vocab = "ops";
  else if (has("customer","client","retention","account")) vocab = "customer";

  const V = {
    region:   {labels:["New enquiries","Orders won","Revenue","Site coverage"], unit:"EUR — 30 DAYS"},
    cost:     {labels:["Spend","Cost per job","Savings found","Budget used"], unit:"EUR — 30 DAYS"},
    people:   {labels:["Headcount","Open roles","Time to hire","Retention"], unit:"PEOPLE"},
    ops:      {labels:["Stock cover","Lead time","Stockouts","Reorders raised"], unit:"DAYS"},
    customer: {labels:["Active accounts","Repeat rate","Churn","NPS"], unit:"ACCOUNTS"},
    generic:  {labels:["Volume","Rate","Cost","Coverage"], unit:"ACTIVITY — 30 DAYS"}
  }[vocab];

  const months = ["Sep","Oct","Nov","Dec","Jan","Feb","Mar","Apr","May","Jun","Jul","Aug"];
  let v0 = 40 + Math.floor(rnd(1) * 220);
  const chart = months.map((m, i) => {
    v0 = Math.max(8, Math.round(v0 * (1 + dir * (0.03 + rnd(i + 3) * 0.07))));
    return [m, v0, String(v0)];
  });
  const metrics = V.labels.map((label, i) => {
    const val = 20 + Math.floor(rnd(i + 5) * 400);
    const pct = 2 + Math.round(rnd(i + 9) * 18);
    const up = dir > 0 ? rnd(i + 12) > 0.25 : rnd(i + 12) > 0.7;
    const bars = [0,1,2,3,4,5,6,7,8].map(k => 0.3 + rnd(i * 3 + k) * 0.7);
    return [label, i === 1 ? pct + "%" : String(val), (up ? "+" : "\u2212") + pct + (i === 1 ? "pt" : "%"), up ? "up" : "down", "vs last month", bars];
  });
  const capName = trimmed.replace(/\b\w/g, c => c.toUpperCase());
  const split = [
    [capName + " \u2014 direct", String(Math.round(v0 * 0.5)), "48%", 1],
    ["Existing pipeline", String(Math.round(v0 * 0.3)), "31%", 0],
    ["Everything else", String(Math.round(v0 * 0.2)), "21%", 0]
  ];
  const table = [1,2,3].map(w => [capName + " \u2014 week " + w, String(20 + Math.floor(rnd(20 + w) * 200)),
    (dir > 0 ? "+" : "\u2212") + (3 + Math.floor(rnd(23 + w) * 14)) + "%", "Auto-tagged from records mentioning \u201c" + low + "\u201d"]);
  table.push(["Everything else", String(20 + Math.floor(rnd(30) * 200)), "\u2014", "Baseline"]);
  return {
    id: trimmed, label: capName, color: "var(--accent)", owner: "CUSTOM FILTER",
    description: "Generated from \u201c" + trimmed + "\u201d \u2014 a plain-English filter, not a registered metric set. Refine it and Pulse will tighten this up.",
    kind: "columns", chartTitle: capName + " over time", chartUnit: V.unit,
    chart, splitTitle: "Where \u201c" + low + "\u201d shows up", split,
    tableCols: ["Item","Value","Change","Note"], table,
    metrics, legend: [capName, "Pipeline", "Other"]
  };
}

function pickAnswer(q){
  const s = (q || "").toLowerCase();
  const st = demoStore.get(), m = demoMetrics(st);
  const job = (id) => st.jobs.find(j => j.id === id) || {};
  if (/deadline|miss|late|risk|on time|behind/.test(s)){
    const d = job("J-10470"), n = job("J-10479");
    return {tool:"pulse_jobs_risk", effect:"read",
      text:"Two jobs could miss their deadline. J-10470 Dublin Dental Centre is still waiting on artwork from the customer (2 days now); files need to be in by 16:00 today to hold tomorrow's 09:00 slot on Digital Press 2. J-10479 Nova Electrical, 5,000 A5 flyers, is printing on Digital Press 1 and due today at 16:00. It is on track but has no slack.",
      cols:["Job","Customer","Due","Risk"],
      rows:[["J-10470", d.customer || "Dublin Dental Centre", "Files by 16:00", "Awaiting artwork"],
            ["J-10479", n.customer || "Nova Electrical", "Today 16:00", "Printing, tight"]],
      actions:[["Open J-10470",1,() => demoStore.openJob("J-10470")],["Open production queue",0,() => demoStore.go("Production","queue")]]};
  }
  if (/approv|decision|sign.?off|needs me|need me|waiting on me/.test(s)){
    const rows = [], parts = [];
    if (st.changeState === "pending"){ rows.push(["CR-118 · J-10482","Byrne & Co Solicitors","1,000 → 2,000 cards, 2 → 5 names","€475"]); parts.push("CR-118, the Byrne & Co change on J-10482 (1,000 → 2,000 cards, 2 → 5 names)"); }
    if (!st.synced.includes("J-10473")){ rows.push(["Invoice · J-10473","Summit Property Partners","Send to Big Red Cloud","€1,640"]); parts.push("the €1,640 invoice for J-10473 Summit Property Partners"); }
    rows.push(["Rush · J-10488","Castle Events","Capacity for tomorrow 10:00","€610"]); parts.push("rush capacity for J-10488 Castle Events, due tomorrow 10:00 on Large Format");
    return {tool:"pulse_approvals", effect:"read",
      text:rows.length + " things need your approval: " + parts.join("; ") + ". Nothing moves on any of them until you say yes.",
      cols:["Item","Customer","Decision","Value"], rows,
      actions:(st.changeState === "pending" ? [["Review CR-118",1,() => demoStore.openChange()]] : [])
        .concat([["Open approvals",st.changeState === "pending" ? 0 : 1,() => demoStore.go("Work")]])};
  }
  if (/invoic|bill|big red|ready to/.test(s)){
    const rti = m.rti;
    if (!rti.length) return {tool:"pulse_finance", effect:"read", text:"Nothing is waiting to be invoiced. Every completed job has been sent to Big Red Cloud.", actions:[["Open Finance",1,() => demoStore.go("Finance","invoices")]]};
    return {tool:"pulse_finance_ready", effect:"read",
      text:rti.length + " completed jobs worth " + eur(m.rtiValue) + " can be invoiced today. Each one is matched to its PrintLogic quote, so approving sends the lines straight to Big Red Cloud without anyone retyping them.",
      cols:["Job","Customer","Completed","Value"],
      rows:rti.map(j => [j.id, j.customer, j.completed || j.due, eur(j.value)]),
      actions:[["Open Ready to Invoice",1,() => demoStore.go("Finance","ready")]]};
  }
  if (/artwork|proof|design|files/.test(s)){
    const a = m.artwork;
    return {tool:"pulse_jobs_find", effect:"read",
      text:a.length + " jobs are in artwork right now, all with Sarah Byrne. J-10482 is paused on the Byrne & Co change and J-10470 is still waiting on files from the customer; the rest are moving.",
      cols:["Job","Customer","Product","Status"],
      rows:a.map(j => [j.id, j.customer, j.product, j.status]),
      actions:[["Open artwork queue",1,() => demoStore.go("Production","artwork")]]};
  }
  if (/prepaid|online|website|stripe|web order/.test(s)){
    const month = ONLINE_TREND.slice(-4).reduce((n, w) => n + w.v, 0);
    return {tool:"pulse_online_orders", effect:"read",
      text:"This week the website brought in " + m.onlineCount + " orders worth " + eur(m.onlineRevenue) + ", every one paid through Stripe before production. Over the last four weeks that is " + eur(month) + " prepaid, up from " + eur(ONLINE_TREND.slice(0, 4).reduce((n, w) => n + w.v, 0)) + " in the four weeks to 27 July. Each order created its own job and docket with no office admin.",
      cols:["Order","Customer","Product","Paid"],
      rows:ORDERS.slice(0, 4).map(o => [o.id, o.customer, o.product, eur(o.amount)]),
      actions:[["Open Online Orders",1,() => demoStore.go("Online Orders","overview")]]};
  }
  if (/change|byrne|10482|cr-118/.test(s)){
    return {tool:"pulse_change_control", effect:"read",
      text: st.changeState === "pending"
        ? "Byrne & Co asked to change J-10482 from 1,000 cards / 2 names to 2,000 / 5 names. Artwork and production are paused and CR-118 is waiting for your approval. The requote is €475, up from €210."
        : "CR-118 is " + st.changeState + ". " + (st.changeState === "approved" ? "Docket V3 is current, V2 is superseded, and Sarah Byrne has the artwork revision." : "J-10482 continues at 1,000 cards, 2 names."),
      actions:[["Open the change",1,() => demoStore.openChange()],["Open J-10482",0,() => demoStore.openJob("J-10482")]]};
  }
  if (/changed today|today|brief|morning|what.?s happening|summar/.test(s)){
    return {tool:"pulse_briefing", effect:"read",
      text:"Today so far: " + m.liveCount + " live jobs worth " + eur(m.liveValue) + ". " + m.artwork.length + " in artwork, " + m.production.length + " in production, " + m.rti.length + " ready to invoice (" + eur(m.rtiValue) + "). " + m.onlineCount + " online orders worth " + eur(m.onlineRevenue) + " arrived this week, all prepaid. " + (st.changeState === "pending" ? "The Byrne & Co change on J-10482 is waiting for you." : "The Byrne & Co change has been decided."),
      actions:[["What needs my approval?",1],["Which jobs might miss their deadline?",0]]};
  }
  return ANSWERS.fallback;
}

const ORGS = [
  ["Harbour View Hotel","Customer","€2,410","23 days","active"],
  ["Fitzgerald Auctioneers","Customer","€1,860","4 days","active"],
  ["Wexford Motor Group","Customer","€1,640","30 days","watch"],
  ["Castle Events","Customer","€1,395","20 days","watch"],
  ["Nova Electrical","Customer","€935","12 days","active"],
  ["Byrne & Co Solicitors","Customer","€0","0 days","active"]
];
const TEAMS = [
  ["Studio","1 member","Sarah Byrne","artwork and proofs"],
  ["Press room","2 members","Liam O'Connor","production queue"],
  ["Finishing & dispatch","1 member","Jack Brennan","finishing, QC, dispatch"],
  ["Front office","3 members","Sean Murphy","customers, accounts, approvals"]
];
const LOCATIONS = [
  ["Front office","Unit 4, Enterprise Park","3 staff","active"],
  ["Studio and press room","Unit 4, Enterprise Park","4 staff","active"]
];
const AGENT_DEFS = [
  {id:"briefing", name:"Briefing", shape:"crown-pebble", tint:"#191c1f", state:"complete",
   role:"Reads every job, docket, order and invoice each morning and tells Sean what matters",
   when:"07:30", preview:"17 jobs are live. Two need attention.",
   stats:[["Runs this week","6"],["Last run","07:30"],["Items flagged","2"]],
   sources:["PrintLogic","Big Red Cloud","Stripe","Email","Website"],
   skills:["Summarise jobs","Read dockets","Read invoices","Post briefing"],
   runs:[["07:30","Morning brief posted to Home"],["Yesterday 07:30","Morning brief: 3 items"],["Fri 07:30","Weekly numbers for Sean"]],
   thread:[
     {kind:"stamp", text:"Today 07:30"},
     {kind:"routine", text:"Ran routine", routine:"Morning operating brief"},
     {kind:"agent", text:"Morning Sean. 17 jobs are live. Two need attention."},
     {kind:"agent", text:"J-10482: Byrne & Co changed from 1,000 cards / 2 names to 2,000 / 5 names. Artwork has been paused and the revised docket is waiting for your approval."},
     {kind:"agent", text:"J-10470: Dublin Dental Centre is still waiting on customer artwork and is now at risk of missing tomorrow's production slot."},
     {kind:"agent", text:"Four completed jobs worth €4,870 are ready to invoice. Eleven online orders worth €4,620 have been paid through Stripe this week.", lines:[
       {k:"Live", v:"17 jobs · €12,840 of work"},
       {k:"Due today", v:"6 jobs · J-10479 Nova Electrical at 16:00 is the tight one"},
       {k:"Ready to invoice", v:"4 jobs · €4,870 · J-10473 Summit is the largest at €1,640"}]},
     {kind:"user", text:"Who's chasing Dublin Dental?"},
     {kind:"agent", text:"Emma Walsh emailed Dr. Ruth Keane yesterday at 15:10. No reply yet. I can draft a second chase for Emma to send, or ask Production Agent to hold the slot until 16:00."}
   ]},
  {id:"ops", name:"Ops Watchdog", shape:"shield", tint:"#2b1b1e", state:"attention",
   role:"Watches for late jobs, stuck stages, docket version conflicts, production risks and missing approvals",
   when:"10:31", preview:"J-10470 has waited 2 days on artwork.",
   stats:[["Checks today","184"],["Open flags","2"],["Cleared this week","9"]],
   sources:["PrintLogic","Email","Pulse jobs","Dockets"],
   skills:["Read jobs","Read dockets","Compare versions","Raise alert"],
   runs:[["11:25","Flagged J-10482: printed Docket V2 still on the floor"],["10:31","Flagged J-10470: no artwork for 2 days"],["09:00","Stage check: 17 jobs, 0 stuck over SLA"]],
   thread:[
     {kind:"stamp", text:"Today 10:31"},
     {kind:"agent", text:"J-10470 Dublin Dental Centre has been in Awaiting Files for 2 days. It is booked on Digital Press 2 tomorrow at 09:00, so files are needed by 16:00 today to hold the slot."},
     {kind:"stamp", text:"Today 11:25"},
     {kind:"agent", text:"Version conflict on J-10482. A printed Docket V2 is with the artwork sample, but Change Control has paused the job for CR-118. Anyone scanning the V2 QR code is told the job is on hold."},
     {kind:"user", text:"Anything else stuck?"},
     {kind:"agent", text:"No. Every other live job moved stage within its normal time today. J-10479 Nova Electrical is the only production job with under an hour of slack."}
   ]},
  {id:"docket", name:"Docket Agent", shape:"control-cube", tint:"#16241f", state:"working",
   role:"Creates and maintains digital dockets, versions them, and keeps the printed copy honest via QR",
   when:"12:15", preview:"Docket V1 generated for J-10486.",
   stats:[["Dockets today","9"],["Versions this week","23"],["Re-keying avoided","187"]],
   sources:["PrintLogic","Website","Pulse jobs"],
   skills:["Create docket","Version docket","Mark superseded","Print ticket"],
   runs:[["12:15","Docket V1 for J-10486 (Greenline Café, online order)"],["09:08","Docket V1 for J-10482 from Q-2487"],["08:42","Docket V1 for J-10487 (Kavanagh Physio)"]],
   thread:[
     {kind:"stamp", text:"Today 09:06"},
     {kind:"agent", text:"Quote Q-2487 approved in PrintLogic. Created J-10482 for Byrne & Co Solicitors and generated Docket V1: 1,000 business cards, 2 names, 400gsm silk, matt laminate. Nothing was retyped."},
     {kind:"stamp", text:"Today 12:15"},
     {kind:"agent", text:"Online order O-8046 paid through Stripe. Created J-10486 for Greenline Café and generated Docket V1: 500 folded menus, A4 to A5, gloss laminate."},
     {kind:"user", text:"What happens to the paper docket when Byrne & Co's change goes through?"},
     {kind:"agent", text:"On approval I generate Docket V3 and mark V2 superseded. The printed V2 stays with the sample, but its QR code opens the live job and shows V3 as current, so nobody prints from the old spec."}
   ]},
  {id:"change", name:"Change Control", shape:"glass-visor", tint:"#241b2e", state:"waiting",
   role:"Reads customer email for specification changes and prepares structured change requests",
   when:"11:27", preview:"CR-118 is waiting for your approval.",
   stats:[["Emails read today","42"],["Changes detected","1"],["Avg. prep time","3 min"]],
   sources:["Email","PrintLogic","Dockets"],
   skills:["Read email","Extract specification","Compare to docket","Pause workflow","Request approval"],
   runs:[["11:27","CR-118 sent to Sean for approval"],["11:25","Paused artwork and production on J-10482"],["Thu","CR-117 Hartley Accountants: folder stock change, approved"]],
   thread:[
     {kind:"stamp", text:"Today 11:24"},
     {kind:"agent", text:"Claire Byrne replied on J-10482: \"can we go to 2,000 cards and add three more names?\""},
     {kind:"agent", text:"Change detected on J-10482 (confidence 97%):", lines:[
       {k:"Quantity", v:"1,000 → 2,000"},
       {k:"Names", v:"2 → 5"},
       {k:"Artwork", v:"revision required"},
       {k:"Production", v:"temporarily paused"},
       {k:"Commercial", v:"€210 → €475, requote needs approval"}]},
     {kind:"agent", text:"I have paused artwork and production and prepared CR-118. It is waiting for your yes. Approving creates Docket V3 and hands the revision to Sarah Byrne."}
   ]},
  {id:"production", name:"Production Agent", shape:"low-dome", tint:"#1b2430", state:"working",
   role:"Keeps the production queue, press priorities and deadlines in order",
   when:"12:40", preview:"J-10479 on Digital Press 1, finishing by 15:30.",
   stats:[["In production","7"],["Due today","6"],["Press load","78%"]],
   sources:["Pulse jobs","Dockets","Schedule"],
   skills:["Read queue","Re-slot job","Notify operator","Check capacity"],
   runs:[["12:40","Re-ordered Digital Press 2 around J-10476"],["11:25","Held J-10482 slot on Digital Press 1"],["08:30","Built today's press plan"]],
   thread:[
     {kind:"stamp", text:"Today 08:30"},
     {kind:"agent", text:"Today's plan: 7 jobs in production across Digital Press 1, Digital Press 2, Large Format, Finishing and the guillotine. Six are due today."},
     {kind:"agent", text:"J-10479 Nova Electrical is the tightest: 5,000 A5 flyers on Digital Press 1, due 16:00. Niall started it at 08:55 and it should be off the press by 13:30, boxed by 15:30."},
     {kind:"user", text:"Can we take the Castle Events rush for tomorrow 10:00?"},
     {kind:"agent", text:"Yes if it runs on Large Format first thing tomorrow: 150 A2 posters is about 90 minutes. It needs your approval because it pushes J-10484 back an hour. It is in Work, under Approvals."}
   ]},
  {id:"finance", name:"Finance Agent", shape:"executive-capsule", tint:"#2a2118", state:"waiting",
   role:"Moves completed work to invoicing, prepares invoices for Big Red Cloud and tracks payment status",
   when:"13:06", preview:"€1,640 from Summit is ready for Big Red Cloud.",
   stats:[["Ready to invoice","€4,870"],["Synced this month","61"],["Outstanding","€8,240"]],
   sources:["Big Red Cloud","PrintLogic","Stripe","Pulse jobs"],
   skills:["Read completed jobs","Prepare invoice","Send to Big Red Cloud","Read balances"],
   runs:[["13:06","Moved J-10473 to Ready to Invoice"],["10:25","Moved J-10475 to Ready to Invoice"],["Yesterday","Synced 5 invoices to Big Red Cloud"]],
   thread:[
     {kind:"stamp", text:"Today 13:06"},
     {kind:"agent", text:"J-10473 Summit Property Partners passed QC at 13:03. I've matched it to quote Q-2473 and prepared the invoice: 500 presentation folders, €1,640."},
     {kind:"agent", text:"Four completed jobs worth €4,870 are ready to invoice:", lines:[
       {k:"J-10473", v:"Summit Property Partners · €1,640"},
       {k:"J-10471", v:"Brightside Dental Group · €1,250"},
       {k:"J-10468", v:"Lennon Architects · €1,180"},
       {k:"J-10475", v:"Wexford Motor Group · €800"}]},
     {kind:"agent", text:"Approving sends the lines to Big Red Cloud. Big Red Cloud stays the ledger; nothing is retyped."}
   ]},
  {id:"online", name:"Online Orders Agent", shape:"offset-pebble", tint:"#191c1f", state:"working",
   role:"Turns paid website orders into jobs and dockets with no office admin",
   when:"12:16", preview:"O-8046 paid. J-10486 created.",
   stats:[["Orders this week","11"],["Prepaid","€4,620"],["Admin touches avoided","27"]],
   sources:["Website","Stripe","PrintLogic"],
   skills:["Read orders","Confirm payment","Match customer","Create job","Queue artwork"],
   runs:[["12:15","O-8046 Greenline Café → J-10486"],["08:42","O-8045 Kavanagh Physio → J-10487"],["Yesterday 19:02","O-8044 Riverside Yoga → J-10467"]],
   thread:[
     {kind:"stamp", text:"Today 12:14"},
     {kind:"agent", text:"Website order O-8046 from Greenline Café: 500 folded menus. Stripe confirmed €428 at 12:14."},
     {kind:"agent", text:"Handled with 0 manual data entry:", lines:[
       {k:"12:15", v:"customer record matched (new customer)"},
       {k:"12:15", v:"job J-10486 created, Docket V1 generated"},
       {k:"12:16", v:"artwork check queued for Sarah Byrne"}]},
     {kind:"user", text:"How's the week looking online?"},
     {kind:"agent", text:"Eleven orders, €4,620, all paid before production. That is the best week in the last twelve; the website has grown from €1,480 a week in early July."}
   ]}
];

const KPI_DEFS = {
  revenue:{label:"Revenue MTD", value:"€48,620", delta:"+4.1%", dir:"up", hint:"September", hero:true},
  jobs:{label:"Live jobs", value:"17", delta:"+3", dir:"up", hint:"6 artwork · 7 production"},
  margin:{label:"Ready to invoice", value:"€4,870", delta:"4 jobs", dir:"up", hint:"completed, not invoiced"},
  overdue:{label:"Debtors", value:"€8,240", delta:"+€935", dir:"down", hint:"5 accounts"},
  dupes:{label:"Duplicate entries avoided", value:"187", delta:"+41", dir:"up", hint:"this week · demo estimate"},
  cash:{label:"Online prepaid", value:"€4,620", delta:"+12.4%", dir:"up", hint:"11 orders · Stripe"},
  hours:{label:"Admin hours saved", value:"12.4h", delta:"+2.1h", dir:"up", hint:"this week · demo estimate"},
  turnaround:{label:"Avg turnaround", value:"3.4 days", delta:"−0.6d", dir:"up", hint:"quote approved to ready"}
};
const ASPECT_DEFS = [
  {id:"executive", label:"Executive", color:"var(--accent)", owner:"SEAN MURPHY", description:"The whole building on one page: jobs, sales, cash and the admin Pulse took away.",
   kind:"columns", chartTitle:"Jobs completed per week", chartUnit:"JOBS",
   chart:[["6 Jul",44,"44"],["13 Jul",47,"47"],["20 Jul",45,"45"],["27 Jul",49,"49"],["3 Aug",41,"41"],["10 Aug",46,"46"],["17 Aug",50,"50"],["24 Aug",48,"48"],["31 Aug",51,"51"],["7 Sep",49,"49"],["14 Sep",53,"53"],["21 Sep",52,"52"]],
   splitTitle:"Where this week's jobs came from",
   split:[["PrintLogic quotes","41","79%",1],["Website orders","11","21%",0]],
   tableCols:["Customer","12-month revenue","Change","Terms"],
   table:[["Harbour View Hotel","€17,350","+8.2%","30 days"],["Byrne & Co Solicitors","€14,860","+5.6%","30 days"],["Fitzgerald Auctioneers","€12,970","−2.4%","30 days"],["Summit Property Partners","€11,240","+11.9%","30 days"]],
   metrics:[["Revenue MTD","€48,620","+4.1%","up","September to date",[.5,.62,.55,.7,.6,.74,.66,.8,1]],
     ["Jobs this week","52","+3","up","50+ every week",[.6,.66,.62,.7,.58,.68,.74,.72,.78]],
     ["Quote conversion","58%","+4pt","up","64 quotes issued",[.44,.5,.48,.52,.5,.55,.54,.56,.58]],
     ["Duplicate entries avoided","187","+41","up","demo estimate · this week",[.3,.4,.46,.55,.6,.68,.74,.86,1]]]},
  {id:"jobs", label:"Jobs", color:"#6fcfe4", owner:"LIAM O'CONNOR", description:"Every live job by stage, from artwork to ready to invoice.",
   kind:"rows", rows:[["Artwork","5 jobs",5],["Artwork approval","1 job",1],["Production","5 jobs",5],["Finishing","2 jobs",2],["Ready to invoice","4 jobs",4]],
   chartTitle:"Live jobs by stage", chartUnit:"17 LIVE",
   chart:[["Mon",15,"15"],["Tue",16,"16"],["Wed",18,"18"],["Thu",17,"17"],["Fri",14,"14"],["Sat",12,"12"],["Mon",17,"17"]],
   splitTitle:"Live jobs by source",
   split:[["PrintLogic quotes","15","88%",1],["Website orders","2","12%",0]],
   tableCols:["Job","Value","Due","Stage"],
   table:[["J-10482 · Byrne & Co","€210","Thu 1 Oct","Change pending"],["J-10470 · Dublin Dental","€780","Tomorrow 09:00","Awaiting files"],["J-10479 · Nova Electrical","€865","Today 16:00","Printing"],["J-10488 · Castle Events","€610","Tomorrow 10:00","Rush"]],
   metrics:[["Live jobs","17","+3","up","right now",[.6,.64,.7,.66,.58,.5,.68,.66,.7]],
     ["Due today","6","+1","up","before 17:30",[.4,.5,.46,.5,.56,.44,.5,.54,.6]],
     ["At risk","2","+1","down","J-10482, J-10470",[.2,.2,.4,.2,.2,.4,.2,.4,.4]],
     ["Changes pending","1","+1","down","CR-118 awaiting Sean",[0,.2,0,0,.2,0,0,0,.2]]]},
  {id:"production", label:"Production", color:"#7fc9b0", owner:"LIAM O'CONNOR", description:"Load on each press and finishing station, and what is queued behind it.",
   kind:"stacked", legend:["Digital presses","Large Format","Finishing"],
   stacked:[["Mon",[14,2,7]],["Tue",[13,3,6]],["Wed",[15,1,8]],["Thu",[12,4,7]],["Fri",[14,2,6]],["Mon",[15,3,8]]],
   chartTitle:"Booked hours by day", chartUnit:"HOURS",
   chart:[["Mon",23,"23"],["Tue",22,"22"],["Wed",24,"24"],["Thu",23,"23"],["Fri",22,"22"],["Mon",26,"26"]],
   splitTitle:"Booked today by resource",
   split:[["Digital Press 1","7.9","88%",1],["Digital Press 2","7.5","83%",0],["Finishing","7.5","83%",0],["Large Format","2.8","31%",0]],
   tableCols:["Resource","Now","Load","Next"],
   table:[["Digital Press 1","J-10479 flyers","+88%","J-10480 at 14:00"],["Digital Press 2","J-10476 brochures","+83%","J-10474 at 13:00"],["Finishing","J-10481 trimming","+83%","J-10483 at 12:00"],["Large Format","Idle","+31%","J-10488 at 15:00"]],
   metrics:[["Artwork queue","6","+1","down","Sarah Byrne",[.5,.44,.6,.5,.56,.62,.5,.58,.6]],
     ["Production queue","7","+2","up","presses and finishing",[.4,.5,.46,.6,.55,.6,.64,.7,.74]],
     ["Due today","6","+1","up","before 17:30",[.4,.5,.46,.5,.56,.44,.5,.54,.6]],
     ["Completed today","7","+2","up","passed QC",[.3,.4,.5,.44,.6,.56,.64,.7,.8]]]},
  {id:"online", label:"Online", color:"#9fb4ff", owner:"EMMA WALSH", description:"Website orders, paid through Stripe before production, created as jobs with no office admin.",
   kind:"area", chartTitle:"Online order revenue, last 12 weeks", chartUnit:"EUR",
   chart:[["6 Jul",1480,"€1,480"],["13 Jul",1720,"€1,720"],["20 Jul",1610,"€1,610"],["27 Jul",2050,"€2,050"],["3 Aug",2240,"€2,240"],["10 Aug",2130,"€2,130"],["17 Aug",2710,"€2,710"],["24 Aug",3020,"€3,020"],["31 Aug",3380,"€3,380"],["7 Sep",3560,"€3,560"],["14 Sep",4110,"€4,110"],["21 Sep",4620,"€4,620"]],
   splitTitle:"Orders by product, all time",
   split:[["Business Cards","38","28%",1],["Flyers","31","22%",0],["Folded Leaflets","17","12%",0],["Posters","14","10%",0]],
   tableCols:["Order","Amount","Payment","Customer"],
   table:[["O-8046 · Folded Menus","€428","Paid","Greenline Café"],["O-8045 · A5 Flyers","€240","Paid","Kavanagh Physio"],["O-8044 · Business Cards","€387","Paid","Riverside Yoga"],["O-8043 · Flyers","€390","Paid","Delaney Plumbing"]],
   metrics:[["Online revenue","€4,620","+12.4%","up","this week · 11 orders",[.32,.37,.35,.44,.48,.46,.59,.65,.73,.77,.89,1]],
     ["Paid before production","100%","0pt","up","all Stripe",[1,1,1,1,1,1,1,1,1]],
     ["Average order","€420","+€26","up","this week",[.6,.62,.58,.66,.64,.7,.68,.72,.74]],
     ["Admin touches avoided","27","+6","up","demo estimate",[.3,.36,.4,.46,.5,.56,.62,.7,.8]]]},
  {id:"finance", label:"Finance", color:"#e7c35a", owner:"AOIFE KELLY", description:"Revenue, what is finished but not invoiced, and who owes what. Big Red Cloud stays the ledger.",
   kind:"funnel", funnel:[["Revenue MTD","€48,620","September to date",48620],["Invoiced","€43,750","sent to Big Red Cloud",43750],["Collected","€35,510","81% of invoiced",35510],["Outstanding","€8,240","5 debtors",8240]],
   chartTitle:"Revenue MTD to cash", chartUnit:"EUR",
   chart:[["Apr",51240,"€51.2k"],["May",54810,"€54.8k"],["Jun",49930,"€49.9k"],["Jul",47620,"€47.6k"],["Aug",52480,"€52.5k"],["Sep",48620,"€48.6k"]],
   splitTitle:"Debtors by customer",
   split:[["Harbour View Hotel","€2,410","29%",1],["Fitzgerald Auctioneers","€1,860","23%",0],["Wexford Motor Group","€1,640","20%",0],["Castle Events","€1,395","17%",0],["Nova Electrical","€935","11%",0]],
   tableCols:["Ready to invoice","Value","Completed","Big Red Cloud"],
   table:[["J-10473 · Summit Property","€1,640","+Today 13:03","Awaiting approval"],["J-10471 · Brightside Dental","€1,250","+Yesterday","Awaiting approval"],["J-10468 · Lennon Architects","€1,180","+Yesterday","Awaiting approval"],["J-10475 · Wexford Motor","€800","+Today 10:22","Awaiting approval"]],
   metrics:[["Revenue MTD","€48,620","+4.1%","up","September to date",[.5,.62,.55,.7,.6,.74,.66,.8,1]],
     ["Completed not invoiced","€4,870","4 jobs","up","ready for Big Red Cloud",[.4,.5,.44,.6,.5,.7,.6,.8,.9]],
     ["Debtors","€8,240","+€935","down","5 accounts",[.5,.54,.5,.6,.58,.62,.66,.7,.72]],
     ["Average job","€472","+€18","up","September",[.6,.62,.58,.64,.62,.66,.64,.68,.7]]]}
];
const FILTER_GROUPS = [
  {title:"AREA", items:["Executive","Jobs","Production","Online","Finance"]},
  {title:"SOURCE", items:["PrintLogic","Website","Stripe","Big Red Cloud","Email"]},
  {title:"TIME", items:["Today","This week","This month","Year to date"]}
];
const OPS_DEFS = [
  {id:"o1", name:"Customer Change → Controlled Revision", kind:"automation", owner:"Change Control", ownerKind:"agent", initials:"CC", hero:true,
   trigger:"Customer email", triggerKind:"event", next:"Event-based", last:"CR-118 · 11:27 today", status:"approval", rate:99, on:true, runs30:14,
   what:"Reads every customer email on a live job. When the spec changes, it builds a side-by-side comparison, pauses the affected work, asks for approval, then issues a new docket version and tells the people who need to know.",
   why:"Mid-job changes arrived by email and phone and reached the press room on a sticky note, if at all. Old dockets kept getting printed from.",
   saved:"9 hours a month",
   steps:[["Trigger","Email received on a live job"],["Detect","AI reads it and finds the specification change"],["Compare","Generate old vs new comparison"],["Pause","Pause artwork and production on the job"],["Approval","Sean approves or rejects the change","gate"],["Docket","Create the new docket version, supersede the old"],["Notify","Tell artwork, production and the customer contact"]],
   runs:[["Today 11:24","48s","partial","CR-118 · waiting on Sean","€0.03"],["Thu 11:02","41s","ok","CR-116 · J-10451 approved","€0.03"],["Tue 15:40","39s","ok","CR-115 · J-10438 rejected","€0.02"]]},
  {id:"o2", name:"Approved Quote → Job", kind:"automation", owner:"Docket Agent", ownerKind:"agent", initials:"DA",
   trigger:"PrintLogic quote approved", triggerKind:"event", next:"Event-based", last:"J-10482 · 09:06 today", status:"healthy", rate:100, on:true, runs30:148,
   what:"When a quote is approved in PrintLogic, creates the Pulse job with the customer, product and specs attached, prints Docket V1 and assigns artwork.",
   why:"Every approved quote was copied by hand onto a paper docket, then again into the diary.",
   saved:"22 hours a month",
   steps:[["Trigger","Quote approved in PrintLogic"],["Create","Create the Pulse job from the quote"],["Docket","Generate Docket V1 with QR code"],["Assign","Assign artwork to Sarah Byrne"]],
   runs:[["Today 09:06","3s","ok","J-10482 created","€0.00"],["Today 08:12","3s","ok","J-10488 created","€0.00"],["Yesterday 16:48","2s","ok","J-10484 created","€0.00"]]},
  {id:"o3", name:"Online Order → Production", kind:"automation", owner:"Online Orders Agent", ownerKind:"agent", initials:"OO",
   trigger:"Website order paid", triggerKind:"event", next:"Event-based", last:"O-8046 → J-10486 · 12:15", status:"healthy", rate:100, on:true, runs30:44,
   what:"Takes a website order once Stripe confirms payment, matches the customer, creates the job and docket and queues the artwork check. Nobody types anything.",
   why:"Web orders were re-keyed from an email, and phone orders meant chasing card payments.",
   saved:"11 hours a month",
   steps:[["Trigger","Website order submitted"],["Payment","Stripe payment confirmed"],["Create","Create the job and match the customer"],["Docket","Generate the digital docket"],["Queue","Queue the artwork check"]],
   runs:[["Today 12:14","2s","ok","O-8046 → J-10486","€0.00"],["Today 08:41","2s","ok","O-8045 → J-10487","€0.00"],["Yesterday 19:02","3s","ok","O-8044 → J-10467","€0.00"]]},
  {id:"o4", name:"Job Complete → Invoice", kind:"automation", owner:"Finance Agent", ownerKind:"agent", initials:"FA",
   trigger:"Production complete", triggerKind:"event", next:"Event-based", last:"J-10473 · waiting on approval", status:"approval", rate:98, on:true, runs30:131,
   what:"When production and QC are signed off, moves the job to Ready to Invoice, prepares the invoice from the job record and, once approved, sends the accounting data to Big Red Cloud.",
   why:"Finished jobs were re-entered into Big Red Cloud from the paper docket, sometimes days later.",
   saved:"16 hours a month",
   steps:[["Trigger","Production complete"],["Check","QC signed off on the docket"],["Move","Move to Ready to Invoice"],["Approval","Sean or Aoife approves the invoice","gate"],["Send","Send accounting data to Big Red Cloud","external"]],
   runs:[["Today 13:06","4s","partial","J-10473 · waiting on approval","€0.00"],["Today 10:24","3s","partial","J-10475 · waiting on approval","€0.00"],["Fri 16:10","5s","ok","J-10469 synced","€0.00"]]},
  {id:"o5", name:"Morning briefing", kind:"routine", owner:"Briefing", ownerKind:"agent", initials:"BR",
   trigger:"Weekdays, 07:30", triggerKind:"schedule", next:"Tomorrow 07:30", last:"Delivered 07:31", status:"healthy", rate:100, on:true, runs30:22,
   what:"Reads every live job, change, order and invoice overnight and tells Sean the few things that need him.",
   why:"The day used to start with a walk round the building to find out what was late.",
   saved:"8 hours a month",
   steps:[["Trigger","Every weekday at 07:30"],["Find","Live jobs, changes, orders and invoices"],["Check","Drop anything already handled"],["Draft","Write the briefing"],["Send","Post to Home"]],
   runs:[["Today 07:30","21s","ok","1 briefing","€0.02"],["Fri 07:30","19s","ok","1 briefing","€0.02"],["Thu 07:30","23s","ok","1 briefing","€0.02"]]},
  {id:"o6", name:"Big Red Cloud sync check", kind:"automation", owner:"Finance Agent", ownerKind:"agent", initials:"FA",
   trigger:"Hourly, 08:00 to 18:00", triggerKind:"schedule", next:"14:00", last:"13:18 · all synced", status:"healthy", rate:100, on:true, runs30:220,
   what:"Confirms every approved invoice reached Big Red Cloud and reads customer balances back so debtors stay current.",
   why:"Mismatches between the job and the ledger used to surface at month end.",
   saved:"4 hours a month",
   steps:[["Trigger","Every hour in working hours"],["Find","Invoices approved since the last run"],["Check","Each one exists in Big Red Cloud"],["Update","Refresh customer balances"]],
   runs:[["Today 13:18","6s","ok","balances refreshed","€0.00"],["Today 12:00","5s","ok","no changes","€0.00"],["Today 11:00","5s","ok","no changes","€0.00"]]},
  {id:"o7", name:"Debtor review", kind:"report", owner:"Finance Agent", ownerKind:"agent", initials:"FA",
   trigger:"Fridays, 10:00", triggerKind:"schedule", next:"Fri 10:00", last:"Sent to Aoife", status:"healthy", rate:96, on:true, runs30:4,
   what:"Lists who owes what from Big Red Cloud, flags anything past terms and drafts a reminder for Aoife to check.",
   why:"Overdue accounts like Castle Events were only noticed when someone happened to look.",
   saved:"5 hours a month",
   steps:[["Trigger","Every Friday at 10:00"],["Find","Balances from Big Red Cloud"],["Check","Flag anything past terms"],["Draft","Draft reminders"],["Approval","Aoife reviews before anything is sent","gate"]],
   runs:[["Fri 10:00","14s","ok","5 debtors · 1 overdue","€0.01"],["Fri 18 Sep 10:00","12s","ok","4 debtors","€0.01"]]},
  {id:"o8", name:"Paper stock check", kind:"task", owner:"Liam O'Connor", ownerKind:"person", initials:"LO",
   trigger:"Mondays, 08:00", triggerKind:"schedule", next:"Mon 08:00", last:"2 stocks low", status:"healthy", rate:94, on:true, runs30:4,
   what:"Compares paper and board on the shelf against the week's dockets, so a job never waits on stock.",
   why:"A 400gsm silk shortage held up two folder jobs in August.",
   saved:"3 hours a month",
   steps:[["Trigger","Every Monday at 08:00"],["Find","Stock needed by this week's dockets"],["Check","Against what is on the shelf"],["Notify","Liam orders anything short"]],
   runs:[["Mon 08:00","9s","ok","400gsm silk, 350gsm uncoated low","€0.00"],["Mon 21 Sep 08:00","8s","ok","all stocked","€0.00"]]},
  {id:"o9", name:"Deadline watch", kind:"routine", owner:"Ops Watchdog", ownerKind:"agent", initials:"OW",
   trigger:"Every 30 minutes", triggerKind:"schedule", next:"13:30", last:"J-10470 flagged", status:"healthy", rate:99, on:true, runs30:420,
   what:"Checks every live job against its due time and stage, and flags work stuck in a stage or waiting on a customer.",
   why:"Jobs waiting on customer artwork went quiet until the day they were due.",
   saved:"6 hours a month",
   steps:[["Trigger","Every 30 minutes"],["Find","Live jobs and their due times"],["Check","Stuck stages, missing artwork, docket conflicts"],["Notify","Flag to Home and the owner"]],
   runs:[["Today 13:00","4s","ok","2 at risk","€0.00"],["Today 12:30","4s","ok","2 at risk","€0.00"],["Today 10:31","4s","ok","J-10470 flagged","€0.00"]]}
];
const OPS_FILTERS = [
  ["all","All"], ["routine","Agent routines"], ["automation","Automations"],
  ["report","Scheduled reports"], ["task","Recurring tasks"], ["approval","Needs approval"], ["failed","Failed"]
];

const WORK_SECTIONS = [
  {id:"tasks", label:"Tasks", blurb:"Everything assigned to the team, on real jobs.",
   views:["All tasks","Due tasks","Review","Done"], filters:["Due date","Any status","Anyone","Any job"]},
  {id:"approvals", label:"Approvals", blurb:"Changes, invoices and rush jobs waiting on a yes. Every decision is written as the person who made it.",
   views:["Awaiting you","Decided"], filters:["Raised today","Any value","Anyone"]},
  {id:"workflows", label:"Workflows", blurb:"What runs on its own between PrintLogic, the website, Stripe, email and Big Red Cloud, and who owns it.",
   views:[], filters:[]},
  {id:"schedules", label:"Schedules", blurb:"Recurring routines and every job due date on one calendar.",
   views:[], filters:[]}
];
const WORK_TASKS = [
  {id:"w1", title:"Chase Dublin Dental for J-10470 artwork", status:"In progress", priority:"High", who:"EW",
   due:"2d overdue", late:true, client:"Dublin Dental Centre", day:"Today", mins:"10 mins", view:"Due tasks"},
  {id:"w2", title:"Run J-10479 · 5,000 A5 flyers on Digital Press 1", status:"In progress", priority:"High", who:"ND",
   due:"Today 16:00", late:false, client:"Nova Electrical", day:"Today", mins:"4 hours", view:"Due tasks"},
  {id:"w3", title:"Approve CR-118 on J-10482 (2,000 cards, 5 names)", status:"Review", priority:"High", who:"SM",
   due:"Today 12:00", late:false, client:"Byrne & Co Solicitors", day:"Today", mins:"5 mins", view:"Review"},
  {id:"w4", title:"QC and box J-10477 Corrib leaflets", status:"Review", priority:"Medium", who:"LO",
   due:"Today 14:00", late:false, client:"Corrib Pharmacy", day:"Today", mins:"30 mins", view:"Review"},
  {id:"w5", title:"Check J-10473 invoice before Big Red Cloud", status:"Review", priority:"High", who:"AK",
   due:"Today 15:00", late:false, client:"Summit Property Partners", day:"Today", mins:"5 mins", view:"Review"},
  {id:"w6", title:"Trim and pack J-10481 Mill Theatre posters", status:"In progress", priority:"Medium", who:"JB",
   due:"Today 12:00", late:false, client:"The Mill Theatre", day:"Today", mins:"45 mins", view:"Due tasks"},
  {id:"w7", title:"Artwork check on J-10486 Greenline menus", status:"Not started", priority:"Medium", who:"SB",
   due:"Fri 2 Oct", late:false, client:"Greenline Café", day:"Fri", mins:"40 mins", view:"All tasks"},
  {id:"w8", title:"Fold and glue J-10483 Hartley folders", status:"In progress", priority:"Medium", who:"JB",
   due:"Tomorrow 16:00", late:false, client:"Hartley Accountants", day:"Tue", mins:"3 hours", view:"All tasks"},
  {id:"w9", title:"Confirm Large Format slot for J-10488 rush", status:"Not started", priority:"High", who:"LO",
   due:"Today 17:00", late:false, client:"Castle Events", day:"Today", mins:"15 mins", view:"Due tasks"},
  {id:"w10", title:"Reminder to Castle Events on INV-7738 (€1,395)", status:"Not started", priority:"Medium", who:"AK",
   due:"Fri", late:false, client:"Castle Events", day:"Fri", mins:"10 mins", view:"All tasks"},
  {id:"w11", title:"Send proof to Harbour View for J-10484", status:"Done", priority:"Medium", who:"SB",
   due:"Done 10:40", late:false, client:"Harbour View Hotel", day:"Today", mins:"20 mins", view:"Done", done:true}
];
const WORKFLOWS = [
  {name:"Customer Change → Controlled Revision", state:"live", trigger:"event · email received on live job",
   actions:[["dockets.version","write"],["notify.staff","write"]], lastRun:"Today 11:27",
   result:"CR-118 awaiting approval", resultKind:"warn", runSummary:"13 ok · 1 waiting",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","partial"]},
  {name:"Approved Quote → Job", state:"live", trigger:"event · printlogic.quote.approved",
   actions:[["jobs.create","write"],["dockets.create","write"]], lastRun:"Today 09:06",
   result:"ok", resultKind:"ok", runSummary:"14 ok",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok"]},
  {name:"Online Order → Production", state:"live", trigger:"event · stripe.payment.succeeded",
   actions:[["jobs.create","write"]], lastRun:"Today 12:15",
   result:"ok", resultKind:"ok", runSummary:"14 ok",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok"]},
  {name:"Job Complete → Invoice", state:"live", trigger:"event · production.completed",
   actions:[["bigredcloud.invoice.create","external"]], lastRun:"Today 13:06",
   result:"J-10473 awaiting approval", resultKind:"warn", runSummary:"12 ok · 2 waiting",
   runs:["ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","ok","partial","partial"]}
];
const SCHEDULES = [
  {id:"s1", name:"Morning briefing", cadence:"Every weekday · 07:30", next:"Tomorrow 07:30", owner:"Briefing", on:true, day:1},
  {id:"s2", name:"Deadline watch", cadence:"Every 30 minutes", next:"13:30", owner:"Ops Watchdog", on:true, day:1},
  {id:"s3", name:"Big Red Cloud sync check", cadence:"Hourly · 08:00 to 18:00", next:"14:00", owner:"Finance Agent", on:true, day:1},
  {id:"s4", name:"Paper stock check", cadence:"Mondays · 08:00", next:"Mon 08:00", owner:"Liam O'Connor", on:true, day:1},
  {id:"s5", name:"Debtor review", cadence:"Fridays · 10:00", next:"Fri 10:00", owner:"Finance Agent", on:true, day:5}
];
const WIDGET_DEFS = [["inbox","Action inbox"],["work","My work"],["activity","Activity"],["kpi","Today's numbers"],["visits","Due today"]];
const WORK_WIDGETS = [
  {id:"queue", label:"My queue", value:"8", hint:"assigned to you", icon:"work", queue:"mine"},
  {id:"late", label:"Running late", value:"11", hint:"past their due date", icon:"health", queue:"overdue"},
  {id:"unassigned", label:"Unassigned", value:"1", hint:"nobody owns it yet", icon:"teams", queue:"unassigned"},
  {id:"week", label:"Next 7 days", value:"4", hint:"due this week", icon:"visits", queue:"upcoming"}
];
const PERSONALITIES = ["Straight-talking","Warm","Formal","Dry"];
const ANSWER_STYLES = ["Short answers","Show the working","Ask before acting"];
/* Every context source and every registered tool the agent could be granted —
   the builder shows the whole catalogue, grouped, rather than a sample. */
const CONTEXT_DEFS = [
  ["Jobs","records","Every live and completed job"],
  ["Customers","records","Accounts, contacts, pricing"],
  ["Dockets","records","Versions, current and superseded"],
  ["Artwork","work","Revisions, proofs, approvals"],
  ["Production queue","work","Press, finishing, QC"],
  ["Approvals","work","What is waiting on a decision"],
  ["Quotes (PrintLogic)","money","Sent, approved, requoted"],
  ["Invoices (Big Red Cloud)","money","Ready, sent, paid"],
  ["Payments (Stripe)","money","Online orders, prepaid"],
  ["Email","system","Customer communications"],
  ["Website orders","system","Online orders as they arrive"],
  ["Activity log","system","Every event, person and agent"]
];
const CONTEXT_SOURCES = CONTEXT_DEFS.map(c => c[0]);
const SKILL_DEFS = [
  ["Search jobs","read"],["Summarise activity","read"],["Read dockets","read"],
  ["Read invoices","read"],["Read email","read"],
  ["Draft email","write"],["Create task","write"],["Update job","write"],
  ["Version docket","write"],["Raise approval","write"],
  ["Send email","external"],["Write quote to PrintLogic","external"],["Send to Big Red Cloud","external"]
];
/* The two questions the agent asks back once it knows the job. */
const TRAIN_PHASES = [
  ["Reading every job and docket", "1,940 records"],
  ["Learning how this shop words things", "docket → job ticket"],
  ["Reading PrintLogic quotes and Big Red Cloud invoices", "2 systems"],
  ["Writing its own system prompt", "1,120 tokens"]
];
const BRIEF_QUESTIONS = [
  {title:"What should it cover?", sub:"Pick as many as you like. We can refine later.",
   options:[["Jobs","Live jobs, due dates and risk"],["Email","Customer replies and changes"],
            ["Production","Press queue and finishing"],["Money","Ready to invoice and outstanding"],
            ["Something else","Tell me in the next message"]]},
  {title:"When should it land?", sub:"One is enough to start.",
   options:[["Every morning 07:30","Before the presses start"],["Weekdays 08:00","Monday to Friday only"],
            ["Only when something changes","Event-driven, no noise"],["On demand","When you ask for it"]]}
];
/* The words under a name, keyed to the same state the face lights with. */
const STATE_LABELS = {working:"working", thinking:"thinking", waiting:"waiting on you",
  complete:"up to date", attention:"needs you", idle:"idle"};

const FACE_SHAPES = [
  ["crown-pebble","Crown pebble"],["executive-capsule","Executive capsule"],["shield","Shield"],
  ["glass-visor","Glass visor"],["control-cube","Control cube"],["low-dome","Low dome"],
  ["offset-pebble","Offset pebble"],["rim-capsule","Rim capsule"],["wide-eyed","Wide-eyed"],
  ["precision-brow","Precision brow"],["tall-unit","Tall unit"],["soft-asymmetric","Soft asymmetric"]
];
/* Shell colours only — deliberately desaturated so none of them reads as a
   state. The eyes, rim and dots always carry the state colour. */
const FACE_TINTS = [
  ["#191c1f","Graphite"],["#1b2430","Slate"],["#241b2e","Aubergine"],
  ["#2a2118","Bronze"],["#16241f","Pine"],["#2b1b1e","Oxblood"]
];

/* ---- ontology graph: generation, Dijkstra traversal, canvas render ---- */
const CLUSTERS = [
  ["Customers",  "#6fcfe4", 0.00, 0.62, 46],
  ["Quotes",     "#9fb4c8", 0.90, 0.70, 52],
  ["Jobs",       "#e8e2d4", 1.75, 0.66, 58],
  ["Dockets",    "#c9b98a", 2.55, 0.72, 44],
  ["Artwork",    "#e07aa8", 3.35, 0.60, 38],
  ["Production", "#7fc9b0", 4.15, 0.70, 40],
  ["Payments",   "#a9bfa0", 4.95, 0.64, 30],
  ["Invoices",   "#e7c35a", 5.65, 0.72, 34]
];
function mulberry(seed){
  return function(){
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

/* Hub-and-spoke clusters around a dense phyllotaxis core, in unit space
   (-1..1 on both axes) so the layout is resolution independent. */
const _hexCache = {};
function hexRGB(hex){
  if (_hexCache[hex]) return _hexCache[hex];
  const h = hex.replace("#", "");
  const v = [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
  _hexCache[hex] = v;
  return v;
}


function buildGraph(){
  const rnd = mulberry(20260902);
  const nodes = [], edges = [], adj = [];
  const add = (x, y, z, r, cluster, kind) => {
    nodes.push({x, y, z, r, cluster, kind}); adj.push([]); return nodes.length - 1;
  };
  const link = (a, b) => {
    const dx = nodes[a].x - nodes[b].x, dy = nodes[a].y - nodes[b].y, dz = nodes[a].z - nodes[b].z;
    const w = Math.sqrt(dx * dx + dy * dy + dz * dz) + 0.004;
    const id = edges.length;
    edges.push({a, b, w});
    adj[a].push([b, w, id]); adj[b].push([a, w, id]);
  };

  // the core is a filled sphere on a Fibonacci lattice, not a disc
  const CORE = 880, coreIds = [];
  for (let i = 0; i < CORE; i++){
    const t = (i + 0.5) / CORE;
    const phi = Math.acos(1 - 2 * t);
    const theta = i * 2.39996;
    const shell = 0.16 + 0.28 * Math.pow(rnd(), 0.5);
    const grade = rnd();
    coreIds.push(add(
      Math.sin(phi) * Math.cos(theta) * shell * 1.04,
      Math.cos(phi) * shell * 0.96,
      Math.sin(phi) * Math.sin(theta) * shell,
      grade < 0.06 ? 3.4 + rnd() * 1.4 : grade < 0.3 ? 2.1 + rnd() * 0.7 : 1.0 + rnd() * 0.8, 0, "core"));
  }
  // lattice neighbours plus a mesh of chords, so the sphere reads as a volume
  for (let i = 1; i < coreIds.length; i++){
    link(coreIds[i], coreIds[i - 1]);
    if (i >= 13) link(coreIds[i], coreIds[i - 13]);
    if (i >= 21 && i % 2 === 0) link(coreIds[i], coreIds[i - 21]);
    if (i >= 34 && i % 3 === 0) link(coreIds[i], coreIds[i - 34]);
    if (i >= 55 && i % 4 === 0) link(coreIds[i], coreIds[i - 55]);
    if (i >= 89 && i % 5 === 0) link(coreIds[i], coreIds[i - 89]);
    if (i % 6 === 0) link(coreIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
  }

  // a mid shell between the nucleus and the lobes: the layer that makes it
  // read as a network rather than a ball with satellites
  const MID = 560, midIds = [];
  for (let i = 0; i < MID; i++){
    const t = (i + 0.5) / MID;
    const phi = Math.acos(1 - 2 * t), theta = i * 2.39996 + 0.7;
    const d = 0.52 + 0.16 * Math.pow(rnd(), 0.6);
    const g2 = rnd();
    midIds.push(add(
      Math.sin(phi) * Math.cos(theta) * d * 1.02,
      Math.cos(phi) * d * 0.96,
      Math.sin(phi) * Math.sin(theta) * d,
      g2 < 0.05 ? 2.6 + rnd() * 1.0 : g2 < 0.3 ? 1.6 + rnd() * 0.6 : 0.8 + rnd() * 0.7, 0, "core"));
  }
  for (let i = 0; i < midIds.length; i++){
    if (i >= 1) link(midIds[i], midIds[i - 1]);
    if (i >= 17) link(midIds[i], midIds[i - 17]);
    if (i >= 29 && i % 2 === 0) link(midIds[i], midIds[i - 29]);
    // radial spokes tying the shell to the nucleus
    if (i % 2 === 0) link(midIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
    if (i % 9 === 0) link(midIds[i], coreIds[Math.floor(rnd() * coreIds.length)]);
  }

  // clusters ride a sphere: each hub gets its own latitude as well as longitude
  const hubs = [], clusterLeaves = [];
  const onSphere = (lon, lat, d0) => { const d = d0 * 1.22;
    return [Math.cos(lat) * Math.cos(lon) * d * 1.02, Math.sin(lat) * d * 0.96, Math.cos(lat) * Math.sin(lon) * d]; };
  CLUSTERS.forEach((c, ci) => {
    const [, , ang, dist, leaves] = c;
    const lat = (ci % 2 ? 1 : -1) * (0.26 + rnd() * 0.5);
    const wob = 1.06 + rnd() * 0.16;
    const hp = onSphere(ang, lat, dist * wob);
    const hub = add(hp[0], hp[1], hp[2], 5.4, ci, "hub");
    hubs.push(hub);
    const mine = [];
    clusterLeaves.push(mine);
    for (let k = 0; k < 3; k++) link(hub, coreIds[Math.floor(rnd() * coreIds.length)]);
    for (let k = 0; k < 5; k++) link(hub, midIds[Math.floor(rnd() * midIds.length)]);

    const subs = 5 + Math.floor(rnd() * 4);
    const subIds = [];
    for (let s = 0; s < subs; s++){
      const sa = ang + (rnd() - 0.5) * 0.52, sl = lat + (rnd() - 0.5) * 0.3;
      const sd = dist + 0.08 + rnd() * 0.18;
      const sp = onSphere(sa, sl, sd);
      const sub = add(sp[0], sp[1], sp[2], 3.2, ci, "sub");
      subIds.push(sub);
      link(sub, hub);
      if (s > 0 && rnd() < 0.7) link(sub, subIds[s - 1]);
      const fan = Math.floor((leaves * 7.4) / subs);
      const spread = 0.17 + rnd() * 0.2;
      let prev = -1;
      for (let l = 0; l < fan; l++){
        const la = sa + (rnd() - 0.5) * spread * 2 + (rnd() - 0.5) * 0.06;
        const ll = sl + (rnd() - 0.5) * spread * 1.1;
        const ld = sd + 0.03 + Math.pow(rnd(), 0.8) * 0.17;
        const lp = onSphere(la, ll, ld);
        const lg = rnd();
        const leaf = add(lp[0], lp[1], lp[2],
          lg < 0.08 ? 2.8 + rnd() * 1.2 : lg < 0.34 ? 1.8 + rnd() * 0.6 : 1.0 + rnd() * 0.7, ci, "leaf");
        link(leaf, sub);
        mine.push(leaf);
        if (rnd() < 0.14) link(leaf, hub);
        if (prev >= 0 && rnd() < 0.34) link(leaf, prev);
        if (rnd() < 0.16) link(leaf, midIds[Math.floor(rnd() * midIds.length)]);
        prev = leaf;
      }
    }
  });
  // far satellites hanging off the outer leaves
  CLUSTERS.forEach((c, ci) => {
    const [, , ang, dist] = c;
    for (let s = 0; s < 7; s++){
      const sa = ang + (rnd() - 0.5) * 1.5, sl = (rnd() - 0.5) * 1.3;
      const sd = dist + 0.42 + rnd() * 0.22;
      const ap = onSphere(sa, sl, sd);
      const anchor = add(ap[0], ap[1], ap[2], 2.4, ci, "sub");
      link(anchor, hubs[ci]);
      const n = 14 + Math.floor(rnd() * 18);
      for (let l = 0; l < n; l++){
        const la = sa + (rnd() - 0.5) * 0.9, ll = sl + (rnd() - 0.5) * 0.7;
        const ld = sd + 0.02 + Math.pow(rnd(), 0.8) * 0.18;
        const p = onSphere(la, ll, ld);
        const leaf = add(p[0], p[1], p[2], 0.8 + rnd() * 0.9, ci, "leaf");
        link(leaf, anchor);
        clusterLeaves[ci].push(leaf);
      }
    }
  });

  // two hub rings and long chords across the sphere
  hubs.forEach((h, i) => {
    link(h, hubs[(i + 1) % hubs.length]);
    link(h, hubs[(i + 2) % hubs.length]);
    if (i % 3 === 0) link(h, hubs[(i + 4) % hubs.length]);
  });
  // neighbouring clusters share records, so their leaves cross-link
  for (let ci = 0; ci < clusterLeaves.length; ci++){
    const a = clusterLeaves[ci], b = clusterLeaves[(ci + 1) % clusterLeaves.length];
    const n = 26 + Math.floor(rnd() * 16);
    for (let k = 0; k < n; k++){
      link(a[Math.floor(rnd() * a.length)], b[Math.floor(rnd() * b.length)]);
    }
    // and a good number reach right across to the far side
    for (let k = 0; k < 12; k++){
      const far = clusterLeaves[(ci + 3) % clusterLeaves.length];
      link(a[Math.floor(rnd() * a.length)], far[Math.floor(rnd() * far.length)]);
    }
    for (let k = 0; k < 8; k++){
      const far = clusterLeaves[(ci + 4) % clusterLeaves.length];
      link(a[Math.floor(rnd() * a.length)], far[Math.floor(rnd() * far.length)]);
    }
  }

  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9, minZ = 1e9, maxZ = -1e9;
  for (const n of nodes){
    if (n.x < minX) minX = n.x; if (n.x > maxX) maxX = n.x;
    if (n.y < minY) minY = n.y; if (n.y > maxY) maxY = n.y;
    if (n.z < minZ) minZ = n.z; if (n.z > maxZ) maxZ = n.z;
  }
  const bounds = {minX, maxX, minY, maxY, cx:(minX + maxX) / 2, cy:(minY + maxY) / 2,
    cz:(minZ + maxZ) / 2, w:maxX - minX, h:maxY - minY, d:maxZ - minZ,
    radius: Math.max(maxX - minX, maxY - minY, maxZ - minZ) / 2,
    reach: nodes.reduce((m, n) => Math.max(m, Math.sqrt(n.x * n.x + n.y * n.y + n.z * n.z)), 0)};
  return {nodes, edges, adj, hubs, coreIds, bounds};
}

export {
  INK,
  BODY,
  DIM,
  FAINT,
  LIME,
  GREEN,
  AMBER,
  RED,
  NEUTRAL,
  MONO,
  ICONS,
  REC_SECTIONS,
  CONTACTS,
  FILE_TREE,
  ONTO_NODES,
  ONTO_EDGES,
  REC_TEMPLATES,
  REC_TEMPLATE_CATS,
  PEOPLE,
  ROLE_LEVELS,
  PERM_KEYS,
  GRANT_DEFS,
  ROLE_SCOPES,
  DEFAULT_PERMS,
  INTEGRATIONS,
  BG_DEFS,
  THEMES,
  ADMIN_ICONS,
  ADMIN_CARDS,
  ADMIN_GROUPS,
  SRC_TINT,
  SRC_ABBR,
  DATA_EVENTS,
  PEOPLE_EVENTS,
  AI_EVENTS,
  STREAM_DEFS,
  NAV,
  ITEMS,
  ORDER,
  ANSWERS,
  synthesizeCustomArea,
  pickAnswer,
  ORGS,
  TEAMS,
  LOCATIONS,
  AGENT_DEFS,
  KPI_DEFS,
  ASPECT_DEFS,
  FILTER_GROUPS,
  OPS_DEFS,
  OPS_FILTERS,
  WORK_SECTIONS,
  WORK_TASKS,
  WORKFLOWS,
  SCHEDULES,
  WIDGET_DEFS,
  WORK_WIDGETS,
  PERSONALITIES,
  ANSWER_STYLES,
  CONTEXT_DEFS,
  CONTEXT_SOURCES,
  SKILL_DEFS,
  TRAIN_PHASES,
  BRIEF_QUESTIONS,
  STATE_LABELS,
  FACE_SHAPES,
  FACE_TINTS,
  CLUSTERS,
  mulberry,
  _hexCache,
  hexRGB,
  buildGraph
};
