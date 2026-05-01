import Nav from "@/components/nav";
import AuthGuard from "@/components/auth-guard";
import SnapshotSync from "@/components/snapshot-sync";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SnapshotSync />
      <Nav />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-8 sm:py-10">
        {children}
      </main>
    </AuthGuard>
  );
}
