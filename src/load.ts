import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { YdsResult } from "./index.js";

export const EMPTY_WORKINGDIR_PATH_ERROR =
  "Error: Cannot load from empty working directory path";
export const INVALID_PATH_ERROR =
  "Error: Invalid path to element on filesystem";

// Regular expression used for matching element file paths enclosed between double parentheses
const doubleParenthesesRegEx = new RegExp(/\(\(.*\)\)/);

/**
 * Describes the nature of an element path + filepath combination.
 */
export enum ElementPathType {
  /**
   * the combined element Path and filepath do not point at a valid element, returned element will be null
   */
  invalid,

  /**
   * element path is empty, therefore filepath points to an object to be loaded
   */
  empty,

  /**
   * element path contains no heirarchy and filepath points to a directory containing an object to be loaded
   */
  simpleToObject,

  /**
   * element path contains no heirarchy and filepath points to a directory containing a list to be loaded
   */
  simpleToList,

  /**
   * element path contains no heirarchy and filepath points to an object containing a complex string to be loaded
   */
  simpleToComplexString,

  /**
   * element path contains no heirarchy and element is already in memory to be accessed
   */
  simpleToSimple,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing an object to be loaded
   */
  complexToObject,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing a list to be loaded
   */
  complexToList,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing a complex string to be loaded
   */
  complexToComplexString,

  /**
   * element path contains heirarchy and element is already in memory to be accessed
   */
  complexToSimple,
}

/**
 * Data required to continue loading data from filesystem
 */
export class ElementPathResult {
  private _type: ElementPathType;
  private _data: any;

  /**
   * Default constructor for ElementPathResult
   *
   * @param type elementPath type
   * @param data filepath to be read into memory, or simple element, or null (for invalid path)
   */
  constructor(type: ElementPathType, data: any) {
    this._type = type;
    if (this._type === ElementPathType.invalid) {
      this._data = null;
    } else {
      this._data = data;
    }
  }

  /** @returns elementPath type */
  public get type() {
    return this._type;
  }

  /** @returns filepath to be read into memory, or simple element, or null (for invalid path) */
  public get data() {
    return this._data;
  }
}

// local function used for parsing strings enclosed between double parentheses
function trimDoubleParentheses(aString: string): string {
  return aString.slice(2, -2);
}

// local function used for converting YAML filePath to elementPath
function convertYamlFilePathToElementPath(filePath: string): string {
  if (filePath.slice(-10) === "_this.yaml") {
    // handle case where filePath is a YAML object
    const elementPath = filePath.split("/").slice(0, -1).join(".");
    return elementPath;
  } else {
    // handle case where filePath is a YAML list
    const elementPath = filePath.slice(0, -5).replace("/", ".");
    return elementPath;
  }
}

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

function getNextElementPath(elementPath: string): string {
  let elementPathToCheck = elementPath;
  let firstDotIndex = elementPathToCheck.indexOf(".");
  let firstBracketIndex = elementPathToCheck.indexOf("[");
  let firstElementEntry = "";

  if (firstDotIndex === 0) {
    // ignore dot
    elementPathToCheck = elementPath.slice(1);
    firstDotIndex = elementPathToCheck.indexOf(".");
    firstBracketIndex = elementPathToCheck.indexOf("[");
  } else if (firstBracketIndex === 0) {
    // parse string in brackets
    elementPathToCheck = elementPath.slice(1);
    let firstClosedBracketIndex = elementPathToCheck.indexOf("]");
    if (firstClosedBracketIndex !== -1) {
      firstElementEntry = elementPathToCheck.substring(
        0,
        firstClosedBracketIndex
      );
    }
    return firstElementEntry;
  }

  if (firstDotIndex === -1 && firstBracketIndex !== -1) {
    // brackets only case
    firstElementEntry = elementPathToCheck.substring(0, firstBracketIndex);
  } else if (firstBracketIndex === -1 && firstDotIndex !== -1) {
    // dots only case
    firstElementEntry = elementPathToCheck.substring(0, firstDotIndex);
  } else if (firstBracketIndex !== -1 && firstDotIndex !== -1) {
    // brackets and dots case
    firstElementEntry = elementPathToCheck.substring(
      0,
      Math.min(firstBracketIndex, firstDotIndex)
    );
  } else {
    // no brackets or dots
    firstElementEntry = elementPathToCheck;
  }
  return firstElementEntry;
}

