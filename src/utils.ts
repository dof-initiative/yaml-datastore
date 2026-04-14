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
  shortToObject,

  /**
   * element path contains no heirarchy and filepath points to a list in a directory to be loaded
   */
  shortToList,

  /**
   * element path contains no heirarchy and filepath points to a complex string in a directory that is an object to be loaded
   */
  shortToComplexString,

  /**
   * element path contains no heirarchy and element is already in memory to be accessed
   */
  shortToSimple,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing an object to be loaded
   */
  hierarchicalToObject,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing a list to be loaded
   */
  hierarchicalToList,

  /**
   * element path contains heirarchy, therefore filepath points to a directory containing an object or list containing a complex string to be loaded
   */
  hierarchicalToComplexString,

  /**
   * element path contains heirarchy and element is already in memory to be accessed
   */
  hierarchicalToSimple,
}

/**
 * Data required to continue loading data from filesystem
 */
export class ElementPathResult {
  private _type: ElementPathType;
  private _data: any;
  private _parentElementPath: string;
  private _parentFilePath: string;
  private _keyName: any;

  /**
   * Default constructor for ElementPathResult
   *
   * @param type elementPath type
   * @param data filepath to be read into memory, or simple element, or null (for invalid path)
   * @param parentElementPath elementPath of parent
   * @param parentFilePath file path to parent element
   * @param keyName property in object or index in list
   */
  constructor(
    type: ElementPathType,
    data: any,
    parentElementPath: string,
    parentFilePath: string,
    keyName: any
  ) {
    this._type = type;
    if (this._type === ElementPathType.invalid) {
      this._data = null;
    } else {
      this._data = data;
    }
    this._parentElementPath = parentElementPath;
    this._parentFilePath = parentFilePath;
    this._keyName = keyName;
  }

  /** @returns elementPath type */
  public get type() {
    return this._type;
  }

  /** @returns filepath to be read into memory, or simple element, or null (for invalid path) */
  public get data() {
    return this._data;
  }

  /** @returns elementPath of parent */
  public get parentElementPath() {
    return this._parentElementPath;
  }

  /** @returns file path to parent element*/
  public get parentFilePath() {
    return this._parentFilePath;
  }

  /** @returns property in object or index in list */
  public get keyName() {
    return this._keyName;
  }

