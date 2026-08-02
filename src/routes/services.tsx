import { createFileRoute } from "@tanstack/react-router";
import {
  Share2, Target, Search, MonitorSmartphone, Users, Settings2, Check,
} from "lucide-react";
import { Section, SectionLabel, Reveal } from "../components/ui-primitives";
import { CTASection } from "./index";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — ThunSpark Digital Marketing" },
      { name: "description", content: "Social media, paid ads, SEO, website design, lead generation and marketing automation — built around your goals, not a generic package." },
      { property: "og:title", content: "Services — ThunSpark Digital Marketing" },
      { property: "og:description", content: "Marketing that actually moves your business forward." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

const services = [
  {
    Icon: Share2, title: "Social Media Marketing",
    description: "We help people discover your business before they discover your competitors.",
    benefits: ["Content people actually stop for", "A page that looks like a real brand", "Steady growth, not one-off spikes"],
    useCases: ["Instagram", "Facebook", "LinkedIn", "X", "Content Creation", "Community Management", "Brand Growth"],
  },
  {
    Icon: Target, title: "Performance Marketing",
    description: "Run smarter ads that bring better customers — not just cheap clicks.",
    benefits: ["Every campaign tied to a business goal", "Clear reporting you can read in a minute", "Budget spent where it converts"],
    useCases: ["Google Ads", "Meta Ads", "LinkedIn Ads", "Remarketing", "Landing Pages", "Conversion Optimization"],
  },
  {
    Icon: Search, title: "Search Engine Optimization",
    description: "Show up when customers are already looking for businesses like yours.",
    benefits: ["Traffic that keeps coming without ad spend", "Found by people ready to buy", "Stronger trust from day one"],
    useCases: ["Keyword Research", "Technical SEO", "Local SEO", "Content SEO"],
  },
  {
    Icon: MonitorSmartphone, title: "Website Design",
    description: "Your website should work as your best salesperson.",
    benefits: ["Fast and mobile friendly", "Built to convert, not just look pretty", "Easy for you to update"],
    useCases: ["Landing Pages", "Business Websites", "Conversion Focused Design", "Modern, Clean Layouts"],
  },
  {
    Icon: Users, title: "Lead Generation",
    description: "Stop waiting for customers to find you. We'll help you find them.",
    benefits: ["A predictable flow of conversations", "Better fit prospects", "Less time chasing dead ends"],
    useCases: ["LinkedIn Outreach", "Cold Email", "Appointment Setting", "Sales Funnels"],
  },
  {
    Icon: Settings2, title: "Marketing Automation",
    description: "Work less. Grow more.",
    benefits: ["Nothing falls through the cracks", "Faster follow-up means more sales", "Your team focuses on real conversations"],
    useCases: ["Automated follow-ups", "Lead nurturing", "CRM workflows", "Email automation", "AI-powered marketing systems"],
  },
];

function Services() {
  return (
    <>
      <section className="container-page pt-6 sm:pt-10 md:pt-14">
        <Reveal>
          <SectionLabel>Services</SectionLabel>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-5xl">
            Marketing that actually <span className="text-gradient">moves your business forward.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-8 sm:text-lg">
            Every business is different. That's why we don't force the same marketing package on everyone. We build strategies based on where you are today and where you want to go.
          </p>
        </Reveal>
      </section>

      <Section className="!pt-12 sm:!pt-16">
        <div className="space-y-10 sm:space-y-14">
          {services.map((s, i) => (
            <Reveal key={s.title}>
              <div className={`grid items-center gap-8 lg:gap-12 lg:grid-cols-2 ${i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""}`}>
                <div>
                  <div className="font-display text-sm text-accent">0{i + 1} — Service</div>
                  <div className="mt-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-border bg-glass text-accent">
                    <s.Icon className="h-6 w-6" />
                  </div>
                  <h2 className="mt-5 text-2xl font-semibold tracking-tight sm:text-3xl md:text-4xl">{s.title}</h2>
                  <p className="mt-5 text-base leading-relaxed text-muted-foreground">{s.description}</p>
                </div>

                <div className="grid gap-5">
                  <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl sm:p-6">
                    <h3 className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">What it does for you</h3>
                    <ul className="mt-5 space-y-3">
                      {s.benefits.map((b) => (
                        <li key={b} className="flex items-start gap-3 text-sm">
                          <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-accent/15 text-accent">
                            <Check className="h-3 w-3" strokeWidth={3} />
                          </span>
                          <span className="text-foreground">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl sm:p-6">
                    <h3 className="font-display text-xs uppercase tracking-[0.18em] text-muted-foreground">What's included</h3>
                    <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
                      {s.useCases.map((u) => (
                        <li key={u} className="flex items-start gap-3">
                          <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                          {u}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <CTASection />
    </>
  );
}
