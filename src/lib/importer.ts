export type ParsedRow = Record<string, unknown>;

export type FileKind = "csv" | "xlsx" | "both";

export type ParseOptions = {
  headerRow?: number; // 0-based index of header row
  sheetIndex?: number; // default 0
};

export async function parseFileToRows(file: File, opts: ParseOptions = {}): Promise<ParsedRow[]> {
  const { headerRow = 0, sheetIndex = 0 } = opts;

  if (file.name.toLowerCase().endsWith(".csv") || file.type === "text/csv") {
    const text = await file.text();
    return parseCsv(text);
  }

  // XLSX / Excel
  const { read, utils } = await import("xlsx");
  const arrayBuffer = await file.arrayBuffer();
  const wb = read(arrayBuffer, { type: "array" });
  const ws = wb.Sheets[wb.SheetNames[sheetIndex] ?? wb.SheetNames[0]];
  if (!ws) return [];
  const rows = utils.sheet_to_json(ws, {
    header: 1,
    raw: true,
    defval: "",
  }) as (string | number | boolean | null)[][];

  if (!rows.length) return [];
  const headers = (rows[headerRow] ?? []).map((h) => String(h ?? "").trim());
  const dataRows = rows.slice(headerRow + 1);

  return dataRows.map((r) => {
    const obj: ParsedRow = {};
    headers.forEach((h, i) => {
      obj[h] = r[i] ?? "";
    });
    return obj;
  });
}

function parseCsv(csvText: string): ParsedRow[] {
  const lines = csvText.split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().replace(/^"|"$/g, ""));
  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row: ParsedRow = {};
    headers.forEach((h, i) => {
      row[h] = (values[i] ?? "").trim().replace(/^"|"$/g, "");
    });
    return row;
  });
}

// Minimal CSV splitter—handles quoted commas
function splitCsvLine(line: string): string[] {
  const res: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === "," && !inQuotes) {
      res.push(cur);
      cur = "";
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res;
}