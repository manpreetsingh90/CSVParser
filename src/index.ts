import init, { parse_csv, infer_schema } from "../wasm/pkg/csv_wasm_core";
import type { ParseOptions, ParsedResult, SchemaField } from "./types";

let ready: Promise<void> | null = null;

export async function initWasm() {
  if (!ready) ready = init();
  return ready;
}

export async function parse(input: string, opts: ParseOptions = {}): Promise<ParsedResult> {
  await initWasm();
  const { header = true, delimiter = "," } = opts;
  const result = parse_csv(input, header, delimiter.charCodeAt(0));
  return result as ParsedResult;
}

export async function parseFile(file: File): Promise<ParsedResult> {
  const text = await file.text();
  return parse(text);
}

export async function parseArrayBuffer(buffer: ArrayBuffer): Promise<ParsedResult> {
  const text = new TextDecoder().decode(buffer);
  return parse(text);
}

export async function inferSchemaFromSample(sample: string, delimiter = ","): Promise<SchemaField[]> {
  await initWasm();
  const result = infer_schema(sample, delimiter.charCodeAt(0));
  return result as SchemaField[];
}

export { type ParseOptions, type ParsedResult, type SchemaField };