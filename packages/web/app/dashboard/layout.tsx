export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl py-4 sm:py-8">
      <div className="w-full">{children}</div>
    </div>
  );
}
