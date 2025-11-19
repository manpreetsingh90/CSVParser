export interface ParseOptions {
  header?: boolean;
  delimiter?: string;
}

export interface StreamOptions extends ParseOptions {
  chunkSize?: number;
}

export interface SchemaField {
  name: string;
  type: string;
  nullRatio: number;
}

export interface ParsedResult {
  headers?: string[];
  rows: string[][];
}

export interface WorkerCallbacks {
  onChunk?: (rows: string[][]) => void;
  onDone?: () => void;
  onError?: (error: Error) => void;
}