import Papa from 'papaparse';
import yaml from 'js-yaml';

// JSON to CSV
export function jsonToCsv(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const array = Array.isArray(data) ? data : [data];
    const csv = Papa.unparse(array);
    return { success: true, result: csv };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// CSV to JSON
export function csvToJson(csvString) {
  try {
    const result = Papa.parse(csvString, { header: true });
    const json = JSON.stringify(result.data, null, 2);
    return { success: true, result: json };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// JSON to YAML
export function jsonToYaml(jsonString) {
  try {
    const data = JSON.parse(jsonString);
    const yamlStr = yaml.dump(data);
    return { success: true, result: yamlStr };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// YAML to JSON
export function yamlToJson(yamlString) {
  try {
    const data = yaml.load(yamlString);
    const json = JSON.stringify(data, null, 2);
    return { success: true, result: json };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
