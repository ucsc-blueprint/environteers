export function formatNewsletterTitle(editionNumber: string | number): string {
  return `Environteers Weekly Update: Edition ${editionNumber}`;
}

export function formatNewsletterDate(dateStr: string): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;

  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}
