import { NextResponse } from "next/server"

/** 
 * GET /api/client/site-data?siteId=<siteAccessCode or token>
 * Returns site data for the client project portal.
 * Currently uses mock data — will connect to Supabase in production.
 */

const mockSiteDatabase: Record<string, any> = {}

const defaultEmptySite = {
  name: 'No Site Found',
  location: 'N/A',
  progress: 0,
  status: 'inactive',
  start_date: '',
  end_date: '',
  contractor: {
    name: '',
    company: '',
    phone: '',
  },
  latest_update: {
    summary: 'No updates available.',
    date: '',
    workers_count: 0,
    photos: [],
  },
  milestones: [],
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const siteId = searchParams.get('siteId')

    if (!siteId) {
      return NextResponse.json({ success: false, error: 'Site ID is required' }, { status: 400 })
    }

    // Strip dashes and normalize
    const normalizedId = siteId.replace(/[^A-Z0-9]/gi, '').toUpperCase()

    // Direct match on the access code
    if (mockSiteDatabase[normalizedId]) {
      return NextResponse.json({ success: true, data: mockSiteDatabase[normalizedId] })
    }

    // Match by formatted code (with dashes removed)
    for (const [code, data] of Object.entries(mockSiteDatabase)) {
      if (normalizedId.includes(code) || code.includes(normalizedId)) {
        return NextResponse.json({ success: true, data })
      }
    }

    // Demo token fallback
    if (normalizedId.includes('DEMO') || normalizedId.includes('TOKEN')) {
      return NextResponse.json({ success: true, data: defaultEmptySite })
    }

    // Any CW-prefixed code
    if (normalizedId.startsWith('CW')) {
      const clientInitials = normalizedId.slice(2, 4);
      const siteInitials = normalizedId.slice(4, 6);
      
      return NextResponse.json({ 
        success: true, 
        data: {
          ...defaultEmptySite,
          name: `${siteInitials} Construction Alpha`,
          location: `Zone ${normalizedId.slice(10, 12) || 'XX'}, ${clientInitials} District`,
          client_code: clientInitials
        }
      })
    }

    return NextResponse.json({ success: false, error: 'Site ID not found. Please check and try again.' }, { status: 404 })


  } catch (err) {
    console.error(err)
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 })
  }
}
