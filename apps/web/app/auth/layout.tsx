import { CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const t = await getTranslations('Auth.panel');

  return (
    <div className="bg-background flex h-[calc(100dvh-2rem)] sm:h-[calc(100dvh-4rem)]">
      {/* Left brand panel — hidden on mobile */}
      <div className="bg-primary text-primary-foreground relative hidden flex-col justify-between overflow-hidden p-12 sm:flex sm:w-1/2">
        {/* Decorative circles */}
        <div className="absolute -top-32 -left-32 size-96 rounded-full bg-white/10" />
        <div className="absolute -right-20 -bottom-40 size-112 rounded-full bg-white/10" />
        <div className="absolute top-1/2 -right-24 size-64 rounded-full bg-white/5" />

        {/* Logo */}
        <div className="relative flex items-center gap-3">
          <Image
            src="/icons/icon-192x192.png"
            alt="FinTrack"
            width={40}
            height={40}
            className="rounded-xl"
          />
          <span className="font-[--font-sans] text-2xl font-bold tracking-tight">
            FinTrack
          </span>
        </div>

        {/* Centre copy */}
        <div className="relative space-y-8">
          <h2 className="font-[--font-sans] text-4xl leading-tight font-bold">
            {t('tagline')}
          </h2>
          <ul className="space-y-4">
            {(['feature1', 'feature2', 'feature3'] as const).map((key) => (
              <li key={key} className="flex items-center gap-3 text-base">
                <CheckCircle2 className="size-5 shrink-0 opacity-80" />
                <span className="opacity-90">{t(key)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Footer */}
        <p className="relative text-sm opacity-60">
          © {new Date().getFullYear()} FinTrack
        </p>
      </div>

      {/* Right form panel */}
      <main className="flex flex-1 items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-sm">{children}</div>
      </main>
    </div>
  );
}
