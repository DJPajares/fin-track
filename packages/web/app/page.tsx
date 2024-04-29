'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="p-10">Welcome</h1>

      <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
    </main>
  );
};

export default Home;
