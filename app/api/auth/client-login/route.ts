import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { clientAccessId } = await request.json();

    // Clean input: uppercase, keep only alphanumeric and dashes
    const cleanId = clientAccessId.replace(/[^A-Z0-9]/gi, '').toUpperCase();

    // Validate ID length/prefix
    if (cleanId.length !== 12 || !cleanId.startsWith('CW')) {
      return NextResponse.json(
        { error: 'Invalid Code. Must be a 12-character ConstWare code.' },
        { status: 400 }
      );
    }

    // Determine site name mock
    const mockSiteNames: Record<string, string> = {
      'CWABGV01ASGG': 'Green Valley Residency',
      'CWRIST15ASMU': 'Skyline Towers',
      'CWLGLB01ASBL': 'Lotus Business Park',
    };
    const siteName = mockSiteNames[cleanId] || `Project Site (${cleanId.slice(4,6)})`;

    const response = NextResponse.json({
      success: true,
      siteId: cleanId,
      clientAccessId: cleanId,
      siteName: siteName,
      redirectUrl: `/client/${cleanId}`
    });

    response.cookies.set('cw_client_site', cleanId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
      sameSite: 'lax'
    });

    return response;
  } catch (err) {
    return NextResponse.json({ error: 'Server validation failed' }, { status: 500 });
  }
}