export function getElementPathInfo(
  workingDirectoryPath: string,
  elementPath: string
): ElementPathResult {
  if (elementPath === "") {
    // case empty
    let filepath = path.join(workingDirectoryPath, "_this.yaml");
    if (fs.existsSync(filepath)) {
      return new ElementPathResult(ElementPathType.empty, filepath);
    }
  } else if (
    !elementPath.includes(".") &&
    !elementPath.includes("[") &&
    !elementPath.includes("]")
  ) {
    // simple path case
    let filePath = path.join(workingDirectoryPath, elementPath, "_this.yaml");
    if (fs.existsSync(filePath)) {
      // object path case
      return new ElementPathResult(ElementPathType.simpleToObject, filePath);
    }

    //
    filePath = path.join(workingDirectoryPath, elementPath + ".yaml");
    if (fs.existsSync(filePath)) {
      // list path case
      return new ElementPathResult(ElementPathType.simpleToList, filePath);
    }

    filePath = path.join(workingDirectoryPath, "_this.yaml");
    if (fs.existsSync(filePath)) {
      // complex type path or property case
      const thisYamlContent = fs.readFileSync(filePath, "utf-8");
      const yamlAsJsObj = yaml.load(thisYamlContent);
      const rawData = (yamlAsJsObj as any)[elementPath];
      if (typeof rawData === "string") {
        if (doubleParenthesesRegEx.test(rawData)) {
          // complex string path case
          filePath = path.join(
            workingDirectoryPath,
            trimDoubleParentheses(rawData)
          );
          if (fs.existsSync(filePath)) {
            return new ElementPathResult(
              ElementPathType.simpleToComplexString,
              filePath
            );
          }
        }
      }
      return new ElementPathResult(ElementPathType.simpleToSimple, rawData);
    } else {
      // invalid case
      return new ElementPathResult(ElementPathType.invalid, null);
    }
  } else {
    // complex path case containing "." or "[" or "]"
    const firstElementEntry = getNextElementPath(elementPath);
    if (
      firstElementEntry === "" ||
      firstElementEntry.includes(".") ||
      firstElementEntry.includes("[") ||
      firstElementEntry.includes("]")
    ) {
      return new ElementPathResult(ElementPathType.invalid, null);
    }
    const firstElementFilePath = getElementPathInfo(
      workingDirectoryPath,
      firstElementEntry
    );
    if (firstElementFilePath.type !== ElementPathType.invalid) {
      const firstElementContent = fs.readFileSync(
        firstElementFilePath.data,
        "utf-8"
      );
      const firstElementAsJsObj = yaml.load(firstElementContent);
      let remainingElementPath = elementPath.replace(firstElementEntry, "");
      let remainingElementEntries: string[] = [];
      do {
        const nextElementPath = getNextElementPath(remainingElementPath);
        if (
          nextElementPath === "" ||
          nextElementPath.includes(".") ||
          nextElementPath.includes("[") ||
          nextElementPath.includes("]")
        ) {
          return new ElementPathResult(ElementPathType.invalid, null);
        }
        remainingElementEntries.push(nextElementPath);
        if (remainingElementPath[0] === ".") {
          remainingElementPath = remainingElementPath.replace(
            "." + nextElementPath,
            ""
          );
        } else if (remainingElementPath[0] === "[") {
          remainingElementPath = remainingElementPath.replace(
            "[" + nextElementPath + "]",
            ""
          );
        }
      } while (remainingElementPath !== "");

      let currentElementAsJsObj = firstElementAsJsObj;
      let filePath = path.dirname(firstElementFilePath.data);
      for (let i = 0; i < remainingElementEntries.length; i++) {
        const elementPath = remainingElementEntries[i];
        if (!(currentElementAsJsObj as any).hasOwnProperty(elementPath)) {
          return new ElementPathResult(ElementPathType.invalid, null);
        }
        const rawData = (currentElementAsJsObj as any)[elementPath];
        if (typeof rawData === "string") {
          if (doubleParenthesesRegEx.test(rawData)) {
            // got a file path
            if (filePath.slice(-5) === ".yaml") {
              filePath = path.join(
                filePath.split("/").slice(0, -1).join("/"),
                trimDoubleParentheses(rawData)
              );
            } else {
              filePath = path.join(filePath, trimDoubleParentheses(rawData));
            }
            const currentElementContent = fs.readFileSync(filePath, "utf-8");
            currentElementAsJsObj = yaml.load(currentElementContent);
            if (i === remainingElementEntries.length - 1) {
              if (filePath.slice(-10) === "_this.yaml") {
                // got a YAML object
                return new ElementPathResult(
                  ElementPathType.complexToObject,
                  filePath
                );
              } else if (filePath.slice(-5) === ".yaml") {
                // got a YAML list
                return new ElementPathResult(
                  ElementPathType.complexToList,
                  filePath
                );
              } else {
                // got a complex string
                return new ElementPathResult(
                  ElementPathType.complexToComplexString,
                  filePath
                );
              }
            }
            continue;
          }
        }
        // got a simple value
        return new ElementPathResult(ElementPathType.complexToSimple, rawData);
      }
    } else {
      return new ElementPathResult(ElementPathType.invalid, null);
    }
  }
  return new ElementPathResult(ElementPathType.invalid, null);
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
      case ElementPathType.simpleToObject:
      case ElementPathType.simpleToList:
      case ElementPathType.complexToObject:
      case ElementPathType.complexToList:
        return loadYaml(elementPathInfo.data, elementPath, depth);
      case ElementPathType.simpleToSimple:
      case ElementPathType.complexToSimple:
        return new YdsResult(true, elementPathInfo.data, elementPath);
      case ElementPathType.simpleToComplexString:
      case ElementPathType.complexToComplexString:
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
