import React from "react";

type PdfStyle = Record<string, Record<string, string | number>>;

export function renderPdfMarkdown(text: string, s: PdfStyle, boldStyle: Record<string, string | number>, plainStyle: Record<string, string | number>) {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) { i++; continue; }

    if (line.trim() === "---") {
      nodes.push(React.createElement("View", { key: i, style: s.hr }));
      i++;
      continue;
    }

    const h1m = line.match(/^## (.+)$/);
    if (h1m) {
      nodes.push(React.createElement("Text", { key: i, style: s.h1 }, h1m[1]));
      i++;
      continue;
    }
    const h2m = line.match(/^### (.+)$/);
    if (h2m) {
      nodes.push(React.createElement("Text", { key: i, style: s.h2 }, h2m[1]));
      i++;
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) { tableLines.push(lines[i]); i++; }
      if (tableLines.length >= 2) {
        const parseRow = (l: string) => l.split("|").map(function(c) { return c.trim(); }).filter(Boolean);
        const header = parseRow(tableLines[0]);
        const rows = tableLines.slice(2).map(parseRow).filter(function(r) { return r.length > 0; });
        nodes.push(
          React.createElement("View", { key: i, style: s.table },
            header.length > 0 && React.createElement("View", { key: "hdr", style: s.tableHeader },
              header.map(function(h, hi) { return React.createElement("Text", { key: hi, style: s.thCell }, h); })
            ),
            rows.map(function(row, ri) {
              return React.createElement("View", { key: ri, style: s.tableRow },
                row.map(function(c, ci) {
                  return React.createElement("Text", { key: ci, style: s.tdCell }, c);
                })
              );
            })
          )
        );
      }
      continue;
    }

    // Unordered list
    if (line.match(/^[—\-]\s/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^[—\-]\s/)) {
        items.push(lines[i].replace(/^[—\-]\s*/, ""));
        i++;
      }
      nodes.push(
        React.createElement("View", { key: i, style: { marginVertical: 4 } },
          items.map(function(item, idx) {
            return React.createElement("Text", { key: idx, style: s.bullet }, `• ${item}`);
          })
        )
      );
      continue;
    }

    // Paragraph
    const paraLines: string[] = [];
    while (i < lines.length && lines[i].trim() !== "" && !lines[i].match(/^(#|[\d]+\.|\||[—\-]\s|---)/)) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      const text = paraLines.join(" ");
      const parts = text.split(/(\*\*[^*]+\*\*)/g);
      nodes.push(
        React.createElement("Text", { key: i, style: s.body },
          parts.map(function(part, idx) {
            const b = part.match(/^\*\*(.+)\*\*$/);
            return b
              ? React.createElement("Text", { key: idx, style: boldStyle }, b[1])
              : React.createElement("Text", { key: idx, style: plainStyle }, part);
          })
        )
      );
    } else { i++; }
  }

  return nodes;
}
