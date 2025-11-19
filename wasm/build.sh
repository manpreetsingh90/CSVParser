#!/bin/bash
wasm-pack build --release --target bundler

# Optimize WASM binary size
if command -v wasm-opt &> /dev/null; then
    echo "Optimizing WASM binary..."
    wasm-opt -Oz pkg/csv_wasm_core_bg.wasm -o pkg/csv_wasm_core_bg.wasm
else
    echo "wasm-opt not found, skipping optimization"
fi