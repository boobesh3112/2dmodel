import { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FolderOpen, Upload } from "lucide-react";
import {
  buildLoadedModel,
  filesFromDataTransfer,
  filesFromInput,
} from "@/lib/live2d/loader";
import { usePlayground } from "@/context/PlaygroundContext";
import { toast } from "sonner";

export default function ModelLoader() {
  const inputRef = useRef<HTMLInputElement>(null);
  const { loadFromFiles } = usePlayground();
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const prevent = (e: DragEvent) => {
      e.preventDefault();
      setDragOver(true);
    };
    const leave = () => setDragOver(false);
    const drop = async (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!e.dataTransfer) return;
      try {
        const files = await filesFromDataTransfer(e.dataTransfer);
        await ingest(files);
      } catch (err) {
        toast.error("Failed to read dropped files", { description: String(err) });
      }
    };
    window.addEventListener("dragover", prevent);
    window.addEventListener("dragleave", leave);
    window.addEventListener("drop", drop);
    return () => {
      window.removeEventListener("dragover", prevent);
      window.removeEventListener("dragleave", leave);
      window.removeEventListener("drop", drop);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function ingest(files: File[]) {
    try {
      const nextLoaded = buildLoadedModel(files);
      loadFromFiles(nextLoaded);
      toast.success(`Loaded ${nextLoaded.rootName}`, {
        description: `${nextLoaded.files.size} files · Cubism ${nextLoaded.cubismVersion}`,
      });
    } catch (err: any) {
      toast.error("Model load failed", { description: err?.message ?? String(err) });
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        multiple
        // @ts-expect-error non-standard but supported in Chromium/Safari/Firefox
        webkitdirectory=""
        directory=""
        className="hidden"
        onChange={async (e) => {
          if (!e.target.files) return;
          const files = await filesFromInput(e.target.files);
          await ingest(files);
          e.target.value = "";
        }}
      />
      <Button
        variant="secondary"
        size="sm"
        onClick={() => inputRef.current?.click()}
        className="gap-1.5"
      >
        <FolderOpen className="h-4 w-4" />
        <span className="hidden sm:inline">Load folder</span>
      </Button>
      {dragOver && (
        <div className="pointer-events-none fixed inset-0 z-50 flex items-center justify-center bg-background/60 backdrop-blur-sm">
          <div className="glass flex items-center gap-3 rounded-2xl px-6 py-5 text-lg">
            <Upload className="h-6 w-6 text-primary" />
            Drop the model folder anywhere
          </div>
        </div>
      )}
    </>
  );
}
