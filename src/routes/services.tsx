import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Bot, Code2, Palette, TrendingUp } from "lucide-react";
import { Section, SectionLabel, Reveal, fadeUp, stagger } from "../components/ui-primitives";
import { CTASection } from "./index";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Services — AI Automation, Web, Branding & Marketing" },
      { name: "description", content: "ThunSpark builds AI automation, websites and apps, branding and content, and digital marketing — everything your business needs to grow, under one roof." },
      { property: "og:title", content: "Services — ThunSpark Digital Growth Agency" },
      { property: "og:description", content: "AI automation, web & app development, branding & content, and digital marketing under one premium agency." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Services,
});

const categories = [
  {
    Icon: Bot,
    title: "AI Automation",
    description: "Automate repetitive tasks, improve efficiency, and scale your business with AI-powered workflows.",
    items: [
      "Lead Response Automation",
      "Sales Pipeline Automation",
      "CRM Automation",
      "Recruitment Automation",
      "Customer Support AI",
      "AI Chatbots",
      "Email & Follow-up Automation",
      "Business Process Automation",
      "Custom AI & n8n Workflows",
    ],
  },
  {
    Icon: Code2,
    title: "Web & App Development",
    description: "Build fast, modern, and scalable digital products that help your business grow.",
    items: [
      "Business Websites",
      "Landing Pages",
      "E-commerce Stores",
      "Custom Web Applications",
      "Mobile App Development (Android & iOS)",
      "Customer Portals",
      "Internal Dashboards",
      "API Integrations",
      "Website Maintenance",
    ],
  },
  {
    Icon: Palette,
    title: "Branding & Content Creation",
    description: "Build a memorable brand with professional design and high-quality content.",
    items: [
      "Brand Identity",
      "Logo Design",
      "Brand Guidelines",
      "Graphic Design",
      "Social Media Graphics",
      "LinkedIn Content Creation",
      "Instagram Content Creation",
      "Carousel Designs",
      "Marketing Creatives",
      "Ad Creatives",
      "Presentation Design",
      "Product Mockups",
      "Video Editing",
      "Motion Graphics",
      "Short-form Video Content (Reels & Shorts)",
    ],
  },
  {
    Icon: TrendingUp,
    title: "Digital Marketing",
    description: "Generate more traffic, leads, and customers with data-driven marketing.",
    items: [
      "Social Media Marketing",
      "Search Engine Optimization (SEO)",
      "Performance Marketing",
      "Google Ads",
      "Meta Ads",
      "LinkedIn Marketing",
      "Lead Generation",
      "Email Marketing",
      "Marketing Strategy",
      "Conversion Rate Optimization (CRO)",
    ],
  },
];

function Services() {
  return (
    <>
      <section className="container-page pt-6 sm:pt-10 md:pt-14">
        <Reveal>
          <SectionLabel>Services</SectionLabel>
          <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl md:text-[2.6rem]">
            Everything your business needs to grow — <span className="text-gradient">under one roof.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:mt-6 sm:text-lg">
            AI automation, web and app development, branding and content, and digital marketing. Pick one, or let us build the whole growth engine for you.
          </p>
        </Reveal>
      </section>

      <Section className="!pt-8 sm:!pt-10">
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid gap-4 sm:gap-5 lg:grid-cols-2"
        >
          {categories.map(({ Icon, title, description, items }, i) => (
            <motion.div key={title} variants={fadeUp}>
              <div className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-glass p-5 backdrop-blur-xl transition-all duration-500 hover:-translate-y-1 hover:border-accent/30 hover:bg-white/[0.07] sm:p-6">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                  <div className="absolute -inset-px rounded-2xl bg-gradient-to-br from-accent/15 via-transparent to-transparent" />
                </div>

                <div className="relative flex flex-col">
                  <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="font-display text-[0.7rem] uppercase tracking-[0.18em] text-accent">0{i + 1}</div>
                      <h2 className="truncate text-lg font-semibold tracking-tight sm:text-xl">{title}</h2>
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{description}</p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-border bg-white/[0.03] px-3 py-1.5 text-[0.78rem] leading-none text-muted-foreground transition-colors group-hover:border-accent/20 hover:text-foreground"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <CTASection />
    </>
  );
}
