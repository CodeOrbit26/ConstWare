export function generateSiteId(
  contractorName: string,
  companyName: string | null,
  createdAt: Date
): string {
  // Part 1: 2-letter prefix from company or contractor name
  const source = (companyName || contractorName || 'CW').trim();
  const words = source.split(/\s+/).filter(Boolean);
  let prefix = '';
  if (words.length >= 2) {
    prefix = (words[0][0] + words[1][0]).toUpperCase();
  } else {
    prefix = source.slice(0, 2).toUpperCase();
  }

  // Part 2: date as YYMMDD
  const yy = String(createdAt.getFullYear()).slice(2);
  const mm = String(createdAt.getMonth() + 1).padStart(2, '0');
  const dd = String(createdAt.getDate()).padStart(2, '0');
  const datePart = yy + mm + dd;

  // Part 3: 2-char random suffix
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 2 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return `CW-${prefix}-${datePart}-${suffix}`;
}

export async function generateUniqueSiteId(
  contractorName: string,
  companyName: string | null,
  createdAt: Date,
  checkExists: (id: string) => Promise<boolean>
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const id = generateSiteId(contractorName, companyName, createdAt);
    const exists = await checkExists(id);
    if (!exists) return id;
  }
  throw new Error('Could not generate unique site ID after 10 attempts');
}
