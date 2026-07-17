/**
 * Client-side file downloads via Blob URLs (PRODUCT_SPEC §7.7). Nothing is sent
 * to a server — the file is assembled in the browser and handed to the user.
 */

export function downloadText(filename: string, contents: string, mime = "text/plain"): void {
  if (typeof document === "undefined") return;
  const blob = new Blob([contents], { type: `${mime};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke on the next tick so the download has a chance to start.
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/** One value per line. */
export function toTxt(values: string[]): string {
  return values.join("\n") + "\n";
}

/**
 * A minimal CSV. Values are quoted and internal quotes doubled, so a value that
 * happens to contain a comma or quote stays intact.
 */
export function toCsv(header: string[], rows: string[][]): string {
  const escape = (cell: string): string => `"${cell.replace(/"/g, '""')}"`;
  const lines = [header.map(escape).join(",")];
  for (const row of rows) lines.push(row.map(escape).join(","));
  return lines.join("\n") + "\n";
}
