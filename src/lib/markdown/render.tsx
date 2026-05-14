import React from "react";

export function markdownToHtml(text: string): React.ReactNode[] {
  const lines = text.split("\n");
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Horizontal rule
    if (line.trim() === "---") {
      nodes.push(<hr key={i} className="my-4 border-slate-300" />);
      i++;
      continue;
    }

    // Heading
    const h2m = line.match(/^## (.+)$/);
    if (h2m) {
      nodes.push(
        <h2 key={i} className="mt-6 mb-2 text-xl font-semibold text-slate-800">
          {inlineFormat(h2m[1])}
        </h2>,
      );
      i++;
      continue;
    }
    const h3m = line.match(/^### (.+)$/);
    if (h3m) {
      nodes.push(
        <h3 key={i} className="mt-4 mb-2 text-lg font-medium text-slate-800">
          {inlineFormat(h3m[1])}
        </h3>,
      );
      i++;
      continue;
    }

    // Table
    if (line.startsWith("|")) {
      const tableLines: string[] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        tableLines.push(lines[i]);
        i++;
      }
      nodes.push(renderTable(tableLines, i));
      continue;
    }

    // Ordered list
    const olMatch = line.match(/^\d+\.\s/);
    if (olMatch) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\d+\.\s/)) {
        items.push(lines[i].replace(/^\d+\.\s*/, ""));
        i++;
      }
      nodes.push(
        <ol key={i} className="my-2 list-decimal pl-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-slate-500">
              {inlineFormat(item)}
            </li>
          ))}
        </ol>,
      );
      continue;
    }

    // Unordered list (bullets via — character)
    if (line.trim().startsWith("—") || line.match(/^-\s/)) {
      const items: string[] = [];
      while (i < lines.length && (lines[i].trim().startsWith("—") || lines[i].match(/^-\s/))) {
        items.push(lines[i].replace(/^[—-]\s*/, ""));
        i++;
      }
      nodes.push(
        <ul key={i} className="my-2 list-disc pl-5 space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-slate-500">
              {inlineFormat(item)}
            </li>
          ))}
        </ul>,
      );
      continue;
    }

    // Paragraph - collect consecutive text lines
    const paraLines: string[] = [];
    while (i < lines.length && isParaLine(lines[i])) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length > 0) {
      nodes.push(
        <p key={i} className="my-1 text-slate-500 leading-relaxed">
          {inlineFormat(paraLines.join(" "))}
        </p>,
      );
    } else {
      i++;
    }
  }

  return nodes;
}

function isParaLine(line: string): boolean {
  if (line.trim() === "") return false;
  if (line.match(/^(#{1,3}\s|[\d]+\.\s|[|]|[—-]\s|---)/)) return false;
  return true;
}

function inlineFormat(text: string): React.ReactNode {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, idx) => {
    const bold = part.match(/^\*\*(.+)\*\*$/);
    if (bold) return <strong key={idx} className="text-slate-800 font-semibold">{bold[1]}</strong>;
    return part;
  });
}

function renderTable(lines: string[], baseKey: number): React.ReactNode {
  const parseRow = (line: string) =>
    line
      .split("|")
      .map((c) => c.trim())
      .filter((c) => c !== "");

  const header = parseRow(lines[0]);
  const rows = lines.slice(2).map(parseRow).filter((r) => r.length > 0);

  return (
    <div key={baseKey} className="my-3 overflow-x-auto">
      <table className="w-full text-left text-sm border-collapse">
        <thead>
          <tr className="border-b border-slate-300">
            {header.map((h, idx) => (
              <th key={idx} className="py-2 pr-4 font-medium text-slate-800">
                {inlineFormat(h)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-slate-200">
              {row.map((cell, ci) => (
                <td key={ci} className="py-2 pr-4 text-slate-500">
                  {inlineFormat(cell)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
