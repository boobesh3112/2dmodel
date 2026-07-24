import { useEffect, useState } from "react";
import { PlaygroundProvider, usePlayground, defaultModelState } from "@/context/PlaygroundContext";
import { ModelLibraryProvider, useModelLibrary } from "@/context/ModelLibraryContext";
import Live2DStage from "./Live2DStage";
import ModelLoader from "./ModelLoader";
import ModelSidebar from "./ModelSidebar";
import ModelManager from "./ModelManager";
import EmptyState from "./EmptyState";
import InfoPanel from "./InfoPanel";
import ControlPanel from "./ControlPanel";
import MotionPanel from "./MotionPanel";
import ExpressionPanel from "./ExpressionPanel";
import ParameterInspector from "./ParameterInspector";
import PartInspector from "./PartInspector";
import ExportPanel from "./ExportPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen,
  Sparkles,
} from "lucide-react";
import { Toaster } from "@/components/ui/sonner";

export default function Playground() {
  return (
    <PlaygroundProvider>
      <ModelLibraryProvider>
        <Shell />
        <Toaster theme="dark" richColors position="bottom-right" />
      </ModelLibraryProvider>
    </PlaygroundProvider>
  );
}

function Shell() {
  const { source, activeName, activeCubism, setState } = usePlayground();
  const { visibleModels, loading } = useModelLibrary();
  const [libraryOpen, setLibraryOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [managerId, setManagerId] = useState<string | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t?.tagName === "INPUT" || t?.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "r") setState({ ...defaultModelState });
      if (e.key.toLowerCase() === "f") setState((s) => ({ ...s, scale: 0.28, x: 0, y: 0 }));
      if (e.key.toLowerCase() === "l") setLibraryOpen((v) => !v);
      if (e.key === "ArrowLeft") setState((s) => ({ ...s, x: s.x - 10 }));
      if (e.key === "ArrowRight") setState((s) => ({ ...s, x: s.x + 10 }));
      if (e.key === "ArrowUp") setState((s) => ({ ...s, y: s.y - 10 }));
      if (e.key === "ArrowDown") setState((s) => ({ ...s, y: s.y + 10 }));
      if (e.key === "+" || e.key === "=")
        setState((s) => ({ ...s, scale: +(s.scale + 0.02).toFixed(3) }));
      if (e.key === "-" || e.key === "_")
        setState((s) => ({ ...s, scale: Math.max(0.05, +(s.scale - 0.02).toFixed(3)) }));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setState]);

  const noModelsAtAll = !loading && visibleModels.length === 0 && !source;

  return (
    <div className="h-screen w-screen overflow-hidden">
      {/* Header */}
      <header className="glass fixed inset-x-3 top-3 z-30 flex h-14 items-center justify-between rounded-2xl px-4">
        <div className="flex items-center gap-3">
          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setLibraryOpen((v) => !v)}
            title="Toggle library"
          >
            <Library className="h-5 w-5" />
          </Button>
          <div className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <div className="text-sm font-semibold tracking-tight neon-text">
              Live2D Playground
            </div>
            <div className="text-[11px] text-muted-foreground">
              {source ? `${activeName} · Cubism ${activeCubism}` : `${visibleModels.length} model${visibleModels.length === 1 ? "" : "s"} available`}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ModelLoader />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setLibraryOpen((v) => !v)}
            title="Toggle library (L)"
            className="hidden md:inline-flex"
          >
            {libraryOpen ? <PanelLeftClose /> : <PanelLeftOpen />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setRightOpen((v) => !v)}
            title="Toggle right panel"
            className="hidden md:inline-flex"
          >
            {rightOpen ? <PanelRightOpen /> : <PanelRightClose />}
          </Button>
        </div>
      </header>

      {/* Layout: [Library] [Info] [Stage] [Controls] */}
      <div
        className="grid h-full w-full gap-3 p-3 pt-20"
        style={{
          gridTemplateColumns: [
            libraryOpen ? "minmax(240px, 280px)" : "0px",
            "minmax(260px, 300px)",
            "1fr",
            rightOpen ? "minmax(300px, 340px)" : "0px",
          ].join(" "),
          transition: "grid-template-columns 200ms ease",
        }}
      >
        {/* Library sidebar */}
        <aside
          className={`glass overflow-hidden rounded-2xl transition-opacity ${
            libraryOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ModelSidebar onOpenManager={setManagerId} />
        </aside>

        {/* Info */}
        <aside className="glass scrollbar-thin hidden overflow-y-auto rounded-2xl p-4 md:block">
          <InfoPanel />
        </aside>

        {/* Stage */}
        <main className="glass relative overflow-hidden rounded-2xl">
          {noModelsAtAll ? <EmptyState /> : <Live2DStage />}
        </main>

        {/* Controls */}
        <aside
          className={`glass overflow-hidden rounded-2xl transition-opacity ${
            rightOpen ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <Tabs defaultValue="controls" className="flex h-full flex-col">
            <TabsList className="mx-3 mt-3 grid grid-cols-3 bg-muted/40">
              <TabsTrigger value="controls">Controls</TabsTrigger>
              <TabsTrigger value="motions">Motions</TabsTrigger>
              <TabsTrigger value="params">Params</TabsTrigger>
            </TabsList>
            <TabsContent value="controls" className="scrollbar-thin flex-1 overflow-y-auto p-4">
              <ControlPanel />
              <div className="mt-4">
                <ExportPanel />
              </div>
            </TabsContent>
            <TabsContent
              value="motions"
              className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
            >
              <MotionPanel />
              <ExpressionPanel />
            </TabsContent>
            <TabsContent
              value="params"
              className="scrollbar-thin flex-1 space-y-4 overflow-y-auto p-4"
            >
              <ParameterInspector />
              <PartInspector />
            </TabsContent>
          </Tabs>
        </aside>
      </div>

      <ModelManager openId={managerId} onOpenChange={(o) => !o && setManagerId(null)} />
    </div>
  );
}
