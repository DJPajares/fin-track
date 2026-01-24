export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background flex h-[calc(100dvh-2rem)] items-center justify-center sm:h-[calc(100dvh-4rem)]">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
