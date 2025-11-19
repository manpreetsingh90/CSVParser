import { parse } from '../dist/index.esm.js';

// Generate test CSV
function generateCSV(rows) {
  let csv = 'name,age,city,value\n';
  for (let i = 0; i < rows; i++) {
    csv += `Person${i},${Math.floor(Math.random() * 100)},City${i % 10},${Math.random() * 1000}\n`;
  }
  return csv;
}

async function benchmark(size) {
  const csv = generateCSV(size);
  console.log(`Benchmarking with ${size} rows (${csv.length} bytes)`);

  const start = performance.now();
  const result = await parse(csv);
  const end = performance.now();

  const time = end - start;
  const mbPerSec = (csv.length / 1024 / 1024) / (time / 1000);

  console.log(`Parsed ${result.rows.length} rows in ${time.toFixed(2)}ms`);
  console.log(`Speed: ${mbPerSec.toFixed(2)} MB/s`);
  console.log('---');

  return { time, mbPerSec, rows: result.rows.length };
}

async function runBenchmarks() {
  console.log('Ultra-Fast CSV Parser Benchmarks\n');

  const sizes = [1000, 10000, 100000];

  for (const size of sizes) {
    await benchmark(size);
  }
}

runBenchmarks().catch(console.error);