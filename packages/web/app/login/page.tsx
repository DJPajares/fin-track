'use client';

import { signIn } from 'next-auth/react';
import { GithubIcon } from 'lucide-react';

import { Button } from '@web/components/ui/button';
import { Label } from '@web/components/ui/label';

export default function SignIn() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-6 p-8">
        <div className="flex flex-col items-center space-y-2 text-center">
          <Label variant="title-lg">Fin-Track</Label>
          <Label variant="subtitle-md" className="text-muted-foreground">
            Sign in to your account
          </Label>
        </div>

        <div className="space-y-4">
          <Button
            className="w-full bg-neutral-900 text-white hover:bg-neutral-800"
            onClick={() => signIn('github', { redirectTo: '/' })}
          >
            <GithubIcon className="mr-2 h-5 w-5" />
            Sign in with GitHub
          </Button>
        </div>
      </div>
    </div>
  );
}
