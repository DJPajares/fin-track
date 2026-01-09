export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background flex min-h-[calc(100dvh-3rem)] items-center justify-center sm:min-h-[calc(100dvh-3.5rem)]">
      <div className="w-full max-w-md">{children}</div>
    </main>
  );
}
