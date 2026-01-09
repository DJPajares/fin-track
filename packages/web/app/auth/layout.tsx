export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="bg-background">
      <div className="mx-auto max-w-xl justify-center">
        <div className="flex min-h-[calc(100dvh-3rem)] flex-col gap-4 p-4 sm:min-h-[calc(100dvh-3.5rem)] sm:gap-8 sm:p-8">
          {children}
        </div>
      </div>
    </main>
  );
}
