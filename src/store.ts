import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { generateIDs } from "./index.js";
import { complexStringKeyToFileName } from "../src/utils.js";

export const INVALID_ELEMENT_NAME = "Error: Invalid element name";
export const INVALID_PATH_ERROR = "Error: Invalid path";
export const NONEMPTY_WORKINGDIR_PATH_ERROR =
  "Error: Working directory path is non-empty";
export const reserved_keywords = [
  "abstract",
  "arguments",
  "async",
  "await",
  "boolean",
  "break",
  "byte",
  "case",
  "catch",
  "char",
  "class",
  "const",
  "continue",
  "debugger",
  "default",
  "delete",
  "do",
  "double",
  "else",
  "enum",
  "eval",
  "export",
  "extends",
  "false",
  "final",
  "finally",
  "float",
  "for",
  "function",
  "goto",
  "if",
  "implements",
  "function",
  "import",
  "in",
  "instanceof",
  "int",
  "interface",
  "let",
  "long",
  "native",
  "new",
  "null",
  "package",
  "private",
  "protected",
  "public",
  "return",
  "short",
  "static",
  "super",
  "switch",
  "synchronized",
  "this",
  "throw",
  "throws",
  "transient",
  "true",
  "try",
  "typeof",
  "using",
  "var",
  "void",
  "volatile",
  "while",
  "with",
  "yield",
];

// Regular expression used for matching 6-character uppercase alphanumeric string
const idRegex = new RegExp(/^[A-Z0-9]{6}$/);

/**
 * Describes the nature of a container
 */
enum ContainerType {
  /**
   * Container is a List
   */
  IsList,
  /**
   * Container is an Object
   */
  IsObject,
}

/**
 * Represents results of a call to the store function
 */
export class StoreResult {
  private _success: boolean;
  private _message: string;

  /**
   * Default constructor for StoreResult
   *
   * @param success success status of store() operation
   * @param message message describing success status of store() operation
   * @returns new StoreResult object
   */
  constructor(success: boolean, message: string) {
    this._success = success;
    this._message = message;
  }
  /** @returns success status. */
  public get success() {
    return this._success;
  }
  /** @returns file path to root element serialized to disk on success or an explanation of the failure. */
  public get message() {
    return this._message;
  }
}

// validate element name to be conformant to rules for javascript variable name
function validateElementName(elementName: string): boolean {
  const javascriptVariableNameRegEx = new RegExp(/^[A-Za-z_$][A-Za-z0-9_$]*$/);
  return (
    javascriptVariableNameRegEx.test(elementName) &&
    !reserved_keywords.includes(elementName)
  );
}

// format file path string to be enclosed in double parentheses
function encloseInDoubleParentheses(filePath: string): string {
  return "((" + filePath + "))";
}

// local function used for generating a filename for a complex string
function generateComplexStringFilename(
  elementName: string,
  id: string = ""
): string {
  const containerIsList = id !== "";
  let complexStringFilename = "";

  if (containerIsList) {
    if (elementName.includes("_")) {
      const splitElementName = elementName.split("_");
      if (idRegex.test(splitElementName.slice(-1).toString())) {
        complexStringFilename = elementName + "_" + id;
      } else {
        complexStringFilename =
          splitElementName.slice(0, -1).join("_") +
          "_" +
          id +
          "." +
          splitElementName.slice(-1);
      }
    } else {
      complexStringFilename = elementName + "_" + id;
    }
  } else {
    complexStringFilename = complexStringKeyToFileName(elementName);
  }
  return complexStringFilename;
}

// local function used for generating filename for a list or object
function generateObjectOrListFilename(
  elementName: string,
  elementIsArray: boolean,
  id: string = ""
): string {
  const stringTOAppendToListElement = id === "" ? "" : "_" + id;
  if (elementIsArray) {
    return elementName + stringTOAppendToListElement + ".yaml";
  } else {
    return elementName + stringTOAppendToListElement + "/_this.yaml";
  }
}

// local function used for converting element filename to element name
function elementNameFromFileName(elementFileName: string): string {
  if (elementFileName.includes("_this.yaml")) {
    return elementFileName.slice(0, -10);
  } else {
    return elementFileName.slice(0, -5);
  }
}

