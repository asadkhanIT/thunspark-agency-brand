import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Studio Login — ThunSpark" },
      { name: "description", content: "Secure login for the ThunSpark content studio." },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Studio Login — ThunSpark" },
      { property: "og:description", content: "Secure login for the ThunSpark content studio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw error;
      const { data: isAdmin } = await supabase.rpc("is_admin");
      if (!isAdmin) {
        await supabase.auth.signOut();
        toast.error("This account does not have studio access.");
        return;
      }
      navigate({ to: "/admin" });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not sign you in.");
    } finally {
      setBusy(false);
    }
  }

  const inputClass =
    "w-full rounded-xl border border-border bg-white/[0.03] px-3 py-2.5 text-sm outline-none transition-colors focus:border-accent/50";

  return (
    <div className="container-page flex min-h-[calc(100svh-10rem)] items-center justify-center py-10">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-2xl border border-border bg-glass p-6 backdrop-blur-xl"
      >
        <div className="mb-5 flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-accent/40 bg-accent/10 text-accent">
            <Lock className="h-4 w-4" />
          </span>
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Studio access</h1>
            <p className="text-xs text-muted-foreground">Admins only</p>
          </div>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@thunspark.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputClass}
          />
          <input
            type="password"
            required
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={inputClass}
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Sign in
        </button>
      </form>
    </div>
  );
}
