import { mockWorkers } from "@/lib/services/mockData"
import WorkerProfileView from "@/components/workers/WorkerProfileView"

export async function generateStaticParams() {
  return mockWorkers.map((worker) => ({
    id: worker.id,
  }))
}

export default function WorkerProfilePage() {
  return <WorkerProfileView />
}
