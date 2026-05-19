#!/usr/bin/env node
import { argv } from "node:process";
import { parseArgs } from "node:util";
import { load } from "../dist/index.js";
import yaml from "js-yaml";

const INVALID_FORMAT_ERROR = "Error: Invalid format";

const args = argv.slice(2);
const numArgs = args.length;

// Print help text for no args or --help flag
if (numArgs == 0 || args.includes("--help")) {
  console.log("Usage: yds-load <path> [OPTIONS]");
  console.log("");
  console.log(
    "  Print in-memory representation of an element from path to working directory containing yaml-datastore serialized content"
  );
  console.log("");
  console.log("Options:");
  console.log(
    "  --element-path, -e <element-path>  object path (dot separated, with support for bracketed indexing for list elements or key-value pairs in objects) from working directory to element to be read into memory (e.g., top-element.sub-element.property[3])"
  );
  console.log(
    "  --depth, -d <n>                    integer from -1 to depth of element indicating how deep into element's hierachy to read into memory (-1 = read full depth. Defaults to -1), will not throw error if depth exceeds actual maximum depth of element"
  );
  console.log(
    "  --format, -f [yaml|json]           output format  [default: yaml)"
  );
  console.log("");
  console.log("Examples:");
  console.log("  $ yds-load ./myproject/model");
  console.log("  $ yds-load ./myproject/model -d 0");
  console.log("  $ yds-load ./myproject/model -f json");
  console.log("  $ yds-load ./myproject -e model");
  console.log("  $ yds-load ./myproject -e model.foo");
  console.log("  $ yds-load ./myproject -e model.foo[1]");
  console.log("  $ yds-load ./myproject -e model[1]");
  console.log("  $ yds-load ./myproject -e model[1].foo");
  console.log("  $ yds-load ./myproject -e model[1][5]");
  console.log("");
  process.exit(0);
}

const options = {
  elementPath: { type: "string", short: "e" },
  depth: { type: "string", short: "d" },
  format: { type: "string", short: "f" },
};

const parser = parseArgs({ options, allowPositionals: true, args: args });

const workingDirPath = parser.positionals[0];

let elementPath = "";
if (parser.values.elementPath) {
  elementPath = parser.values.elementPath;
}

let depth = -1;
if (parser.values.depth) {
  depth = parseInt(parser.values.depth);
}

let format = "yaml";
if (parser.values.format) {
  format = parser.values.format;
}

const loadResult = load(workingDirPath, elementPath, depth);

let element = "";
if (loadResult.success) {
  element = loadResult.element;
} else {
  console.error(loadResult.message);
  process.exit(1);
}

if (format === "yaml") {
  const elementAsYaml = yaml.dump(element).trimEnd();
  console.log(elementAsYaml);
} else if (format === "json") {
  const elementAsJson = JSON.stringify(element, null, 2);
  console.log(elementAsJson);
} else {
  console.error(INVALID_FORMAT_ERROR);
  process.exit(2);
}