// serialize element as YAML object or list
function storeYaml(
  element: { [index: string]: any }, // should expect jsObject as element type. Iteration approach requires this typing
  workingDirectoryPath: string,
  elementName: string
): StoreResult {
  // convert element to on-disk YAML representation
  let jsObjToSerialize: { [index: string]: any } = {};
  let dirPath = "";
  let filename = "";
  const keys = Object.keys(element);

  let container;
  if (Array.isArray(element as { [index: string]: any })) {
    container = ContainerType.IsList;
  } else {
    container = ContainerType.IsObject;
  }

  if (container === ContainerType.IsList) {
    dirPath = workingDirectoryPath;
    filename = elementName + ".yaml";
  } else {
    dirPath = path.join(workingDirectoryPath, elementName);
    fs.mkdirSync(dirPath);
    filename = "_this.yaml";
  }
  // iterate through items of list or object and replace complex data types with appropriate string-formatted file path
  let ids = generateIDs(keys.length, 0).reverse();
  keys.forEach((key) => {
    const value = element[key];
    if (typeof value === "string") {
      const stringValue: string = value;
      if (stringValue.includes("\n")) {
        // element to store is a complex string:
        let complexStringFilename = "";
        // generate complex string file name
        if (container === ContainerType.IsList) {
          complexStringFilename = generateComplexStringFilename(
            elementName,
            ids.pop()
          );
        } else {
          complexStringFilename = generateComplexStringFilename(key);
        }
        // handle file path
        const complexStringFilePath = path.join(dirPath, complexStringFilename);
        // enclose in double parentheses and save as value to be serialized
        jsObjToSerialize[key] = encloseInDoubleParentheses(
          complexStringFilename
        );

        // write complex string at file path to disk
        fs.writeFileSync(complexStringFilePath, value);
      } else {
        // element to store is a simple string: save value to be serialized as element in container
        jsObjToSerialize[key] = value;
      }
    } else if (
      value === null ||
      typeof value !== "object" ||
      Object.keys(value).length === 0
    ) {
      // element to store is a simple data type
      jsObjToSerialize[key] = value;
    } else {
      // element to store is an object or list
      let elementFileName = "";
      // generate object or list file name
      if (container === ContainerType.IsList) {
        elementFileName = generateObjectOrListFilename(
          elementName,
          Array.isArray(value),
          ids.pop()
        );
      } else {
        elementFileName = generateObjectOrListFilename(
          key,
          Array.isArray(value)
        );
      }
      // save value to be serialized as string-formatted generated object or list filename
      jsObjToSerialize[key] = encloseInDoubleParentheses(elementFileName);

      // recursively call storeYaml() to serialize list or object
      storeYaml(value, dirPath, elementNameFromFileName(elementFileName));
    }
  });

  if (container === ContainerType.IsList) {
    // if container is a list, strip keys
    jsObjToSerialize = Object.values(jsObjToSerialize);
  }
  const filePath = path.join(dirPath, filename);
  const yamlContentToSerialize = yaml.dump(jsObjToSerialize);

  // write YAML content do disk
  fs.writeFileSync(filePath, yamlContentToSerialize, "utf-8");

  return new StoreResult(true, filePath.toString());
}

/**
 * Dumps in-memory representation of contents to on-disk representation
 *
 * @param element object or list to store on-disk
 * @param workingDirectoryPath relative or absolute path to an empty working directory to store element in
 * @param elementName name of element to store
 * @returns a StoreResult containing the status of the call to store function
 */
export function store(
  element: object,
  workingDirectoryPath: string,
  elementName: string
): StoreResult {
  if (fs.existsSync(workingDirectoryPath)) {
    if (fs.readdirSync(workingDirectoryPath).length > 0) {
      return new StoreResult(
        false,
        NONEMPTY_WORKINGDIR_PATH_ERROR + " [" + workingDirectoryPath + "]"
      );
    } else {
      if (validateElementName(elementName)) {
        return storeYaml(element, workingDirectoryPath, elementName);
      } else {
        return new StoreResult(
          false,
          INVALID_ELEMENT_NAME + " [" + elementName + "]"
        );
      }
    }
  }
  return new StoreResult(
    false,
    INVALID_PATH_ERROR + " [" + workingDirectoryPath + "]"
  );
}
