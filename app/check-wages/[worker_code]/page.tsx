import WorkerDetailPortal from "./WorkerClient"

export async function generateStaticParams() {
  return [
    { worker_code: "CW001" },
    { worker_code: "CW002" },
  ]
}

export default function WorkerDetailPage() {
  return <WorkerDetailPortal />
}
