import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ArrowRight, ArrowUpRight, Share2, Target, Search, MonitorSmartphone, Users, Settings2,
} from "lucide-react";
import { MarketingVisual } from "../components/MarketingVisual";
import { Section, SectionLabel, Reveal, GlassCard, fadeUp, stagger } from "../components/ui-primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ThunSpark — Digital Marketing That Brings Customers" },
      { name: "description", content: "You built the business. We'll help the right people find it. Social media, ads, SEO, websites, lead generation and marketing automation — made simple." },
      { property: "og:title", content: "ThunSpark — Digital Marketing That Brings Customers" },
      { property: "og:description", content: "You built the business. We'll help the right people find it." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

const services = [
  { Icon: Share2, title: "Social Media Marketing", desc: "Show up where your customers already spend their time — with content people actually stop for." },
  { Icon: Target, title: "Performance Marketing", desc: "Ads that bring you buyers, not just clicks. Every rupee and dollar is tracked." },
  { Icon: Search, title: "Search Engine Optimization", desc: "Get found when someone searches for exactly what you sell." },
  { Icon: MonitorSmartphone, title: "Website Design", desc: "A fast, clean website that works like your best salesperson — day and night." },
  { Icon: Users, title: "Lead Generation", desc: "Stop waiting for customers to find you. We'll go find them for you." },
  { Icon: Settings2, title: "Marketing Automation", desc: "Follow-ups, reminders and nurture flows that run without you touching them." },
];

const reasons = [
  "We keep things simple.",
  "No confusing marketing jargon.",
  "Every strategy is built around your goals.",
  "We care about real business growth, not vanity metrics.",
  "We believe good communication builds long-term partnerships.",
  "We combine creativity, marketing, and automation to help your business move faster.",
];

const steps = [
  { step: "01", title: "We understand your business.", desc: "What you sell, who buys it, and what's getting in the way of more of it." },
  { step: "02", title: "We create a strategy built around your goals.", desc: "No copy-paste packages. A plan that fits where you are right now." },
  { step: "03", title: "We launch campaigns and optimize everything.", desc: "We watch the numbers weekly and keep improving what's working." },
  { step: "04", title: "You get more visibility, better leads, and measurable growth.", desc: "Real results you can see in your calendar and your bank account." },
];

const industries = [
  "Healthcare", "Real Estate", "Restaurants & Cafés",
  "Education", "Construction", "Professional Services",
  "Manufacturing", "Technology", "E-commerce",
  "Startups", "Local Businesses", "Corporate Companies",
];

function Home() {
  return (
    <>
      {/* HERO */}
      <section className="container-page relative flex min-h-[calc(100svh-5.5rem)] items-center py-6 sm:py-8 lg:py-10">
        <div className="grid w-full items-center gap-8 lg:gap-14 lg:grid-cols-[1.15fr_1fr]">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp}>
              <SectionLabel>Digital Marketing Solutions</SectionLabel>
            </motion.div>
            <motion.h1
              variants={fadeUp}
              className="mt-4 text-3xl font-semibold leading-[1.1] tracking-tight sm:mt-5 sm:text-4xl lg:text-5xl"
            >
              <span className="text-gradient">You built the business.</span>
              <br />We'll help the right
              <br />people find it.
            </motion.h1>
            <motion.p variants={fadeUp} className="mt-4 max-w-lg text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
              Whether you're launching something new or trying to grow faster, we help you get seen online, attract better customers, and turn attention into real business growth.
            </motion.p>
            <motion.div variants={fadeUp} className="mt-6 flex flex-wrap gap-3 sm:mt-7">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.03] hover:shadow-[0_12px_40px_-12px_rgba(255,237,105,0.6)]"
              >
                Book a Free Strategy Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/services"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-glass px-5 py-3 text-sm font-medium text-foreground backdrop-blur-xl transition-all hover:border-accent/40 hover:bg-white/[0.07]"
              >
                Explore Our Services
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <MarketingVisual />
          </motion.div>
        </div>
      </section>


      {/* TRUST */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Keeping it simple</SectionLabel>
            <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Marketing shouldn't feel complicated.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">
              You're already busy running your business. The last thing you need is another agency throwing confusing reports and fancy marketing terms at you.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              We keep things simple. We help you get more visibility, more leads, and more customers while you stay focused on running your business.
            </p>
          </div>
        </Reveal>
      </Section>

      {/* SERVICES PREVIEW */}
      <Section>
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <Reveal>
            <SectionLabel>What we do</SectionLabel>
            <h2 className="mt-4 max-w-2xl text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Everything you need to <span className="text-muted-foreground">grow online.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/services" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-accent">
              See All Services
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </Reveal>
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp}>
              <GlassCard className="h-full">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* INDUSTRIES */}
      <Section>
        <Reveal>
          <SectionLabel>Industries</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            We work with businesses that want to grow.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-3"
        >
          {industries.map((ind, i) => (
            <motion.div
              key={ind}
              variants={fadeUp}
              className="group relative bg-background p-4 sm:p-5 transition-colors hover:bg-glass"
            >
              <div className="font-display text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</div>
              <div className="mt-2 text-lg font-medium">{ind}</div>
              <ArrowUpRight className="absolute right-5 top-5 h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:opacity-100 group-hover:text-accent" />
            </motion.div>
          ))}
        </motion.div>
        <Reveal delay={0.1}>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
            No matter your industry, if your goal is to grow online, we're here to help.
          </p>
        </Reveal>
      </Section>

      {/* WHY THUNSPARK */}
      <Section>
        <Reveal>
          <div className="mx-auto max-w-3xl text-center">
            <SectionLabel>Why ThunSpark</SectionLabel>
            <h2 className="mt-5 text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
              Why businesses choose us.
            </h2>
          </div>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reasons.map((r, i) => (
            <motion.div key={r} variants={fadeUp}>
              <GlassCard className="h-full">
                <span className="font-display text-xs text-accent">0{i + 1}</span>
                <p className="mt-6 text-base font-medium leading-snug">{r}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      {/* PROCESS */}
      <Section>
        <Reveal>
          <SectionLabel>Our Process</SectionLabel>
          <h2 className="mt-4 max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">
            Here's how we work together.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {steps.map((s) => (
            <motion.div key={s.step} variants={fadeUp}>
              <GlassCard className="h-full">
                <div className="font-display text-xs text-accent">{s.step}</div>
                <h3 className="mt-5 text-lg font-medium leading-snug">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <CTASection />
    </>
  );
}

export function CTASection() {
  return (
    <Section>
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl border border-border bg-glass p-7 backdrop-blur-xl sm:p-10 md:p-14">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
          <div className="relative grid items-center gap-8 md:grid-cols-[1.5fr_1fr]">
            <div>
              <h2 className="text-2xl font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
                Ready to grow your business online?
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground">
                Let's have a conversation. No pressure. No sales tricks. Just honest advice about how your business can grow.
              </p>
            </div>
            <div className="flex md:justify-end">
              <Link
                to="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-4 text-sm font-medium text-accent-foreground transition-all hover:scale-[1.03] hover:shadow-[0_12px_40px_-12px_rgba(255,237,105,0.6)]"
              >
                Book a Free Strategy Call
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
