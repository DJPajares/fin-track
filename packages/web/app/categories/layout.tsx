export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col gap-4 p-4 pt-16 sm:gap-8 sm:p-8 sm:pt-18">
      {children}
    </div>
  );
}
