import { NextResponse } from "next/server";
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from "@react-pdf/renderer";
import { generateStaticDocumentDrafts } from "@/lib/ai/generate-documents";
import { getProposalProjectById } from "@/lib/data/proposal-projects";

const S = StyleSheet.create({
  page: { padding: 48, fontSize: 11, lineHeight: 1.5 },
  coverPage: { justifyContent: "center", backgroundColor: "#0f172a", padding: 64 },
  coverLabel: { fontSize: 10, fontFamily: "Helvetica", color: "#f59e0b", textTransform: "uppercase", marginBottom: 12 },
  coverTitle: { fontSize: 28, fontFamily: "Helvetica-Bold", color: "#f8fafc", lineHeight: 1.3, marginBottom: 16 },
  coverSub: { fontSize: 13, fontFamily: "Helvetica", color: "#94a3b8", marginBottom: 4 },
  coverFooter: { fontSize: 10, fontFamily: "Helvetica", color: "#64748b", marginTop: 48 },
  h1: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#0f172a", marginTop: 20, marginBottom: 4, borderBottom: "1 solid #f59e0b", paddingBottom: 4 },
  h2: { fontSize: 13, fontFamily: "Helvetica-Bold", color: "#1e293b", marginTop: 14, marginBottom: 4 },
  body: { fontSize: 11, fontFamily: "Helvetica", color: "#334155", marginBottom: 2 },
  bullet: { fontSize: 11, fontFamily: "Helvetica", color: "#334155", marginBottom: 1, marginLeft: 12 },
  table: { marginVertical: 6 },
  tableHeader: { flexDirection: "row", borderBottom: "2 solid #f59e0b", marginBottom: 2 },
  tableRow: { flexDirection: "row", borderBottom: "1 solid #e2e8f0" },
  th: { flex: 1, fontFamily: "Helvetica-Bold", fontSize: 10, color: "#0f172a", paddingVertical: 4, paddingRight: 6 },
  td: { flex: 1, fontFamily: "Helvetica", fontSize: 10, color: "#475569", paddingVertical: 3, paddingRight: 6 },
  sectionLabel: { fontSize: 10, fontFamily: "Helvetica", color: "#f59e0b", textTransform: "uppercase", marginBottom: 12 },
  subdued: { fontSize: 9, fontFamily: "Helvetica", color: "#94a3b8", marginTop: 16, textAlign: "center" },
});

function isHeading(line: string) { return /^## /.test(line); }
function isSubheading(line: string) { return /^### /.test(line); }
function isBullet(line: string) { return /^[—\-]\s/.test(line); }
function isTable(line: string) { return line.startsWith("|"); }
function isBlank(line: string) { return line.trim() === ""; }
function isHR(line: string) { return line.trim() === "---"; }

type PdfNode = React.ReactElement | null;

function renderLine(line: string, idx: number): PdfNode {
  if (isBlank(line) || isHR(line)) return null;

  if (isHeading(line)) {
    return <Text key={idx} style={S.h1}>{line.replace(/^## /, "")}</Text>;
  }
  if (isSubheading(line)) {
    return <Text key={idx} style={S.h2}>{line.replace(/^### /, "")}</Text>;
  }
  return <Text key={idx} style={S.body}>{formatBold(line)}</Text>;
}

function formatBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    const m = part.match(/^\*\*(.+)\*\*$/);
    if (m) {
      return <Text key={i} style={{ fontFamily: "Helvetica-Bold", color: "#0f172a" }}>{m[1]}</Text>;
    }
    return <Text key={i}>{part}</Text>;
  });
}

function renderSection(body: string): PdfNode[] {
  const lines = body.split("\n");
  const result: PdfNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (isBlank(line) || isHR(line)) { i++; continue; }

    // Collect consecutive bullets into a list
    if (isBullet(line)) {
      const items: string[] = [];
      while (i < lines.length && isBullet(lines[i])) {
        items.push(lines[i].replace(/^[—\-]\s*/, ""));
        i++;
      }
      result.push(
        <View key={`ul-${i}`} style={{ marginVertical: 4 }}>
          {items.map((item, idx) => (
            <Text key={idx} style={S.bullet}>{`•  ${item}`}</Text>
          ))}
        </View>,
      );
      continue;
    }

    // Collect consecutive table lines
    if (isTable(line)) {
      const tableLines: string[] = [];
      while (i < lines.length && isTable(lines[i])) { tableLines.push(lines[i]); i++; }
      if (tableLines.length >= 2) {
        const parse = (l: string) => l.split("|").map((c) => c.trim()).filter(Boolean);
        const header = parse(tableLines[0]);
        const rows = tableLines.slice(2).map(parse).filter((r) => r.length > 0);
        result.push(
          <View key={`tbl-${i}`} style={S.table}>
            <View style={S.tableHeader}>
              {header.map((h, hi) => <Text key={hi} style={S.th}>{h}</Text>)}
            </View>
            {rows.map((row, ri) => (
              <View key={ri} style={S.tableRow}>
                {row.map((c, ci) => <Text key={ci} style={S.td}>{c}</Text>)}
              </View>
            ))}
          </View>,
        );
      }
      continue;
    }

    // Regular line
    result.push(renderLine(line, i));
    i++;
  }

  return result;
}

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProposalProjectById(id);
  if (!project) return new NextResponse("Not found", { status: 404 });

  const drafts = generateStaticDocumentDrafts(project.structured_scope, undefined, project.client_name, project.project_type);
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const filename = (project.client_name ?? "project").replace(/[^a-zA-Z0-9]/g, "-");

  const buffer = await renderToBuffer(
    <Document>
      <Page size="A4" style={S.coverPage}>
        <Text style={S.coverLabel}>ProposalCraft</Text>
        <Text style={S.coverTitle}>{project.project_type ?? "Project"} Proposal</Text>
        <Text style={S.coverSub}>Prepared for: {project.client_name}</Text>
        <Text style={S.coverSub}>Date: {today}</Text>
        <Text style={S.coverFooter}>Generated by ProposalCraft</Text>
      </Page>

      <Page size="A4" style={S.page}>
        <Text style={S.sectionLabel}>Proposal</Text>
        {renderSection(drafts.proposal.body)}
      </Page>

      <Page size="A4" style={S.page}>
        <Text style={S.sectionLabel}>Statement of Work</Text>
        {renderSection(drafts.sow.body)}
      </Page>

      <Page size="A4" style={S.page}>
        <Text style={S.sectionLabel}>Quote</Text>
        {renderSection(drafts.quote.body)}
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
