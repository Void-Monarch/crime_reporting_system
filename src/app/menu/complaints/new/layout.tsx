export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
