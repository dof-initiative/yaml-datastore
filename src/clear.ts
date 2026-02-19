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
import {
  getParentElementInfo,
  recursivelyDeleteComplexListItem,
} from "./delete.js";

/**
 *
 * @param workingDirectoryPath relative or absolute path to working directory containing yaml-datastore serialized content
 * @param elementPath element path to element to be cleared
 * @param depth depth of element to be returned in YdsResult object
 * @returns a YdsResult containing the status of the call to clear function
 */
export function clear(
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
        (parentElement as any)[parentElementInfo.indexOfChild] = {};
        fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.simpleToList:
      case ElementPathType.complexToList:
        const listFilePathAsString = elementPathInfo.data;
        const listFilePath = path.parse(listFilePathAsString);
        const listParentDir = listFilePath.dir;

        // iterate through list elements and (recursively) delete each complex list item from disk
        const listContents = fs.readFileSync(listFilePathAsString, "utf-8");
        const listAsJsObj = yaml.load(listContents);
        for (const listItem of listAsJsObj as any) {
          if (doubleParenthesesRegEx.test(listItem)) {
            const listItemFilePath = path.parse(
              path.join(listParentDir, trimDoubleParentheses(listItem))
            );
            recursivelyDeleteComplexListItem(listItemFilePath);
          }
        }

        // delete list from disk
        fs.rmSync(listFilePathAsString);

        // delete list metadata file if one exists
        const listMetadataFilePath = path.join(
          listFilePath.dir,
          "." + listFilePath.base
        );
        const directoryContents = fs.readdirSync(listParentDir);
        if (directoryContents.includes("." + listFilePath.base)) {
          fs.rmSync(listMetadataFilePath);
        }

        // clear list from parent element
        (parentElement as any)[parentElementInfo.indexOfChild] = [];

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
        if (
          (parentElement as any)[parentElementInfo.indexOfChild] === null ||
          (parentElement as any)[parentElementInfo.indexOfChild] === "" ||
          typeof (parentElement as any)[parentElementInfo.indexOfChild] ===
            "object"
        ) {
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof (parentElement as any)[parentElementInfo.indexOfChild] ===
          "string"
        ) {
          (parentElement as any)[parentElementInfo.indexOfChild] = "";
          fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof (parentElement as any)[parentElementInfo.indexOfChild] ===
            "number" ||
          typeof (parentElement as any)[parentElementInfo.indexOfChild] ===
            "boolean"
        ) {
          (parentElement as any)[parentElementInfo.indexOfChild] = null;
          fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        }
      case ElementPathType.simpleToComplexString:
      case ElementPathType.complexToComplexString:
        fs.rmSync(elementPathInfo.data);
        (parentElement as any)[parentElementInfo.indexOfChild] = "";
        fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
        return new YdsResult(true, parentElement, parentElementPath);
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
