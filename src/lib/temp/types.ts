export type VirtualFile = {
  path: string; // normalized relative path inside the model folder
  name: string;
  size: number;
  file: File;
  url: string; // blob URL
};

export type LoadedModelFiles = {
  rootName: string; // model folder name
  settingsPath: string; // relative path to *.model3.json / *.model.json
  files: Map<string, VirtualFile>; // key = normalized relative path
  cubismVersion: 2 | 3 | 4;
  totalBytes: number;
};

export type ExportConfig = {
  model: string;
  scale: number;
  positionX: number;
  positionY: number;
  rotation: number;
  opacity: number;
  motion?: string;
  expression?: string;
  timestamp: string;
};
