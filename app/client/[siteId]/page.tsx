import ClientPortal from "./ClientPortal";

export async function generateStaticParams() {
  return [
    { siteId: 'SITE-001' },
    { siteId: 'SITE-002' },
  ];
}

export default function ClientPage({ params }: { params: { siteId: string } }) {
  return <ClientPortal params={params} />;
}
