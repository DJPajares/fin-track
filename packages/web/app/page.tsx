'use client';

import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="p-10">Welcome</h1>

      <button
        className="border-2 border-solid rounded-lg p-2"
        onClick={() => router.push('/dashboard')}
      >
        Go to Dashboard
      </button>
    </main>
  );
};

export default Home;
