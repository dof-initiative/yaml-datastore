import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { YdsResult } from "./index.js";
import { EMPTY_WORKINGDIR_PATH_ERROR, INVALID_PATH_ERROR } from "./load.js";
import {
  doubleParenthesesRegEx,
  trimDoubleParentheses,
  getElementPathInfo,
  ElementPathType,
  generateDeleteOrClearYdsResult,
} from "./utils.js";

export const DELETE_EMPTY_ELEMENT_PATH_ERROR =
  "Error: Cannot delete element for empty element path";

/**
 * Recursively deletes list including any complex list items (i.e., objects, lists, or complex strings) from disk
 *
 * @param listPath parsed path of list to (recursively) delete
 */
export function recursivelyDeleteList(listPath: path.ParsedPath) {
  // get file path to list
  const listFilePath = path.join(listPath.dir, listPath.base);
  // get parent diriectory of list
  const listParentDir = listPath.dir;
  // get contents of list
  const listContents = fs.readFileSync(listFilePath, "utf-8");
  // load list as jsObject
  const listAsJsObj = yaml.load(listContents);

  // iterate through list and recursively delete complex list items
  for (const listItem of listAsJsObj as any) {
    // if list item is complex, delete contents on disk accordingly
    if (doubleParenthesesRegEx.test(listItem)) {
      // get parsed path for list item
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

  // delete list metadata file if one exists
  const listMetadataFilePath = path.join(listPath.dir, "." + listPath.base);
  const directoryContents = fs.readdirSync(listParentDir);
  if (directoryContents.includes("." + listPath.base)) {
    fs.rmSync(listMetadataFilePath);
  }

  // Finish by deleting list itself
  fs.rmSync(listFilePath);
}

/**
 * Helper function for deleting an element from a parent element (list or object)
 *
 * @param parentElement list or object containing child element to delete
 * @param childElement element to be deleted from parent element
 */
function deleteChildFromParentElement(parentElement: any, childElement: any) {
  if (Array.isArray(parentElement)) {
    parentElement.splice(childElement, 1);
  } else {
    delete (parentElement as any)[childElement];
  }
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
    return generateDeleteOrClearYdsResult(
      false,
      workingDirectoryPath,
      EMPTY_WORKINGDIR_PATH_ERROR,
      0
    );
  } else {
    const elementPathInfo = getElementPathInfo(
      workingDirectoryPath,
      elementPath
    );
    const parentElementPath = elementPathInfo.parentElementPath;
    const parentFilePath = elementPathInfo.parentFilePath;
    const parentIsAnElement = elementPathInfo.parentIsElement;
    let parentElement;
    if (parentIsAnElement && fs.existsSync(parentFilePath)) {
      const parentElementFileContents = fs.readFileSync(
        parentFilePath,
        "utf-8"
      );

      // direct load of parent element from which to delete child element before storing back to disk
      parentElement = yaml.load(parentElementFileContents);
    }

    switch (elementPathInfo.type) {
      case ElementPathType.empty:
        // empty element path must be pointing to an object (i.e., working directory is an object)

        // return error, since attempting delete an element from within the element is nonsensical
        return generateDeleteOrClearYdsResult(
          false,
          workingDirectoryPath,
          DELETE_EMPTY_ELEMENT_PATH_ERROR +
            " [" +
            workingDirectoryPath +
            " | " +
            elementPath +
            "]",
          0
        );
      case ElementPathType.shortToObject:
      case ElementPathType.hierarchicalToObject:
        // get parsed path to object
        const objectFilePath = path.parse(elementPathInfo.data).dir;

        // recursively delete directory path to object
        fs.rmSync(objectFilePath, { recursive: true });

        // if parent element exists, delete key-value pair from parent
        if (parentIsAnElement && fs.existsSync(parentFilePath)) {
          // delete object from parent element
          deleteChildFromParentElement(parentElement, elementPathInfo.keyName);

          // write contents of updated parent element to disk
          fs.writeFileSync(parentFilePath, yaml.dump(parentElement));
        }

        // return result of delete object operation
        return generateDeleteOrClearYdsResult(
          true,
          workingDirectoryPath,
          parentElementPath,
          depth
        );
      case ElementPathType.shortToList:
      case ElementPathType.hierarchicalToList:
        // get file path to list
        const listFilePath = elementPathInfo.data;
        // get parsed path to list
        const listPath = path.parse(listFilePath);

        // (recursively) delete list from disk
        recursivelyDeleteList(listPath);

        // if parent element exists, delete list from parent element
        if (parentIsAnElement && fs.existsSync(parentFilePath)) {
          // delete list from parent element
          deleteChildFromParentElement(parentElement, elementPathInfo.keyName);

          // write contents of updated parent element to disk
          fs.writeFileSync(parentFilePath, yaml.dump(parentElement), "utf-8");

          // return result of delete list operation
          return generateDeleteOrClearYdsResult(
            true,
            workingDirectoryPath,
            parentElementPath,
            depth
          );
        }

        // return result of delete list operation
        return generateDeleteOrClearYdsResult(
          true,
          workingDirectoryPath,
          parentElementPath,
          depth
        );
      case ElementPathType.shortToSimple:
      case ElementPathType.hierarchicalToSimple:
        // delete simple data type from parent element
        deleteChildFromParentElement(parentElement, elementPathInfo.keyName);

        // write contents of updated parent element to disk
        fs.writeFileSync(parentFilePath, yaml.dump(parentElement));

        // return result of delete simple data type operation
        return generateDeleteOrClearYdsResult(
          true,
          workingDirectoryPath,
          parentElementPath,
          depth
        );
      case ElementPathType.shortToComplexString:
      case ElementPathType.hierarchicalToComplexString:
        // get complex string file path
        const complexStringFilePath = elementPathInfo.data;

        // delete complex string file path from disk
        fs.rmSync(complexStringFilePath);

        // delete complex string from parent element
        deleteChildFromParentElement(parentElement, elementPathInfo.keyName);

        // write contents of updated parent element to disk
        fs.writeFileSync(parentFilePath, yaml.dump(parentElement), "utf-8");

        // return result of delete complex string operation
        return generateDeleteOrClearYdsResult(
          true,
          workingDirectoryPath,
          parentElementPath,
          depth
        );
      case ElementPathType.invalid:
        break;
    }
    return generateDeleteOrClearYdsResult(
      false,
      workingDirectoryPath,
      INVALID_PATH_ERROR +
        " [" +
        workingDirectoryPath +
        " | " +
        elementPath +
        "]",
      0
    );
  }
}