  /** @returns boolean value identifying if parent is an element */
  public get parentIsElement() {
    return (
      this._parentFilePath.slice(-5) === ".yaml" &&
      fs.existsSync(this._parentFilePath)
    );
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
  let parentElementPath = "";
  let parentFilePath = path.join(workingDirectoryPath, "..", "_this.yaml");
  let keyName = "";
  if (elementPath === "") {
    // empty path case

    let filepath = path.join(workingDirectoryPath, "_this.yaml");
    if (fs.existsSync(filepath)) {
      // working directory itself is an object; parent element unknown

      if (!fs.existsSync(parentFilePath)) {
        // object has no parent
        parentFilePath = path.join(workingDirectoryPath, "..");
      }

      return new ElementPathResult(
        ElementPathType.empty,
        filepath,
        "",
        parentFilePath,
        keyName
      );
    }
  } else if (
    !elementPath.includes(".") &&
    !elementPath.includes("[") &&
    !elementPath.includes("]")
  ) {
    // short element path case

    let filePath = path.join(workingDirectoryPath, elementPath, "_this.yaml");
    if (fs.existsSync(filePath)) {
      // element path points to an object

      let parentFilePath = path.join(workingDirectoryPath, "_this.yaml");
      if (!fs.existsSync(parentFilePath)) {
        // object has no parent
        parentFilePath = workingDirectoryPath;
      }
      keyName = elementPath;

      return new ElementPathResult(
        ElementPathType.shortToObject,
        filePath,
        parentElementPath,
        parentFilePath,
        keyName
      );
    }

    filePath = path.join(workingDirectoryPath, elementPath + ".yaml");
    if (fs.existsSync(filePath)) {
      // element path points to a list

      let parentFilePath = path.join(workingDirectoryPath, "_this.yaml");
      if (!fs.existsSync(parentFilePath)) {
        // list has no parent
        parentFilePath = "";
      }
      keyName = elementPath;

      return new ElementPathResult(
        ElementPathType.shortToList,
        filePath,
        parentElementPath,
        parentFilePath,
        keyName
      );
    }

    const parentFilePath = path.join(workingDirectoryPath, "_this.yaml");
    keyName = elementPath;
    if (fs.existsSync(parentFilePath)) {
      // element path points to a complex data type or property

      const thisYamlContent = fs.readFileSync(parentFilePath, "utf-8");
      const yamlAsJsObj = yaml.load(thisYamlContent);
      const rawData = (yamlAsJsObj as any)[elementPath];
      if (typeof rawData === "string") {
        if (doubleParenthesesRegEx.test(rawData)) {
          // element path points to a complex string owned by an object

          filePath = path.join(
            workingDirectoryPath,
            trimDoubleParentheses(rawData)
          );
          if (fs.existsSync(filePath)) {
            return new ElementPathResult(
              ElementPathType.shortToComplexString,
              filePath,
              "",
              parentFilePath,
              elementPath
            );
          }
        }
      }
      // element path points to a property owned by an object
      return new ElementPathResult(
        ElementPathType.shortToSimple,
        rawData,
        "",
        parentFilePath,
        elementPath
      );
    } else {
      // invalid case
      return new ElementPathResult(ElementPathType.invalid, null, "", "", null);
    }
  } else {
    // hierarchical element path case containing "." or "[" or "]"

    const firstElementEntry = getNextElementPath(elementPath);
    parentElementPath = firstElementEntry;
    if (
      firstElementEntry === "" ||
      firstElementEntry.includes(".") ||
      firstElementEntry.includes("[") ||
      firstElementEntry.includes("]")
    ) {
      return new ElementPathResult(ElementPathType.invalid, null, "", "", null);
    }
    const firstElementPathInfo = getElementPathInfo(
      workingDirectoryPath,
      firstElementEntry
    );
    parentFilePath = firstElementPathInfo.data;
    if (firstElementPathInfo.type !== ElementPathType.invalid) {
      const firstElementContent = fs.readFileSync(
        firstElementPathInfo.data,
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
          return new ElementPathResult(
            ElementPathType.invalid,
            null,
            "",
            "",
            null
          );
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

      if (remainingElementEntries.length > 1) {
        for (const elementEntry of remainingElementEntries.slice(0, -1)) {
          parentElementPath = parentElementPath + "[" + elementEntry + "]";
          parentFilePath = getElementPathInfo(
            workingDirectoryPath,
            parentElementPath
          ).data;
        }
      }
      keyName = remainingElementEntries.slice(-1)[0];

      let currentElementAsJsObj = firstElementAsJsObj;
      let filePath = path.dirname(firstElementPathInfo.data);
      for (let i = 0; i < remainingElementEntries.length; i++) {
        const elementPath = remainingElementEntries[i];
        if (!(currentElementAsJsObj as any).hasOwnProperty(elementPath)) {
          return new ElementPathResult(
            ElementPathType.invalid,
            null,
            "",
            "",
            null
          );
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

                const result = new ElementPathResult(
                  ElementPathType.hierarchicalToObject,
                  filePath,
                  parentElementPath,
                  parentFilePath,
                  keyName
                );
                return result;
              } else if (filePath.slice(-5) === ".yaml") {
                // got a YAML list

                const result = new ElementPathResult(
                  ElementPathType.hierarchicalToList,
                  filePath,
                  parentElementPath,
                  parentFilePath,
                  keyName
                );
                return result;
              } else {
                // got a complex string

                return new ElementPathResult(
                  ElementPathType.hierarchicalToComplexString,
                  filePath,
                  parentElementPath,
                  parentFilePath,
                  keyName
                );
              }
            }
            continue;
          }
        }
        // got a simple value

        const result = new ElementPathResult(
          ElementPathType.hierarchicalToSimple,
          rawData,
          parentElementPath,
          parentFilePath,
          keyName
        );
        return result;
      }
    } else {
      return new ElementPathResult(ElementPathType.invalid, null, "", "", null);
    }
  }
  return new ElementPathResult(ElementPathType.invalid, null, "", "", null);
}
