import { Link } from "@tanstack/react-router";
import {
  Globe,
  PanelTop,
  Layers,
  RefreshCw,
  MousePointer2,
  Search,
  ArrowUpRight,
  Check,
} from "lucide-react";
import { services } from "@/lib/site-config";
import { Button } from "@/components/ui/button";
const icons = { Globe, PanelTop, Layers, RefreshCw, MousePointer2, Search };
export function ServiceGrid({ detailed = false }: { detailed?: boolean }) {
  return (
    <div className="service-grid">
      {services.map((s, i) => {
        const Icon = icons[s.icon as keyof typeof icons];
        return (
          <article className="service-card" key={s.title}>
            <span className={`service-icon service-icon-${i % 3}`}>
              <Icon size={23} />
            </span>
            <h3>{s.title}</h3>
            <p>{s.description}</p>
            {detailed && (
              <ul>
                {s.benefits.map((b) => (
                  <li key={b}>
                    <Check size={15} />
                    {b}
                  </li>
                ))}
              </ul>
            )}
            <Button variant="link" asChild>
              <Link to="/contact">
                {detailed ? "Request a Quote" : "Learn more"}
                <ArrowUpRight />
              </Link>
            </Button>
          </article>
        );
      })}
    </div>
  );
}
