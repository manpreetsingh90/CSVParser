import typescript from '@rollup/plugin-typescript';
import wasm from '@rollup/plugin-wasm';
import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
  input: "src/index.ts",
  output: [
    { file: "dist/index.esm.js", format: "esm" },
    { file: "dist/index.cjs.js", format: "cjs" }
  ],
  plugins: [
    nodeResolve(),
    wasm(),
    typescript(),
  ]
};