import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { generateAIDocuments } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";

const A = "#f59e0b"; // amber brand accent
const D = "#0f172a"; // dark
const B = "#f8fafc"; // bright
const G = "#94a3b8"; // gray-muted
const T = "#334155"; // text body
const H = "#1e293b"; // heading
const L = "#e2e8f0"; // light border

const S = StyleSheet.create({
  // ── Cover ──
  coverPage: { backgroundColor: D, justifyContent: "center", padding: 56, flexGrow: 1 },
  cLabel: { fontSize: 9, fontFamily: "Helvetica", color: A, textTransform: "uppercase", letterSpacing: 3, marginBottom: 20 },
  cTitle: { fontSize: 32, fontFamily: "Helvetica-Bold", color: B, lineHeight: 1.2, marginBottom: 24 },
  cMeta: { fontSize: 12, fontFamily: "Helvetica", color: G, marginBottom: 4 },
  cFoot: { fontSize: 9, fontFamily: "Helvetica", color: "#475569", marginTop: 56 },

  // ── Content Page ──
  page: { paddingVertical: 40, paddingHorizontal: 52, fontSize: 10.5, lineHeight: 1.55 },
  pageHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28, borderBottom: "1 solid #e2e8f0", paddingBottom: 8 },
  pageHeaderText: { fontSize: 8, fontFamily: "Helvetica", color: G, textTransform: "uppercase" },
  pageFooter: { position: "absolute", bottom: 24, left: 52, right: 52, fontSize: 7.5, fontFamily: "Helvetica", color: G, textAlign: "center", borderTop: "1 solid #e2e8f0", paddingTop: 6 },

  // ── Typography ──
  h1: { fontSize: 20, fontFamily: "Helvetica-Bold", color: D, marginTop: 18, marginBottom: 4, paddingBottom: 4, borderBottom: "2 solid #f59e0b" },
  h2: { fontSize: 12.5, fontFamily: "Helvetica-Bold", color: H, marginTop: 15, marginBottom: 3 },
  body: { fontSize: 10.5, fontFamily: "Helvetica", color: T, marginBottom: 2 },
  bullet: { fontSize: 10.5, fontFamily: "Helvetica", color: T, marginBottom: 1.5, marginLeft: 14 },
  bold: { fontFamily: "Helvetica-Bold", color: "#0f172a" },

  // ── Feature block (outcome / why choose me highlight) ──
  featureBox: { backgroundColor: "#fff7ed", borderLeft: "4 solid #f59e0b", padding: 14, marginVertical: 14, borderRadius: 4, width: "100%" },
  featureTitle: { fontSize: 12, fontFamily: "Helvetica-Bold", color: D, marginBottom: 6 },
  featureBody: { fontSize: 10, fontFamily: "Helvetica", color: T, lineHeight: 1.5 },

  // ── Letter opening ──
  letterOpening: { fontSize: 11, fontFamily: "Helvetica", color: T, lineHeight: 1.6, marginBottom: 2 },
  letterClosing: { fontSize: 11, fontFamily: "Helvetica", color: T, marginTop: 12 },

  // ── Table ──
  table: { marginVertical: 8 },
  tableHeader: { flexDirection: "row", backgroundColor: "#0f172a", borderRadius: 2 },
  tableHeaderText: { fontFamily: "Helvetica-Bold", fontSize: 9.5, color: B, paddingVertical: 6, paddingHorizontal: 10, flex: 1 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #e2e8f0" },
  tableRowAlt: { flexDirection: "row", borderBottom: "1 solid #e2e8f0", backgroundColor: "#f8fafc" },
  tableCell: { flex: 1, fontSize: 9.5, fontFamily: "Helvetica", color: T, paddingVertical: 5, paddingHorizontal: 10 },

  // ── Pricing tier cards ──
  tierWrap: { marginVertical: 10 },
  tierCard: { border: "1 solid #e2e8f0", borderRadius: 6, padding: 16, marginBottom: 10 },
  tierName: { fontSize: 14, fontFamily: "Helvetica-Bold", color: D, marginBottom: 2 },
  tierPrice: { fontSize: 18, fontFamily: "Helvetica-Bold", color: A, marginBottom: 4 },
  tierDesc: { fontSize: 9.5, fontFamily: "Helvetica", color: G, marginBottom: 8 },
  tierFeature: { fontSize: 10, fontFamily: "Helvetica", color: T, marginBottom: 2, marginLeft: 8 },

  // ── Section divider ──
  sectionSpacer: { height: 12 },
  sectionLabel: { fontSize: 9, fontFamily: "Helvetica", color: A, textTransform: "uppercase", letterSpacing: 2.4, marginBottom: 18 },

  // ── Disclaimer ──
  disclaimer: { fontSize: 7.5, fontFamily: "Helvetica", color: G, lineHeight: 1.4, marginTop: 10, fontStyle: "italic" },
});

function isH1(l: string) { return /^## /.test(l); }
function isH2(l: string) { return /^### /.test(l); }
function isBullet(l: string) { return /^[—\-]\s/.test(l); }
function isTable(l: string) { return l.startsWith("|"); }
function isBlank(l: string) { return l.trim() === ""; }
function isHR(l: string) { return l.trim() === "---"; }
function isWhyChooseMe(l: string) { return /^Why Choose Me$/.test(l.trim()); }
function isExpectedOutcomes(l: string) { return /^Expected Outcomes$/.test(l.trim()); }
function isDisclaimer(l: string) { return /^\*\*Disclaimer/.test(l); }

function formatBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (m) return <Text key={i} style={S.bold}>{m[1]}</Text>;
    return <Text key={i}>{part}</Text>;
  });
}

