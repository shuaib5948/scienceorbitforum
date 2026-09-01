/** Small, dependency-free date formatting for the Phase 2 date labels. */
const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

export function formatDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${MONTHS[d.getMonth()] ?? '?'} ${d.getDate()}, ${d.getFullYear()}`;
}

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDate(start);
  const a = new Date(start);
  const b = new Date(end);
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return formatDate(start);
  const sameYear = a.getFullYear() === b.getFullYear();
  const aPart = `${MONTHS[a.getMonth()] ?? '?'} ${a.getDate()}`;
  const bPart = `${MONTHS[b.getMonth()] ?? '?'} ${b.getDate()}${sameYear ? '' : `, ${b.getFullYear()}`}`;
  return `${aPart} – ${bPart}`;
}
