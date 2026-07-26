import { usePlayground, defaultModelState } from "@/context/PlaygroundContext";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RotateCcw, Move, Maximize, Crosshair, Copy, Upload, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { useRef } from "react";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
        {title}
      </div>
      <div className="glass-inset space-y-3 p-3">{children}</div>
    </section>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-mono text-foreground">
          {value.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0)}
          {suffix}
        </span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(v) => onChange(v[0])}
      />
    </div>
  );
}

export default function ControlPanel() {
  const {
    state,
    setState,
    background,
    setBackground,
    bgColor,
    setBgColor,
    bgImageUrl,
    setBgImageUrl,
    bgImageFit,
    setBgImageFit,
    bgImageOpacity,
    setBgImageOpacity,
    debug,
    setDebug,
    info,
    extras,
    removeExtra,
    updateExtra,
    clearExtras,
  } = usePlayground();
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      <Section title="Scale">
        <SliderRow
          label="Scale"
          value={state.scale}
          min={0.02}
          max={5}
          step={0.005}
          onChange={(v) => setState((s) => ({ ...s, scale: v }))}
        />
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" variant="secondary" onClick={() => setState((s) => ({ ...s, scale: 1 }))}>
            <RotateCcw className="mr-1 h-3 w-3" /> 1.0
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setState((s) => ({ ...s, scale: 0.25 }))}>
            Default
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              if (!info.canvasHeight) return;
              // rough auto-fit: assume model native height ~2000 units
              const target = (info.canvasHeight * 0.85) / 2000;
              setState((s) => ({ ...s, scale: +target.toFixed(3), x: 0, y: 0 }));
            }}
          >
            <Maximize className="mr-1 h-3 w-3" /> Fit
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              navigator.clipboard.writeText(state.scale.toFixed(3));
              toast.success(`Copied ${state.scale.toFixed(3)}`);
            }}
          >
            <Copy className="mr-1 h-3 w-3" /> Copy
          </Button>
        </div>
      </Section>

      <Section title="Position">
        <SliderRow
          label="X"
          value={state.x}
          min={-1000}
          max={1000}
          step={1}
          onChange={(v) => setState((s) => ({ ...s, x: v }))}
        />
        <SliderRow
          label="Y"
          value={state.y}
          min={-1000}
          max={1000}
          step={1}
          onChange={(v) => setState((s) => ({ ...s, y: v }))}
        />
        <div className="flex gap-1.5">
          <Button size="sm" variant="secondary" onClick={() => setState((s) => ({ ...s, x: 0, y: 0 }))}>
            <Crosshair className="mr-1 h-3 w-3" /> Center
          </Button>
          <Button size="sm" variant="outline" onClick={() => setState({ ...defaultModelState })}>
            Reset all
          </Button>
        </div>
      </Section>

      <Section title="Rotation & Opacity">
        <SliderRow
          label="Rotation"
          value={state.rotation}
          min={-180}
          max={180}
          step={1}
          suffix="°"
          onChange={(v) => setState((s) => ({ ...s, rotation: v }))}
        />
        <SliderRow
          label="Opacity"
          value={state.opacity}
          min={0}
          max={1}
          step={0.01}
          onChange={(v) => setState((s) => ({ ...s, opacity: v }))}
        />
      </Section>

      <Section title="Animation & Drag">
        <SliderRow
          label="Anim speed"
          value={state.animationSpeed}
          min={0.1}
          max={3}
          step={0.05}
          suffix="x"
          onChange={(v) => setState((s) => ({ ...s, animationSpeed: v }))}
        />
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">
            <Move className="mr-1 inline h-3 w-3" /> Enable drag
          </Label>
          <Switch
            checked={state.dragEnabled}
            onCheckedChange={(v) => setState((s) => ({ ...s, dragEnabled: v }))}
          />
        </div>
      </Section>

      <Section title="Background">
        <div className="grid grid-cols-3 gap-1.5">
          {(["grid", "checker", "solid", "gradient", "transparent", "image"] as const).map((b) => (
            <Button
              key={b}
              size="sm"
              variant={background === b ? "default" : "secondary"}
              onClick={() => setBackground(b)}
              className="capitalize"
            >
              {b}
            </Button>
          ))}
        </div>
        {(background === "solid" || background === "gradient") && (
          <div className="flex items-center gap-2">
            <Label className="text-xs text-muted-foreground">Color</Label>
            <Input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-16 p-1"
            />
          </div>
        )}
        {background === "image" && (
          <div className="space-y-2">
            <div>
              <Label className="text-[11px] text-muted-foreground">Image URL</Label>
              <div className="mt-1 flex items-center gap-1">
                <Input
                  type="url"
                  placeholder="https://example.com/hero.jpg"
                  value={bgImageUrl}
                  onChange={(e) => setBgImageUrl(e.target.value)}
                  className="h-8 text-xs"
                />
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (!f) return;
                    const reader = new FileReader();
                    reader.onload = () => setBgImageUrl(String(reader.result));
                    reader.readAsDataURL(f);
                    e.target.value = "";
                  }}
                />
                <Button
                  size="icon"
                  variant="secondary"
                  className="h-8 w-8 shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload image"
                >
                  <Upload className="h-3.5 w-3.5" />
                </Button>
                {bgImageUrl && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 shrink-0"
                    onClick={() => setBgImageUrl("")}
                    title="Clear"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
              <p className="mt-1 text-[10px] text-muted-foreground">
                Paste any website screenshot URL (or upload one) to preview the character on top and dial in the perfect size.
              </p>
            </div>
            <div>
              <Label className="text-[11px] text-muted-foreground">Fit</Label>
              <div className="mt-1 grid grid-cols-4 gap-1">
                {(["cover", "contain", "fill", "center"] as const).map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={bgImageFit === f ? "default" : "secondary"}
                    className="h-7 px-1 text-[10px] capitalize"
                    onClick={() => setBgImageFit(f)}
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <SliderRow
              label="Image opacity"
              value={bgImageOpacity}
              min={0}
              max={1}
              step={0.01}
              onChange={setBgImageOpacity}
            />
          </div>
        )}
      </Section>

      <Section title="Characters">
        <p className="text-[10px] text-muted-foreground">
          Add more models from the library sidebar (the “+” button) to show several characters in one window.
        </p>
        {extras.length === 0 ? (
          <div className="text-[11px] text-muted-foreground">No extra characters.</div>
        ) : (
          <div className="space-y-2">
            {extras.map((ex) => (
              <div key={ex.instanceId} className="rounded-md border border-panel-border/60 bg-muted/10 p-2">
                <div className="mb-1.5 flex items-center justify-between gap-2">
                  <div className="truncate text-[11px] font-medium">{ex.entry.modelName}</div>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-muted-foreground hover:text-destructive"
                    onClick={() => removeExtra(ex.instanceId)}
                    title="Remove"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <SliderRow
                  label="Scale"
                  value={ex.scale}
                  min={0.02}
                  max={5}
                  step={0.005}
                  onChange={(v) => updateExtra(ex.instanceId, { scale: v })}
                />
                <div className="mt-1 grid grid-cols-2 gap-1">
                  <SliderRow
                    label="X"
                    value={ex.x}
                    min={-1500}
                    max={1500}
                    step={1}
                    onChange={(v) => updateExtra(ex.instanceId, { x: v })}
                  />
                  <SliderRow
                    label="Y"
                    value={ex.y}
                    min={-1500}
                    max={1500}
                    step={1}
                    onChange={(v) => updateExtra(ex.instanceId, { y: v })}
                  />
                </div>
              </div>
            ))}
            <Button size="sm" variant="outline" className="w-full" onClick={clearExtras}>
              Remove all
            </Button>
          </div>
        )}
      </Section>


      <Section title="Debug overlays">
        {(
          [
            ["showSafeArea", "Safe area"],
            ["showBounds", "Model bounds"],
            ["showOrigin", "Origin / pivot"],
            ["showHitAreas", "Hit areas (info)"],
          ] as const
        ).map(([key, label]) => (
          <div key={key} className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">{label}</Label>
            <Switch
              checked={debug[key]}
              onCheckedChange={(v) => setDebug((d) => ({ ...d, [key]: v }))}
            />
          </div>
        ))}
      </Section>
    </div>
  );
}
