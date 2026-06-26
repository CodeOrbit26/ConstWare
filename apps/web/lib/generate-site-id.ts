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
  // No 0, 1, O, I — avoids confusion when reading
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const suffix = Array.from({ length: 2 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');

  return `CW-${prefix}-${datePart}-${suffix}`;
}

// Keeps generating until unique (max 10 tries)
export async function generateUniqueSiteId(
  contractorName: string,
  companyName: string | null,
  createdAt: Date,
  supabaseClient: any
): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const id = generateSiteId(contractorName, companyName, createdAt);
    const { data } = await supabaseClient
      .from('sites')
      .select('id')
      .eq('client_access_id', id)
      .maybeSingle();
    if (!data) return id;
  }
  throw new Error('Could not generate unique site ID after 10 attempts');
}
