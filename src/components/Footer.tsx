import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import logoAsset from "../assets/thunspark-logo.png.asset.json";
import { LinkedInIcon, InstagramIcon } from "./BrandIcons";

const socials = [
  { href: "https://linkedin.com", label: "LinkedIn", Icon: LinkedInIcon },
  { href: "https://instagram.com", label: "Instagram", Icon: InstagramIcon },
  { href: "mailto:hello@thunspark.com", label: "Email", Icon: Mail },
];

export function Footer() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="container-page py-12">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img src={logoAsset.url} alt="ThunSpark" className="h-9 w-9 object-contain" />
              <span className="font-display text-lg font-semibold">ThunSpark</span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted-foreground">
              We help businesses launch, grow, and scale online with marketing that actually brings customers.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-medium text-foreground">Navigation</h4>
            <ul className="mt-5 space-y-3 text-sm text-muted-foreground">
              {[
                { to: "/services", label: "Services" },
                { to: "/case-studies", label: "Case Studies" },
                { to: "/about", label: "About" },
                { to: "/contact", label: "Contact" },
              ].map((l) => (

                <li key={l.to}>
                  <Link to={l.to} className="transition-colors hover:text-foreground">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-medium text-foreground">Connect</h4>
            <div className="mt-5 flex gap-3">
              {socials.map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer"
                  className="grid h-10 w-10 place-items-center rounded-full border border-border bg-glass text-muted-foreground transition-all hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-3 border-t border-border pt-6 text-xs text-muted-foreground md:flex-row md:items-center">
          <span>© 2026 ThunSpark. All Rights Reserved.</span>
          <span>Marketing made simple. Growth made real.</span>
        </div>
      </div>
    </footer>
  );
}
