import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail, Send, Check, AlertCircle } from "lucide-react";
import { LinkedInIcon } from "../components/BrandIcons";
import { motion, AnimatePresence } from "framer-motion";
import { Section, SectionLabel, Reveal } from "../components/ui-primitives";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Us — ThunSpark" },
      { name: "description", content: "Let's talk about your business. Tell us where you're at and we'll come back with honest advice on how to grow online." },
      { property: "og:title", content: "Contact Us — ThunSpark" },
      { property: "og:description", content: "Let's talk about your business." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Contact,
});

type State = "idle" | "submitting" | "success" | "error";

const serviceOptions = [
  "Social Media Marketing",
  "Performance Marketing",
  "Search Engine Optimization",
  "Website Design",
  "Lead Generation",
  "Marketing Automation",
  "Not sure yet",
];

function Contact() {
  const [form, setForm] = useState({
    name: "", company: "", email: "", phone: "", website: "", message: "",
  });
  const [selected, setSelected] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<State>("idle");

  function toggleService(s: string) {
    setSelected((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]));
  }

  function validate() {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    else if (form.name.length > 100) e.name = "Name is too long.";
    if (!form.company.trim()) e.company = "Please enter your company name.";
    if (!form.email.trim()) e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email.";
    if (!form.phone.trim()) e.phone = "Please add a phone number so we can reach you.";
    if (!form.message.trim()) e.message = "Tell us a bit about your business.";
    else if (form.message.length > 1000) e.message = "Message must be under 1000 characters.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setState("submitting");
    try {
      await new Promise((r) => setTimeout(r, 900));
      setState("success");
      setForm({ name: "", company: "", email: "", phone: "", website: "", message: "" });
      setSelected([]);
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <section className="container-page pt-5 sm:pt-6 md:pt-7">
        <Reveal>
          <SectionLabel>Contact Us</SectionLabel>
          <h1 className="mt-3 max-w-3xl text-2xl font-semibold leading-[1.08] tracking-tight sm:text-3xl md:text-4xl">
            Let's Talk About <span className="text-gradient">Your Business.</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Tell us where your business is today and what you'd like to grow. We'll come back with honest, practical advice.
          </p>
        </Reveal>
      </section>

      <Section className="!pt-5 sm:!pt-6">
        <div className="grid gap-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-8">
          {/* Info */}
          <Reveal>
            <div className="flex h-full flex-col gap-4">
              <div className="flex items-center gap-3 rounded-2xl border border-border bg-glass p-3.5">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-border bg-background/40 text-accent">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Email</div>
                  <a
                    href="mailto:hello@thunspark.agency"
                    className="mt-0.5 block break-words text-sm text-foreground transition-colors hover:text-accent"
                  >
                    hello@thunspark.agency
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-border bg-glass p-3.5">
                <div className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">Connect</div>
                <div className="flex gap-2">
                  <a
                    href="https://linkedin.com"
                    aria-label="LinkedIn"
                    target="_blank"
                    rel="noreferrer"
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                  >
                    <LinkedInIcon className="h-3.5 w-3.5" />
                  </a>
                  <a
                    href="mailto:hello@thunspark.agency"
                    aria-label="Email"
                    className="grid h-8 w-8 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                  >
                    <Mail className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="mt-auto rounded-2xl border border-border bg-glass p-3.5">
                <p className="text-sm font-medium tracking-tight text-foreground">Let's Grow Together.</p>
                <p className="mt-1 text-xs text-muted-foreground">No pressure, no sales tricks. Just honest advice.</p>
              </div>
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={0.1}>
            <form onSubmit={onSubmit} className="rounded-2xl border border-border bg-glass p-4 backdrop-blur-xl sm:p-5">
              <div className="space-y-3.5">
                <div className="grid gap-3.5 sm:grid-cols-2">
                  <Field
                    label="Full Name" id="name" error={errors.name}
                    input={
                      <input id="name" type="text" value={form.name} maxLength={100}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        placeholder="Your full name" className={inputCls} />
                    }
                  />
                  <Field
                    label="Company Name" id="company" error={errors.company}
                    input={
                      <input id="company" type="text" value={form.company} maxLength={120}
                        onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))}
                        placeholder="Your business" className={inputCls} />
                    }
                  />
                  <Field
                    label="Email Address" id="email" error={errors.email}
                    input={
                      <input id="email" type="email" value={form.email} maxLength={255}
                        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                        placeholder="you@company.com" className={inputCls} />
                    }
                  />
                  <Field
                    label="Phone Number" id="phone" error={errors.phone}
                    input={
                      <input id="phone" type="tel" value={form.phone} maxLength={30}
                        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                        placeholder="+1 555 000 0000" className={inputCls} />
                    }
                  />
                </div>

                <Field
                  label="Website (Optional)" id="website"
                  input={
                    <input id="website" type="text" value={form.website} maxLength={255}
                      onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                      placeholder="yourbusiness.com" className={inputCls} />
                  }
                />

                <div>
                  <span className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    Services Interested In
                  </span>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {serviceOptions.map((s) => {
                      const active = selected.includes(s);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => toggleService(s)}
                          aria-pressed={active}
                          className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                            active
                              ? "border-accent/50 bg-accent/15 text-foreground"
                              : "border-border bg-background/40 text-muted-foreground hover:border-accent/30 hover:text-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <Field
                  label="Message" id="message" error={errors.message}
                  input={
                    <textarea id="message" rows={3} maxLength={1000} value={form.message}
                      onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us where your business is today and what you'd like to grow…"
                      className={`${inputCls} resize-none`} />
                  }
                />

                <div>
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.01] hover:shadow-[0_12px_40px_-12px_rgba(255,237,105,0.6)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state === "submitting" ? "Sending…" : "Send Message"}
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </button>
                  <p className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
                    <span className="text-accent">⚡</span> We respond as fast as possible.
                  </p>
                </div>

                <AnimatePresence>
                  {state === "success" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-accent/30 bg-accent/10 px-4 py-2.5 text-sm text-foreground"
                    >
                      <Check className="h-4 w-4 text-accent" />
                      Got it. We'll get back to you as fast as possible.
                    </motion.div>
                  )}
                  {state === "error" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-sm"
                    >
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      Something went wrong. Please try again.
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </form>
          </Reveal>
        </div>
      </Section>
    </>
  );
}

const inputCls =
  "w-full rounded-xl border border-border bg-background/40 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-all focus:border-accent/50 focus:bg-background/60 focus:ring-2 focus:ring-accent/20";

function Field({ label, id, input, error }: { label: string; id: string; input: React.ReactNode; error?: string }) {
  return (
    <div>
      <label htmlFor={id} className="font-display text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5">{input}</div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}
