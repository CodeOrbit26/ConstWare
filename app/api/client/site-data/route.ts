import { NextResponse } from "next/server"

/** 
 * GET /api/client/site-data?siteId=<siteAccessCode or token>
 * Returns site data for the client project portal.
 * Currently uses mock data — will connect to Supabase in production.
 */

const mockSiteDatabase: Record<string, any> = {
  'CWABGV01ASGG': {
    name: 'Green Valley Residency',
    location: 'Sector 45, Gurgaon',
    progress: 65,
    status: 'active',
    start_date: 'Oct 2025',
    end_date: 'Dec 2026',
    contractor: {
      name: 'Abhay Sharma',
      company: 'Sharma & Associates',
      phone: '+91 98765 43210',
    },
    latest_update: {
      summary: 'Third floor slab casting completed ahead of schedule. Brickwork commencing on floors 1-2. MEP rough-in at 40%.',
      date: '2026-04-25',
      workers_count: 45,
      photos: [],
    },
    milestones: [
      { id: 'm1', title: 'Foundation', date: '2025-11-15', completed: true },
      { id: 'm2', title: 'Ground Floor Slab', date: '2026-01-10', completed: true },
      { id: 'm3', title: 'Brickwork & Plastering', date: '2026-08-20', completed: false },
      { id: 'm4', title: 'Finishing & Handover', date: '2026-12-30', completed: false },
    ],
  },
  'CWRIST15ASMU': {
    name: 'Skyline Towers',
    location: 'Worli, Mumbai',
    progress: 42,
    status: 'active',
    start_date: 'Jan 2026',
    end_date: 'Jun 2027',
    contractor: {
      name: 'Abhay Sharma',
      company: 'Sharma & Associates',
      phone: '+91 98765 43210',
    },
    latest_update: {
      summary: 'Basement excavation complete. Pile cap reinforcement underway. Dewatering system operational.',
      date: '2026-04-24',
      workers_count: 32,
      photos: [],
    },
    milestones: [
      { id: 'm1', title: 'Excavation', date: '2026-02-15', completed: true },
      { id: 'm2', title: 'Basement P1', date: '2026-05-10', completed: false },
      { id: 'm3', title: 'Superstructure', date: '2026-12-01', completed: false },
      { id: 'm4', title: 'Finishing & Handover', date: '2027-06-01', completed: false },
    ],
  },
  'CWLGLB01ASBL': {
    name: 'Lotus Business Park',
    location: 'Whitefield, Bangalore',
    progress: 88,
    status: 'on_hold',
    start_date: 'May 2025',
    end_date: 'Jun 2026',
    contractor: {
      name: 'Abhay Sharma',
      company: 'Sharma & Associates',
      phone: '+91 98765 43210',
    },
    latest_update: {
      summary: 'Interior finishing on hold pending client design approval. Facade glazing 95% complete.',
      date: '2026-04-22',
      workers_count: 28,
      photos: [],
    },
    milestones: [
      { id: 'm1', title: 'Structure Ready', date: '2026-02-01', completed: true },
      { id: 'm2', title: 'Facade & Glazing', date: '2026-04-01', completed: true },
      { id: 'm3', title: 'Interior Finishing', date: '2026-05-30', completed: false },
      { id: 'm4', title: 'Handover', date: '2026-06-30', completed: false },
    ],
  },
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

    // Demo token fallback — return Green Valley for any demo/test token
    if (normalizedId.includes('DEMO') || normalizedId.includes('TOKEN')) {
      return NextResponse.json({ success: true, data: mockSiteDatabase['CWABGV01ASGG'] })
    }

    // Any CW-prefixed code — return dynamic Green Valley data for demo
    if (normalizedId.startsWith('CW')) {
      const clientInitials = normalizedId.slice(2, 4);
      const siteInitials = normalizedId.slice(4, 6);
      
      return NextResponse.json({ 
        success: true, 
        data: {
          ...mockSiteDatabase['CWABGV01ASGG'],
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
