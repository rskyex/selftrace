// Text alternative for a chart: a collapsible table of the values it draws,
// reachable by keyboard and read by screen readers.

export function ChartDataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  if (rows.length === 0) return null;
  return (
    <details className="mt-2 font-sans text-[12px] text-ink-500">
      <summary className="cursor-pointer text-ink-400 hover:text-ink-600 w-fit">Show data table</summary>
      <div className="mt-2 overflow-x-auto">
        <table className="min-w-full border-collapse">
          <caption className="text-left text-ink-500 mb-1">{caption}</caption>
          <thead>
            <tr>
              {columns.map(c => (
                <th key={c} scope="col" className="text-left font-medium text-ink-600 border-b border-linen-200 py-1 pr-4">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                {r.map((v, j) =>
                  j === 0 ? (
                    <th key={j} scope="row" className="text-left font-normal border-b border-linen-100 py-1 pr-4">{v}</th>
                  ) : (
                    <td key={j} className="border-b border-linen-100 py-1 pr-4 tabular-nums">{v}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  );
}

/** "2022-04-01" -> "Apr 2022" (UTC, so labels match the data in every time zone). */
export function monthLabel(date: string): string {
  return new Date(date).toLocaleString('en', { timeZone: 'UTC', month: 'short', year: 'numeric' });
}
