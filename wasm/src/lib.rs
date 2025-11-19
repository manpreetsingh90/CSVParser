use wasm_bindgen::prelude::*;
use serde::{Deserialize, Serialize};
use csv::ReaderBuilder;
use std::collections::HashMap;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet(name: &str) {
    alert(&format!("Hello, {}!", name));
}

#[derive(Serialize, Deserialize)]
pub struct Row {
    pub data: Vec<String>,
}

#[derive(Serialize, Deserialize)]
pub struct ParsedResult {
    pub headers: Option<Vec<String>>,
    pub rows: Vec<Vec<String>>,
}

#[wasm_bindgen]
pub fn parse_csv(input: &str, header: bool, delimiter: char) -> JsValue {
    let mut rdr = ReaderBuilder::new()
        .has_headers(header)
        .delimiter(delimiter as u8)
        .from_reader(input.as_bytes());

    let mut rows = Vec::new();
    let mut headers = None;

    if header {
        if let Ok(h) = rdr.headers() {
            headers = Some(h.iter().map(|s| s.to_string()).collect());
        }
    }

    for result in rdr.records() {
        if let Ok(record) = result {
            rows.push(record.iter().map(|s| s.to_string()).collect());
        }
    }

    let result = ParsedResult { headers, rows };
    JsValue::from_serde(&result).unwrap()
}

#[derive(Serialize, Deserialize)]
pub struct SchemaField {
    pub name: String,
    pub field_type: String,
    pub null_ratio: f64,
}

#[wasm_bindgen]
pub fn infer_schema(sample: &str, delimiter: char) -> JsValue {
    let mut rdr = ReaderBuilder::new()
        .has_headers(true)
        .delimiter(delimiter as u8)
        .from_reader(sample.as_bytes());

    let mut fields = Vec::new();
    let mut total_rows = 0;
    let mut null_counts = HashMap::new();

    if let Ok(headers) = rdr.headers() {
        for header in headers.iter() {
            fields.push(SchemaField {
                name: header.to_string(),
                field_type: "string".to_string(),
                null_ratio: 0.0,
            });
            null_counts.insert(header.to_string(), 0);
        }
    }

    for result in rdr.records() {
        if let Ok(record) = result {
            total_rows += 1;
            for (i, field) in record.iter().enumerate() {
                if i < fields.len() {
                    if field.trim().is_empty() {
                        *null_counts.get_mut(&fields[i].name).unwrap() += 1;
                    } else {
                        // Simple type inference
                        if field.parse::<i64>().is_ok() {
                            fields[i].field_type = "integer".to_string();
                        } else if field.parse::<f64>().is_ok() {
                            fields[i].field_type = "float".to_string();
                        } else if field.to_lowercase() == "true" || field.to_lowercase() == "false" {
                            fields[i].field_type = "boolean".to_string();
                        }
                        // Date detection could be added here
                    }
                }
            }
        }
    }

    for field in &mut fields {
        if total_rows > 0 {
            field.null_ratio = *null_counts.get(&field.name).unwrap() as f64 / total_rows as f64;
        }
    }

    JsValue::from_serde(&fields).unwrap()
}

#[wasm_bindgen]
pub struct StreamingParser {
    reader: csv::Reader<std::io::Cursor<Vec<u8>>>,
    buffer: Vec<u8>,
    headers: Option<Vec<String>>,
}

#[wasm_bindgen]
impl StreamingParser {
    #[wasm_bindgen(constructor)]
    pub fn new(header: bool, delimiter: char) -> StreamingParser {
        let buffer = Vec::new();
        let cursor = std::io::Cursor::new(buffer.clone());
        let mut reader = ReaderBuilder::new()
            .has_headers(header)
            .delimiter(delimiter as u8)
            .from_reader(cursor);

        let headers = if header {
            reader.headers().ok().map(|h| h.iter().map(|s| s.to_string()).collect())
        } else {
            None
        };

        StreamingParser {
            reader,
            buffer,
            headers,
        }
    }

    #[wasm_bindgen]
    pub fn push_chunk(&mut self, chunk: &[u8]) -> JsValue {
        self.buffer.extend_from_slice(chunk);
        // For simplicity, process all at once. In real streaming, we'd process incrementally
        let cursor = std::io::Cursor::new(self.buffer.clone());
        self.reader = ReaderBuilder::new()
            .has_headers(self.headers.is_some())
            .delimiter(b',')
            .from_reader(cursor);

        let mut rows = Vec::new();
        for result in self.reader.records() {
            if let Ok(record) = result {
                rows.push(record.iter().map(|s| s.to_string()).collect());
            }
        }

        JsValue::from_serde(&rows).unwrap()
    }

    #[wasm_bindgen]
    pub fn finish(&mut self) -> JsValue {
        // Return any remaining data
        JsValue::from_serde(&Vec::<Vec<String>>::new()).unwrap()
    }
}
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_csv_with_headers() {
        let input = "name,age\nAlice,30\nBob,25";
        let result = parse_csv(input, true, ',');
        let parsed: ParsedResult = result.into_serde().unwrap();
        assert_eq!(parsed.headers, Some(vec!["name".to_string(), "age".to_string()]));
        assert_eq!(parsed.rows.len(), 2);
        assert_eq!(parsed.rows[0], vec!["Alice", "30"]);
    }

    #[test]
    fn test_parse_csv_no_headers() {
        let input = "Alice,30\nBob,25";
        let result = parse_csv(input, false, ',');
        let parsed: ParsedResult = result.into_serde().unwrap();
        assert!(parsed.headers.is_none());
        assert_eq!(parsed.rows.len(), 2);
    }

    #[test]
    fn test_infer_schema() {
        let sample = "name,age,salary\nAlice,30,50000\nBob,25,45000";
        let result = infer_schema(sample, ',');
        let schema: Vec<SchemaField> = result.into_serde().unwrap();
        assert_eq!(schema.len(), 3);
        assert_eq!(schema[0].name, "name");
        assert_eq!(schema[0].field_type, "string");
        assert_eq!(schema[1].name, "age");
        assert_eq!(schema[1].field_type, "integer");
    }
}