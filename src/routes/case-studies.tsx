import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Section, SectionLabel, Reveal, GlassCard, fadeUp, stagger } from "../components/ui-primitives";
import { CTASection } from "./index";

export const Route = createFileRoute("/case-studies")({
  head: () => ({
    meta: [
      { title: "Case Studies — ThunSpark" },
      { name: "description", content: "Real businesses, real growth. See how we approach the challenge, build the strategy, run the campaigns, and measure what actually matters." },
      { property: "og:title", content: "Case Studies — ThunSpark" },
      { property: "og:description", content: "Real businesses. Real growth." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CaseStudies,
});

const studies = [
  {
    tag: "Healthcare",
    title: "A clinic that was invisible on Google",
    challenge: "Great doctors, great reviews — but almost nobody found them online. Bookings came from word of mouth and nothing else.",
    strategy: "We rebuilt their local presence around the searches patients actually type, and gave them one clear place to book.",
    execution: "Local SEO, a rewritten site with a booking flow, and a small, tightly targeted ad budget.",
    results: "3.4x more appointment requests and a steady stream of new patients every week.",
  },
  {
    tag: "Real Estate",
    title: "Leads were coming in — the wrong ones",
    challenge: "The team spent all day on calls with people who were never going to buy.",
    strategy: "Fewer, better leads. We changed who the ads spoke to and what the landing page asked for.",
    execution: "Rewritten ad creative, a qualification step before the form, and automated follow-up.",
    results: "Half the lead volume, three times the site visits booked.",
  },
  {
    tag: "Restaurants & Cafés",
    title: "A full room on weekdays, not just weekends",
    challenge: "Busy Friday and Saturday. Quiet the rest of the week.",
    strategy: "Build a local audience that actually lives nearby and give them a reason to come mid-week.",
    execution: "Weekly content, a simple offer campaign, and a WhatsApp list that reminds regulars.",
    results: "Mid-week covers up 62% within three months.",
  },
  {
    tag: "B2B Services",
    title: "From referrals only to a real pipeline",
    challenge: "Growth stopped the moment referrals slowed down.",
    strategy: "Give the founder a predictable way to start conversations without cold-calling all day.",
    execution: "LinkedIn outreach, a short email sequence, and automated appointment setting into their CRM.",
    results: "12–18 qualified calls booked every month, without the founder chasing anyone.",
  },
];

function CaseStudies() {
  return (
    <>
      <section className="container-page pt-8 sm:pt-12 md:pt-20">
        <Reveal>
          <SectionLabel>Case Studies</SectionLabel>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-7xl">
            Real businesses. <span className="text-gradient">Real growth.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
            We're focused on results, not promises. Every project starts with understanding the business, building the right strategy, and measuring what actually matters.
          </p>
        </Reveal>
      </section>

      <Section className="!pt-16 sm:!pt-24">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 lg:grid-cols-2"
        >
          {studies.map((s) => (
            <motion.div key={s.title} variants={fadeUp}>
              <GlassCard className="h-full">
                <div className="flex items-center justify-between">
                  <span className="rounded-full border border-border px-3 py-1 font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">
                    {s.tag}
                  </span>
                </div>
                <h2 className="mt-8 text-2xl font-medium leading-snug sm:text-3xl">{s.title}</h2>
                <dl className="mt-8 space-y-6">
                  {[
                    ["The Challenge", s.challenge],
                    ["Our Strategy", s.strategy],
                    ["Execution", s.execution],
                  ].map(([label, body]) => (
                    <div key={label}>
                      <dt className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">{label}</dt>
                      <dd className="mt-2 text-sm leading-relaxed text-muted-foreground">{body}</dd>
                    </div>
                  ))}
                </dl>
                <div className="mt-8 rounded-xl border border-accent/25 bg-accent/[0.06] p-5">
                  <div className="font-display text-xs uppercase tracking-[0.18em] text-accent">Results</div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground">{s.results}</p>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>

        <Reveal delay={0.1}>
          <div className="mt-10 rounded-3xl border border-dashed border-border p-10 text-center">
            <p className="text-base text-muted-foreground">
              More client stories are on the way. Yours could be the next one.
            </p>
          </div>
        </Reveal>
      </Section>

      <CTASection />
    </>
  );
}
