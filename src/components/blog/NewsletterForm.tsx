import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Mail, Check } from "lucide-react";
import { subscribeNewsletter } from "@/lib/blog.functions";

export function NewsletterForm({ source = "blog" }: { source?: string }) {
  const subscribe = useServerFn(subscribeNewsletter);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  return (
    <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-semibold">Get the good stuff, monthly</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            One email a month with the plays we're using right now. Unsubscribe anytime.
          </p>
        </div>
        {state === "done" ? (
          <p className="inline-flex items-center gap-2 text-sm text-accent">
            <Check className="h-4 w-4" /> You're on the list.
          </p>
        ) : (
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setState("loading");
              try {
                await subscribe({ data: { email, source } });
                setState("done");
              } catch {
                setState("error");
              }
            }}
            className="flex w-full max-w-md gap-2"
          >
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
                className="w-full rounded-full border border-border bg-background/40 py-2.5 pl-10 pr-4 text-sm outline-none placeholder:text-muted-foreground focus:border-accent/50"
              />
            </div>
            <button
              type="submit"
              disabled={state === "loading"}
              className="rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-transform hover:scale-[1.03] disabled:opacity-60"
            >
              {state === "loading" ? "…" : "Subscribe"}
            </button>
          </form>
        )}
      </div>
      {state === "error" && (
        <p className="mt-2 text-xs text-muted-foreground">Something went wrong. Please try again.</p>
      )}
    </div>
  );
}
