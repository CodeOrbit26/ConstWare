import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = createClient();
  const { siteId, enabled } = await request.json();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json(
    { error: 'Unauthorized' }, { status: 401 }
  );

  const { error } = await supabase
    .from('sites')
    .update({ client_access_enabled: enabled })
    .eq('id', siteId)
    .eq('contractor_id', user.id);

  if (error) return NextResponse.json(
    { error: error.message }, { status: 500 }
  );

  return NextResponse.json({ success: true });
}
