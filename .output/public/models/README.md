# Live2D Models

Drop each Live2D model folder directly here. The build system scans this
directory automatically and generates `manifest.json` on every dev-server
start and production build — no code changes required to add or remove
models.

Expected layout:

```
public/models/
  hiyori/
    runtime/
      hiyori.model3.json
      hiyori.moc3
      hiyori.physics3.json
      hiyori.pose3.json
      expressions/
      motions/
      textures/
  another-model/
    another.model3.json
    ...
```

The scanner walks each top-level folder recursively and picks up the first
`*.model3.json` (Cubism 3/4) or `*.model.json` (Cubism 2) it finds, so the
inner layout is flexible.

Optional per-model files that get picked up automatically:

- `thumbnail.png` / `preview.jpg` / `icon.webp` / `cover.png` — shown as
  the card thumbnail in the sidebar. When absent, the first texture is
  used as a fallback.

If this directory is empty, the app shows an empty-state screen instead
of crashing.
