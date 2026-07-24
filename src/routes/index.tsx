import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Live2D Playground — Tune, Debug & Export Any Model" },
      {
        name: "description",
        content:
          "Load any Live2D Cubism 2/3/4 model, dial in scale and position, inspect motions, expressions, parameters, and export a JSON config.",
      },
      { property: "og:title", content: "Live2D Playground" },
      {
        property: "og:description",
        content: "Professional Live2D model debugging & tuning workbench.",
      },
    ],
  }),
  component: Page,
});

const Playground = lazy(() => import("@/components/playground/Playground"));

function Page() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  if (!hydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="glass rounded-2xl px-6 py-4 text-sm text-muted-foreground">
          Booting Live2D Playground…
        </div>
      </div>
    );
  }
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="glass rounded-2xl px-6 py-4 text-sm text-muted-foreground">
            Loading engine…
          </div>
        </div>
      }
    >
      <Playground />
    </Suspense>
  );
}
