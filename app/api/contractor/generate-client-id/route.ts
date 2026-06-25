import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { generateUniqueSiteId } from '@/lib/generate-site-id';

export async function POST(request: Request) {
  const supabase = createClient();
  const { siteId, clientName, clientPhone, clientEmail } = await request.json();

  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(
    { error: 'Unauthorized' }, { status: 401 }
  );

  // Get contractor profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, company_name')
    .eq('id', user.id)
    .single();

  if (!profile) return NextResponse.json(
    { error: 'Profile not found' }, { status: 404 }
  );

  // Generate unique ID
  const clientAccessId = await generateUniqueSiteId(
    profile.full_name || 'CW',
    profile.company_name,
    new Date(),
    supabase
  );

  // Save to site
  const { error } = await supabase
    .from('sites')
    .update({
      client_access_id: clientAccessId,
      client_access_enabled: true,
      client_name: clientName || null,
      client_phone: clientPhone || null,
      client_email: clientEmail || null,
    })
    .eq('id', siteId)
    .eq('contractor_id', user.id); // security check

  if (error) return NextResponse.json(
    { error: error.message }, { status: 500 }
  );

  return NextResponse.json({ clientAccessId });
}
