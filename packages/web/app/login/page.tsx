'use client';

import { signIn } from 'next-auth/react';
import { GithubIcon } from 'lucide-react';

import { Button } from '@web/components/ui/button';
import { Label } from '@web/components/ui/label';

export default function SignIn() {
  return (
    <div className="flex flex-col gap-4">
      <Label variant="title-md">Sign in</Label>

      {/* <form className="flex flex-col gap-4"> */}
      <Button
        className="bg-neutral-900 text-white"
        onClick={() => signIn('github', { redirectTo: '/' })}
      >
        <GithubIcon />
        <Label variant="subtitle-md" className="font-medium">
          Sign in with GitHub
        </Label>
      </Button>
      {/* </form> */}
    </div>
  );
}
