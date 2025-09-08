import Link from 'next/link';
import type { MatchesResponse } from '../../../packages/shared/src/types';

async function getMatches(): Promise<MatchesResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/matches`, { next: { revalidate: 0 } });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`Failed to fetch matches: ${res.status} ${res.statusText} ${text}`);
  }
  return res.json();
}

export default async function Page() {
  let data: MatchesResponse = { items: [], entitlements: { canViewContact: false, canRequestOutreach: false, weeklyMatchQuota: 0 } };
  try {
    data = await getMatches();
  } catch (e: any) {
    return (
      <main style={{ padding: 24 }}>
        <h1>FlatFinder — Matches</h1>
        <p style={{ color: 'crimson' }}>Error: {e?.message}</p>
        <p>Check that the API is running at {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'} and responding to /health.</p>
      </main>
    );
  }

  const { items, entitlements } = data;

  return (
    <main style={{ padding: 24 }}>
      <h1>FlatFinder — Matches</h1>
      <p>Entitlements: {JSON.stringify(entitlements)}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
        {items.map((item) => (
          <article key={item.id} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>{item.title}</h3>
            <p>{item.location}</p>
            <p>${item.price.toLocaleString()}</p>
            <p>Contact: {item.contactAvailable ? 'Available' : 'Upgrade to view'}</p>
            <Link href={`/listing/${item.id}`}>View details</Link>
          </article>
        ))}
      </div>
    </main>
  );
}
