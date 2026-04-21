import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { YdsResult } from "./index.js";
import {
  doubleParenthesesRegEx,
  trimDoubleParentheses,
  getElementPathInfo,
  ElementPathType,
  convertYamlFilePathToElementPath,
} from "./utils.js";

export const EMPTY_WORKINGDIR_PATH_ERROR =
  "Error: Cannot load from empty working directory path";
export const INVALID_PATH_ERROR =
  "Error: Invalid path to element on filesystem";

// local function used for loading YAML file
function loadYaml(
  filePath: string,
  elementPath: string,
  depth: number
): YdsResult {
  const thisYamlContent = fs.readFileSync(filePath, "utf8");
  let yamlAsJsObj = yaml.load(thisYamlContent);
  // iterate through elements of yamlAsJsObj and replace ((filepath)) with its loaded complex data type
  const keys = Object.keys(yamlAsJsObj as any);
  if (depth !== 0) {
    if (depth > 0) {
      depth = depth - 1;
    }
    keys.forEach((key) => {
      if (typeof (yamlAsJsObj as any)[key] == "string") {
        if (doubleParenthesesRegEx.test((yamlAsJsObj as any)[key])) {
          // parse filepath from ((filepath))
          const dirPath = filePath.split("/").slice(0, -1).join("/");
          const aComplexDataTypeFilePath = trimDoubleParentheses(
            (yamlAsJsObj as any)[key]
          );
          if (aComplexDataTypeFilePath.slice(-5) === ".yaml") {
            // recursively load if file path is a YAML object or list
            const newElementPath = convertYamlFilePathToElementPath(
              aComplexDataTypeFilePath
            );
            (yamlAsJsObj as any)[key] = load(
              dirPath,
              newElementPath,
              depth
            ).element;
          } else {
            // read contents if file path is not a YAML object or list
            const newFilePathToLoad = path.join(
              dirPath,
              aComplexDataTypeFilePath
            );
            const aComplexDataTypeContent = fs.readFileSync(
              newFilePathToLoad,
              "utf-8"
            );
            (yamlAsJsObj as any)[key] = aComplexDataTypeContent;
          }
        }
      }
    });
  }
  return new YdsResult(true, yamlAsJsObj, elementPath);
}

/**
 * Returns a in-memory representation of the element in working directory specified by element path
 *
 * @param workingDirectoryPath relative or absolute path to working directory containing yaml-datastore serialized content
 * @param elementPath object path (dot separated, with support for bracketed indexing for list elements or key-value pairs in objects) from working directory to element to be read into memory (e.g., top-element.sub-element.property[3])
 * @param depth integer from -1 to depth of element indicating how deep into element's hierachy to read into memory (-1 = read full depth. Defaults to -1), will not throw error if depth exceeds actual maximum depth of element
 * @returns a YdsResult containing the status and content of the load function
 */
export function load(
  workingDirectoryPath: string,
  elementPath: string,
  depth: number = -1
): YdsResult {
  if (workingDirectoryPath === "") {
    return new YdsResult(false, null, EMPTY_WORKINGDIR_PATH_ERROR);
  } else {
    let elementPathInfo = getElementPathInfo(workingDirectoryPath, elementPath);
    switch (elementPathInfo.type) {
      case ElementPathType.empty:
      case ElementPathType.shortToObject:
      case ElementPathType.shortToList:
      case ElementPathType.hierarchicalToObject:
      case ElementPathType.hierarchicalToList:
        return loadYaml(elementPathInfo.data, elementPath, depth);
      case ElementPathType.shortToSimple:
      case ElementPathType.hierarchicalToSimple:
        return new YdsResult(true, elementPathInfo.data, elementPath);
      case ElementPathType.shortToComplexString:
      case ElementPathType.hierarchicalToComplexString:
        const elementContent = fs.readFileSync(elementPathInfo.data, "utf-8");
        return new YdsResult(true, elementContent, elementPath);
      case ElementPathType.invalid:
        break;
    }
    return new YdsResult(
      false,
      null,
      INVALID_PATH_ERROR +
        " [" +
        workingDirectoryPath +
        " | " +
        elementPath +
        "]"
    );
  }
}
