import { createFileRoute, Outlet, redirect, Link, useRouterState } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { FileText, Plus, LogOut } from "lucide-react";

export const Route = createFileRoute("/admin")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    if (location.pathname.startsWith("/admin/login")) return;
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/admin/login" });
    const { data: isAdmin } = await supabase.rpc("is_admin");
    if (!isAdmin) throw redirect({ to: "/admin/login", search: { denied: true } });
  },
  component: AdminLayout,
});

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname.startsWith("/admin/login");

  if (isLogin) {
    return (
      <>
        <Outlet />
        <Toaster />
      </>
    );
  }

  return (
    <div className="container-page py-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border bg-glass px-4 py-3 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold tracking-tight">ThunSpark Studio</span>
          <span className="text-xs text-muted-foreground">Content</span>
        </div>
        <nav className="flex flex-wrap items-center gap-2 text-sm">
          <Link
            to="/admin"
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
            activeProps={{ className: "inline-flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-3 py-1.5 text-accent" }}
            activeOptions={{ exact: true }}
          >
            <FileText className="h-4 w-4" /> Posts
          </Link>
          <Link
            to="/admin/posts/new"
            className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-1.5 font-medium text-accent-foreground transition-transform hover:scale-[1.02]"
          >
            <Plus className="h-4 w-4" /> New article
          </Link>
          <button
            type="button"
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = "/admin/login";
            }}
            className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-1.5 text-muted-foreground transition-colors hover:text-foreground"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </nav>
      </div>
      <Outlet />
      <Toaster />
    </div>
  );
}
