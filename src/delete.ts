import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { load, YdsResult } from "./index.js";
import {
  EMPTY_WORKINGDIR_PATH_ERROR,
  INVALID_PATH_ERROR,
  ElementPathType,
  getElementPathInfo,
  doubleParenthesesRegEx,
  trimDoubleParentheses,
} from "./load.js";

class ParentElementInfo {
  private _parentElementPath: string;
  private _parentElementFilePath: string;
  private _indexOfChild: any;

  /**
   * Default constructor for ParentElementInfo
   *
   * @param parentElementPath elementPath of parent
   * @param parentElementFilePath file path to parent element
   * @param indexOfChild property in object or index in list
   */
  constructor(
    parentElementPath: string,
    parentElementFilePath: string,
    indexOfChild: any
  ) {
    this._parentElementPath = parentElementPath;
    this._parentElementFilePath = parentElementFilePath;
    this._indexOfChild = indexOfChild;
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
}

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
    indexOfChild
  );
}

/**
 * Recursively deletes complex list item (i.e., objects, lists, or complex strings) from disk
 *
 * @param complexlistItemPath path as jsObject of complex list item to (recursively) delete
 */
export function recursivelyDeleteList(listPath: path.ParsedPath) {
  const listFilePath = path.join(listPath.dir, listPath.base);
  const listContents = fs.readFileSync(listFilePath, "utf-8");
  const listAsJsObj = yaml.load(listContents);

  // iterate through list and recursively delete complex list items
  for (const listItem of listAsJsObj as any) {
    // if list item is complex, delete contents on disk accordingly
    if (doubleParenthesesRegEx.test(listItem)) {
      // get path as jsObject for list item
      const listItemPath = path.parse(
        path.join(listPath.dir, trimDoubleParentheses(listItem))
      );
      // get file path to list item as string
      const listItemFilePath = path.join(listItemPath.dir, listItemPath.base);

      if (listItemPath.base === "_this.yaml") {
        // if list item is an object, then recursively delete object directory by performing equivalent of `rm -rf <object-directory-name>`

        fs.rmSync(listItemPath.dir, { recursive: true });
      } else if (listItemPath.ext === ".yaml") {
        // else if list item is a list, then run recursive delete on list
        recursivelyDeleteList(listItemPath);
      } else {
        // else assume list item is a complex string and delete file path from disk
        fs.rmSync(listItemFilePath);
      }
    }
  }
  // Finish by deleting list itself
  fs.rmSync(listFilePath);
}

/**
 *
 * @param workingDirectoryPath relative or absolute path to working directory containing yaml-datastore serialized content
 * @param elementPath element path to element to be deleted
 * @param depth depth of element to be returned in YdsResult object
 * @returns a YdsResult containing the status of the call to deleteElement function
 */
export function deleteElement(
  workingDirectoryPath: string,
  elementPath: string,
  depth: number = 0
): YdsResult {
  if (workingDirectoryPath === "") {
    return new YdsResult(false, null, EMPTY_WORKINGDIR_PATH_ERROR);
  } else {
    const parentElementInfo = getParentElementInfo(
      workingDirectoryPath,
      elementPath
    );
    const parentElementPath = parentElementInfo.parentElementPath;
    const elementPathInfo = getElementPathInfo(
      workingDirectoryPath,
      elementPath
    );
    const parentElementFilePath = parentElementInfo.parentElementFilePath;
    const parentElementFileContents = fs.readFileSync(
      parentElementFilePath,
      "utf-8"
    );

    // direct load of parent element from which to delete child element before storing back to disk
    let parentElement = yaml.load(parentElementFileContents);

    switch (elementPathInfo.type) {
      case ElementPathType.empty:
      case ElementPathType.simpleToObject:
      case ElementPathType.complexToObject:
        fs.rmSync(path.parse(elementPathInfo.data).dir, { recursive: true });
        //TODO: dry up code for checking if parentElement is Array for deletion and writing to disk
        if (Array.isArray(parentElement)) {
          parentElement.splice(parentElementInfo.indexOfChild, 1);
        } else {
          delete (parentElement as any)[parentElementInfo.indexOfChild];
        }
        fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
        const parentElementOfObjectStoredToDisk = load(
          workingDirectoryPath,
          parentElementPath,
          depth
        ).element;
        return new YdsResult(
          true,
          parentElementOfObjectStoredToDisk,
          parentElementPath
        );
      case ElementPathType.simpleToList:
      case ElementPathType.complexToList:
        const listFilePath = elementPathInfo.data;
        const listPath = path.parse(listFilePath);
        const listParentDir = listPath.dir;

        // (recursively) delete list from disk
        recursivelyDeleteList(listPath);

        // delete list metadata file if one exists
        const listMetadataFilePath = path.join(
          listPath.dir,
          "." + listPath.base
        );
        const directoryContents = fs.readdirSync(listParentDir);
        if (directoryContents.includes("." + listPath.base)) {
          fs.rmSync(listMetadataFilePath);
        }

        // delete list from parent element
        if (Array.isArray(parentElement)) {
          parentElement.splice(parentElementInfo.indexOfChild, 1);
        } else {
          delete (parentElement as any)[parentElementInfo.indexOfChild];
        }

        // load parent element into memory for YdsResult object
        const parentElementOfListContentsToStore = yaml.dump(parentElement);
        fs.writeFileSync(
          parentElementFilePath,
          parentElementOfListContentsToStore,
          "utf-8"
        );
        const parentElementOfListStoredToDisk = load(
          workingDirectoryPath,
          parentElementPath,
          depth
        ).element;

        // return result of delete list operation
        return new YdsResult(
          true,
          parentElementOfListStoredToDisk,
          parentElementPath
        );
      case ElementPathType.simpleToSimple:
      case ElementPathType.complexToSimple:
        if (Array.isArray(parentElement)) {
          parentElement.splice(parentElementInfo.indexOfChild, 1);
        } else {
          delete (parentElement as any)[parentElementInfo.indexOfChild];
        }
        fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.simpleToComplexString:
      case ElementPathType.complexToComplexString:
        fs.rmSync(elementPathInfo.data);
        if (Array.isArray(parentElement)) {
          parentElement.splice(parentElementInfo.indexOfChild, 1);
        } else {
          delete (parentElement as any)[parentElementInfo.indexOfChild];
        }
        const parentElementOfComplexStringContentsToStore =
          yaml.dump(parentElement);
        fs.writeFileSync(
          parentElementFilePath,
          parentElementOfComplexStringContentsToStore,
          "utf-8"
        );
        const parentElementOfComplexStringStoredToDisk = load(
          workingDirectoryPath,
          parentElementPath,
          depth
        ).element;
        return new YdsResult(
          true,
          parentElementOfComplexStringStoredToDisk,
          parentElementPath
        );
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
