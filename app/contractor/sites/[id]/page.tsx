import { mockSites } from "@/lib/services/mockData"
import SiteDetailView from "@/components/sites/SiteDetailView"

export async function generateStaticParams() {
  return mockSites.map((site) => ({
    id: site.id,
  }))
}

export default function SiteDetailPage() {
  return <SiteDetailView />
}
