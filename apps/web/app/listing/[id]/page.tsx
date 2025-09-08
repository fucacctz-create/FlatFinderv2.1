import type { ListingResponse } from '../../../../packages/shared/src/types';

type Props = { params: { id: string } };

async function getListing(id: string): Promise<ListingResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/listings/${id}`, { next: { revalidate: 0 } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch listing: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export default async function ListingPage({ params }: Props) {
  const data = await getListing(params.id);

  return (
    <main style={{ padding: 24 }}>
      <h1>{data.title}</h1>
      <p>{data.location}</p>
      <p>${(data.price ?? 0).toLocaleString()}</p>
      {data.contact?.redacted ? (
        <p>Contact details are hidden. Please upgrade to view.</p>
      ) : (
        <div>
          <p>Email: {data.contact?.email}</p>
          <p>Phone: {data.contact?.phone}</p>
        </div>
      )}
    </main>
  );
}
