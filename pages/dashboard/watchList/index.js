import { useRouter } from 'next/router';

export default function Watchlist() {
  const router = useRouter();

  async function handleAddToWatchlist(title, type) {
    const response = await fetch('/api/watchlist', {
      method: 'POST',
      body: JSON.stringify({
        title,
        type,
        userId: '123', // replace with actual user ID
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      console.log('Added to watchlist!');
    } else {
      console.error('Failed to add to watchlist');
    }
  }

  return (
    <div>
      <h1>Add to Watchlist</h1>
      <button onClick={() => handleAddToWatchlist('Inception', 'movie')}>
        Add Inception to Watchlist
      </button>
    </div>
  );
}
