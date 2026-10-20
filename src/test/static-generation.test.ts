import { describe, expect, it, vi } from "vitest";

// Inspect the real configuration without starting Vite or its plugins.
vi.mock("@lovable.dev/vite-tanstack-config", () => ({
  defineConfig: (config: unknown) => config,
}));

import config from "../../vite.config";

describe("Static generation boundaries", () => {
  const options = config as {
    tanstackStart: {
      pages: { path: string }[];
      prerender: { enabled: boolean; autoStaticPathsDiscovery: boolean };
      server: { entry: string };
    };
  };

  it("generates every public content page and no account or API pages", () => {
    expect(options.tanstackStart.pages.map(({ path }) => path).sort()).toEqual(
      ["/", "/services", "/about", "/contact", "/privacy", "/terms", "/responsible-ai"].sort(),
    );
    expect(options.tanstackStart.prerender.enabled).toBe(true);
  });

  it("disables automatic discovery to prevent private routes being captured", () => {
    expect(options.tanstackStart.prerender.autoStaticPathsDiscovery).toBe(false);
  });

  it("preserves the existing server entry for dynamic account and AI requests", () => {
    expect(options.tanstackStart.server.entry).toBe("server");
  });
});