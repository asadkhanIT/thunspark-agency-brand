import { createFileRoute } from "@tanstack/react-router";
import { HeartHandshake, Sparkles, Eye, TrendingUp, Users, RefreshCw } from "lucide-react";
import { Section, SectionLabel, Reveal, GlassCard, fadeUp, stagger } from "../components/ui-primitives";
import { motion } from "framer-motion";
import { CTASection } from "./index";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — ThunSpark" },
      { name: "description", content: "We started ThunSpark because too many great businesses never get found. We help businesses launch, grow, and scale online with honest, clear marketing." },
      { property: "og:title", content: "About — ThunSpark" },
      { property: "og:description", content: "We started ThunSpark for one simple reason." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: About,
});

const values = [
  { Icon: HeartHandshake, title: "Honesty", desc: "We'll tell you what's working and what isn't — even when it's not what you want to hear." },
  { Icon: Sparkles, title: "Creativity", desc: "Ideas that get noticed, not recycled templates everyone else is using." },
  { Icon: Eye, title: "Transparency", desc: "You always know where your budget went and what it brought back." },
  { Icon: TrendingUp, title: "Growth", desc: "We measure success by your business results, not by likes." },
  { Icon: Users, title: "Partnership", desc: "We work like part of your team, because that's how good work happens." },
  { Icon: RefreshCw, title: "Continuous Improvement", desc: "Every month we look at the numbers and make it better." },
];

function About() {
  return (
    <>
      <section className="container-page pt-8 sm:pt-12 md:pt-20">
        <Reveal>
          <SectionLabel>About ThunSpark</SectionLabel>
          <h1 className="mt-6 max-w-4xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl md:text-6xl">
            We started ThunSpark for <span className="text-gradient">one simple reason.</span>
          </h1>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-10 grid gap-8 border-t border-border pt-10 sm:mt-12 sm:gap-10 sm:pt-12 md:grid-cols-2">
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              Too many businesses have amazing products and services that never get the attention they deserve. Not because they're bad. Because the right people never find them.
            </p>
            <p className="text-base leading-relaxed text-muted-foreground sm:text-lg">
              That's why we built ThunSpark — to help businesses launch, grow, and scale online with marketing that's clear, honest, and focused on real results.
            </p>
          </div>
        </Reveal>
      </section>

      {/* MISSION & VISION */}
      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          <Reveal>
            <GlassCard className="h-full">
              <div className="font-display text-xs uppercase tracking-[0.18em] text-accent">Our Mission</div>
              <p className="mt-6 text-xl font-medium leading-snug sm:text-2xl">
                To help businesses grow with marketing that feels simple, transparent, and effective.
              </p>
            </GlassCard>
          </Reveal>
          <Reveal delay={0.1}>
            <GlassCard className="h-full">
              <div className="font-display text-xs uppercase tracking-[0.18em] text-accent">Our Vision</div>
              <p className="mt-6 text-xl font-medium leading-snug sm:text-2xl">
                To become the growth partner businesses trust when they're ready to reach the next level.
              </p>
            </GlassCard>
          </Reveal>
        </div>
      </Section>

      {/* VALUES */}
      <Section>
        <Reveal>
          <SectionLabel>Our Values</SectionLabel>
          <h2 className="mt-5 max-w-2xl text-3xl font-semibold tracking-tight sm:text-4xl">
            What you can expect from working with us.
          </h2>
        </Reveal>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {values.map(({ Icon, title, desc }) => (
            <motion.div key={title} variants={fadeUp}>
              <GlassCard className="h-full">
                <Icon className="h-6 w-6 text-accent" />
                <h3 className="mt-8 text-lg font-medium">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <CTASection />
    </>
  );
}
