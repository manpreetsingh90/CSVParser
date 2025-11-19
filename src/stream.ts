import init from "../wasm/pkg/csv_wasm_core";
import { StreamingParser } from "../wasm/pkg/csv_wasm_core";
import type { StreamOptions } from "./types";

let ready: Promise<void> | null = null;

async function initWasm() {
  if (!ready) ready = init();
  return ready;
}

export async function* stream(readable: ReadableStream<Uint8Array>, opts: StreamOptions = {}) {
  await initWasm();
  const { header = true, delimiter = "," } = opts;
  const parser = new StreamingParser(header, delimiter.charCodeAt(0));

  const reader = readable.getReader();

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        const final = parser.finish();
        if (final && final.length > 0) yield final;
        break;
      }
      const chunkRows = parser.push_chunk(value);
      if (chunkRows && chunkRows.length > 0) yield chunkRows;
    }
  } finally {
    reader.releaseLock();
  }
}

export async function streamFile(file: File, opts?: StreamOptions) {
  const stream = file.stream();
  return stream(stream, opts);
}