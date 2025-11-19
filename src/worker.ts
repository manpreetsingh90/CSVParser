import type { WorkerCallbacks, StreamOptions } from "./types";

export class CSVWorker {
  private worker: Worker;
  private callbacks: WorkerCallbacks;

  constructor(callbacks: WorkerCallbacks = {}) {
    this.callbacks = callbacks;
    this.worker = new Worker(new URL('./csv-worker.js', import.meta.url), { type: 'module' });

    this.worker.onmessage = (e) => {
      const { type, data, error } = e.data;
      switch (type) {
        case 'chunk':
          this.callbacks.onChunk?.(data);
          break;
        case 'done':
          this.callbacks.onDone?.();
          break;
        case 'error':
          this.callbacks.onError?.(new Error(error));
          break;
      }
    };

    this.worker.onerror = (e) => {
      this.callbacks.onError?.(new Error(e.message));
    };
  }

  parse(readable: ReadableStream<Uint8Array>, opts: StreamOptions = {}) {
    this.worker.postMessage({ type: 'parse', readable, opts });
  }

  terminate() {
    this.worker.terminate();
  }
}

// Worker script content (would be in a separate file in production)
const workerScript = `
importScripts('./csv-wasm-core.js');

self.onmessage = async function(e) {
  const { type, readable, opts } = e.data;

  if (type === 'parse') {
    try {
      await initWasm();
      const parser = new StreamingParser(opts.header, opts.delimiter.charCodeAt(0));
      const reader = readable.getReader();

      while (true) {
        const { value, done } = await reader.read();
        if (done) {
          const final = parser.finish();
          if (final?.length) self.postMessage({ type: 'chunk', data: final });
          self.postMessage({ type: 'done' });
          break;
        }
        const chunkRows = parser.push_chunk(value);
        if (chunkRows?.length) self.postMessage({ type: 'chunk', data: chunkRows });
      }
    } catch (error) {
      self.postMessage({ type: 'error', error: error.message });
    }
  }
};
`;

export { workerScript };