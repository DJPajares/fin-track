'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

const Home = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="pb-5">Welcome</h1>
      <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
    </div>
  );
};

export default Home;
