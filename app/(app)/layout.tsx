import Footer from "@/components/Footer";
import Header from "@/components/Header";

import { requireUser } from "@/lib/server-auth";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  return (
    <div className="flex min-h-screen flex-col bg-bg">
      <Header user={user} />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:py-10">
        {children}
      </main>
      <Footer />
    </div>
  );
}
