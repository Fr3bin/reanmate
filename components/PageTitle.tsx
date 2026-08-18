export default function PageTitle({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl bg-section px-4 py-2.5 ${className}`}>
      <h1 className="font-[family-name:var(--font-display)] text-xl font-bold text-primary">
        {children}
      </h1>
    </div>
  );
}
