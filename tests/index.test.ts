import { describe, it, expect } from 'vitest';
import { parse, parseFile, inferSchemaFromSample } from '../src/index';

describe('CSV Parser', () => {
  it('should parse CSV with headers', async () => {
    const csv = 'name,age\nAlice,30\nBob,25';
    const result = await parse(csv);
    expect(result.headers).toEqual(['name', 'age']);
    expect(result.rows).toHaveLength(2);
    expect(result.rows[0]).toEqual(['Alice', '30']);
  });

  it('should parse CSV without headers', async () => {
    const csv = 'Alice,30\nBob,25';
    const result = await parse(csv, { header: false });
    expect(result.headers).toBeUndefined();
    expect(result.rows).toHaveLength(2);
  });

  it('should handle custom delimiter', async () => {
    const csv = 'name;age\nAlice;30';
    const result = await parse(csv, { delimiter: ';' });
    expect(result.headers).toEqual(['name', 'age']);
    expect(result.rows[0]).toEqual(['Alice', '30']);
  });

  it('should infer schema', async () => {
    const sample = 'name,age,salary\nAlice,30,50000\nBob,25,45000';
    const schema = await inferSchemaFromSample(sample);
    expect(schema).toHaveLength(3);
    expect(schema[0]).toMatchObject({ name: 'name', type: 'string' });
    expect(schema[1]).toMatchObject({ name: 'age', type: 'integer' });
    expect(schema[2]).toMatchObject({ name: 'salary', type: 'integer' });
  });
});

// Mock File for testing
function createMockFile(content: string): File {
  return new File([content], 'test.csv', { type: 'text/csv' });
}

describe('File Parsing', () => {
  it('should parse File object', async () => {
    const csv = 'name,age\nAlice,30';
    const file = createMockFile(csv);
    const result = await parseFile(file);
    expect(result.headers).toEqual(['name', 'age']);
    expect(result.rows[0]).toEqual(['Alice', '30']);
  });
});