function renderContent(body: string): React.ReactNode[] {
  const lines = body.split("\n");
  const out: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line) || isHR(line)) { i++; continue; }

    // ── Feature blocks for special sections ──
    if (isWhyChooseMe(line) || isExpectedOutcomes(line)) {
      const heading = line.replace(/^## /, "");
      const items: string[] = [];
      i++;
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^[—\-]\s*/, ""));
        i++;
      }
      out.push(
        <View key={`feat-${i}`} style={S.featureBox}>
          <Text style={S.featureTitle}>{heading}</Text>
          {items.map((item, idx) => (
            <Text key={idx} style={S.featureBody}>{`${item}`}</Text>
          ))}
        </View>,
      );
      continue;
    }

    // ── Disclaimer ──
    if (isDisclaimer(line)) {
      const text = line.replace(/^\*\*Disclaimer:\*\*\s*/, "");
      out.push(<Text key={`disc-${i}`} style={S.disclaimer}>{`Disclaimer: ${text}`}</Text>);
      i++;
      continue;
    }

    // ── Headings ──
    if (isH1(line)) {
      out.push(<Text key={i} style={S.h1}>{line.replace(/^## /, "")}</Text>);
      i++; continue;
    }
    if (isH2(line)) {
      out.push(<Text key={i} style={S.h2}>{line.replace(/^### /, "")}</Text>);
      i++; continue;
    }

    // ── Bullet list ──
    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^[—\-]\s*/, ""));
        i++;
      }
      out.push(
        <View key={`ul-${i}`} style={{ marginVertical: 3 }}>
          {items.map((item, idx) => (
            <Text key={idx} style={S.bullet}>{`•  ${item}`}</Text>
          ))}
        </View>,
      );
      continue;
    }

    // ── Table ──
    if (isTable(line)) {
      const tbl: string[] = [];
      while (i < lines.length && isTable(lines[i])) { tbl.push(lines[i]); i++; }
      if (tbl.length >= 2) {
        const parse = (l: string) => l.split("|").map(c => c.trim()).filter(Boolean);
        const hdr = parse(tbl[0]);
        const rows = tbl.slice(2).map(parse).filter(r => r.length > 0);
        out.push(
          <View key={`tbl-${i}`} style={S.table}>
            <View style={S.tableHeader}>
              {hdr.map((h, hi) => <Text key={hi} style={S.tableHeaderText}>{h}</Text>)}
            </View>
            {rows.map((row, ri) => (
              <View key={ri} style={ri % 2 === 0 ? S.tableRow : S.tableRowAlt}>
                {row.map((c, ci) => <Text key={ci} style={S.tableCell}>{c}</Text>)}
              </View>
            ))}
          </View>,
        );
      }
      continue;
    }

    // ── Regular paragraph ──
    out.push(<Text key={i} style={S.body}>{formatBold(line)}</Text>);
    i++;
  }

  return out;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);
  if (!project) return new NextResponse("Not found", { status: 404 });

  const drafts = await generateAIDocuments(project.structured_scope, undefined, project.client_name, project.project_type);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const filename = (project.client_name ?? "project").replace(/[^a-zA-Z0-9]/g, "-");
  const client = project.client_name ?? "Client";
  const title = project.project_type ?? "Project";

  const buffer = await renderToBuffer(
    <Document>
      {/* ══════ COVER ══════ */}
      <Page size="A4" style={S.coverPage}>
        <Text style={S.cLabel}>Proposal, SOW & Quote</Text>
        <Text style={S.cTitle}>{title} Proposal</Text>
        <Text style={S.cMeta}>Prepared exclusively for {client}</Text>
        <Text style={S.cMeta}>{today}</Text>
        <Text style={S.cFoot}>Generated by ProposalCraft</Text>
      </Page>

      {/* ══════ PROPOSAL ══════ */}
      <Page size="A4" style={S.page}>
        <View style={S.pageHeader} fixed>
          <Text style={S.pageHeaderText}>Proposal</Text>
          <Text style={S.pageHeaderText}>{client}</Text>
        </View>
        <Text style={S.sectionLabel}>Proposal</Text>
        {renderContent(drafts.proposal.body)}
        <Text style={S.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* ══════ STATEMENT OF WORK ══════ */}
      <Page size="A4" style={S.page}>
        <View style={S.pageHeader} fixed>
          <Text style={S.pageHeaderText}>Statement of Work</Text>
          <Text style={S.pageHeaderText}>{client}</Text>
        </View>
        <Text style={S.sectionLabel}>Statement of Work</Text>
        {renderContent(drafts.sow.body)}
        <Text style={S.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>

      {/* ══════ QUOTE ══════ */}
      <Page size="A4" style={S.page}>
        <View style={S.pageHeader} fixed>
          <Text style={S.pageHeaderText}>Quote</Text>
          <Text style={S.pageHeaderText}>{client}</Text>
        </View>
        <Text style={S.sectionLabel}>Quote</Text>
        {renderContent(drafts.quote.body)}
        <Text style={S.pageFooter} render={({ pageNumber }) => `${pageNumber}`} fixed />
      </Page>
    </Document>,
  );

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="proposal-${filename}.pdf"`,
    },
  });
}
