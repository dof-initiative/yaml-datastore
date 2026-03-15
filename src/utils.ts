import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";

// Regular expression used for matching element file paths enclosed between double parentheses
export const doubleParenthesesRegEx = new RegExp(/\(\(.*\)\)/);

/**
 * Maps complex string key name to file name using the following rules:
 *
 * 1. Assumes keyName is consistent with the requirements for a typescript/javascript identifier
 * 2. Ignores leading and trailing underscores (e.g., '_myKeyName__' has one leading and two trailing underscores)
 * 3. A single underscore is defined by being surrounded by non-underscores (e.g., 'my_key__name' has one single underscore and it is between 'my' and 'key')
 * 4. All remaining single underscores are replaced by dots (e.g., 'myKey_md_njk' becomes 'myKey.md.njk')
 *
 * @param keyName String of key name to be mapped to file name
 * @returns String of file name mapped from key name
 */
export function complexStringKeyToFileName(keyName: string): string {
  const regex = new RegExp("(?<!_|^)_(?!_|$)", "g");
  return keyName.replaceAll(regex, ".");
}

/**
 * Maps file name to key name using the following rules:
 *
 * 1. Assumes fileName is consistent with the requirements for a typescript/javascript identifier with the exception of dots, '.'
 * 2. All dots are replaced with single underscores (e.g., 'myKey.md.njk' becomes 'myKey_md_njk')
 *
 * @param fileName
 * @returns
 */
export function fileNameToComplexStringKey(fileName: string): string {
  return fileName.replaceAll(".", "_");
}

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
   * element path contains no heirarchy and filepath points to a list in a directory to be loaded
   */
  simpleToList,

  /**
   * element path contains no heirarchy and filepath points to a complex string in a directory that is an object to be loaded
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
export function trimDoubleParentheses(aString: string): string {
  return aString.slice(2, -2);
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

class ParentElementInfo {
  private _parentElementPath: string;
  private _parentElementFilePath: string;
  private _indexOfChild: any;
  private _childElementPath: string;

  /**
   * Default constructor for ParentElementInfo
   *
   * @param parentElementPath elementPath of parent
   * @param parentElementFilePath file path to parent element
   * @param indexOfChild property in object or index in list
   * @param childElementPath elementPath to child
   */
  constructor(
    parentElementPath: string,
    parentElementFilePath: string,
    indexOfChild: any,
    childElementPath: string
  ) {
    this._parentElementPath = parentElementPath;
    this._parentElementFilePath = parentElementFilePath;
    this._indexOfChild = indexOfChild;
    this._childElementPath = childElementPath;
  }

  /** @returns elementPath of parent */
  public get parentElementPath() {
    return this._parentElementPath;
  }

  /** @returns file path to parent element*/
  public get parentElementFilePath() {
    return this._parentElementFilePath;
  }

  /** @returns property in object or index in list */
  public get indexOfChild() {
    return this._indexOfChild;
  }

  /** @returns elementPath of child */
  public get childElementPath() {
    return this._childElementPath;
  }
}

/**
 * Helper function used to get information (s.a., element path, file path, and index) about an element and its relation to its parent element for use in delete and clear operations
 *
 * @param workingDirectoryPath relative or absolute path to working directory containing yaml-datastore serialized content
 * @param elementPath element path to element whose parent element info is to be extracted
 * @returns ParentElementInfo object
 */
export function getParentElementInfo(
  workingDirectoryPath: string,
  elementPath: string
): ParentElementInfo {
  let parentElementPath = elementPath;
  let indexOfChild = null;
  if (elementPath.slice(-1) === "]") {
    parentElementPath = elementPath.slice(0, elementPath.lastIndexOf("["));
    indexOfChild = elementPath.slice(elementPath.lastIndexOf("[") + 1, -1);
  } else if (elementPath.includes(".")) {
    parentElementPath = elementPath.slice(0, elementPath.lastIndexOf("."));
    indexOfChild = elementPath.slice(elementPath.lastIndexOf(".") + 1);
  }
  const parentElementPathInfo = getElementPathInfo(
    workingDirectoryPath,
    parentElementPath
  );
  const parentElementFilePath = parentElementPathInfo.data;
  return new ParentElementInfo(
    parentElementPath,
    parentElementFilePath,
    indexOfChild,
    elementPath
  );
}
