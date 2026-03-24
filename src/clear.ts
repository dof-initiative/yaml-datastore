import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { load, YdsResult } from "./index.js";
import { EMPTY_WORKINGDIR_PATH_ERROR, INVALID_PATH_ERROR } from "./load.js";
import { getElementPathInfo, ElementPathType } from "./utils.js";
import { recursivelyDeleteList } from "./delete.js";

export const CLEAR_EMPTY_ELEMENT_PATH_ERROR =
  "Error: Cannot clear element for empty element path";

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
    const elementPathInfo = getElementPathInfo(
      workingDirectoryPath,
      elementPath
    );
    const parentElementPath = elementPathInfo.parentElementPath;
    const parentIsAnElement = parentElementPath !== "";
    const parentFilePath = elementPathInfo.parentFilePath;
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
        return new YdsResult(
          false,
          null,
          CLEAR_EMPTY_ELEMENT_PATH_ERROR +
            " [" +
            workingDirectoryPath +
            " | " +
            elementPath +
            "]"
        );
      case ElementPathType.shortToObject:
      case ElementPathType.hierarchicalToObject:
        fs.rmSync(path.parse(elementPathInfo.data).dir, { recursive: true });
        (parentElement as any)[elementPathInfo.keyName] = {};
        fs.writeFileSync(parentFilePath, yaml.dump(parentElement));
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.shortToList:
      case ElementPathType.hierarchicalToList:
        // get file path to list
        const listFilePath = elementPathInfo.data;
        // get parsed path to list
        const listPath = path.parse(listFilePath);
        // get parent diriectory of list
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

        // clear list from parent element
        (parentElement as any)[elementPathInfo.keyName] = [];

        // load parent element into memory for YdsResult object
        const parentElementOfListContentsToStore = yaml.dump(parentElement);
        fs.writeFileSync(
          parentFilePath,
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
      case ElementPathType.shortToSimple:
      case ElementPathType.hierarchicalToSimple:
        if (
          (parentElement as any)[elementPathInfo.keyName] === null ||
          (parentElement as any)[elementPathInfo.keyName] === "" ||
          typeof (parentElement as any)[elementPathInfo.keyName] === "object"
        ) {
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof (parentElement as any)[elementPathInfo.keyName] === "string"
        ) {
          (parentElement as any)[elementPathInfo.keyName] = "";
          fs.writeFileSync(parentFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof (parentElement as any)[elementPathInfo.keyName] === "number" ||
          typeof (parentElement as any)[elementPathInfo.keyName] === "boolean"
        ) {
          (parentElement as any)[elementPathInfo.keyName] = null;
          fs.writeFileSync(parentFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        }
      case ElementPathType.shortToComplexString:
      case ElementPathType.hierarchicalToComplexString:
        // get complex string file path
        const complexStringFilePath = elementPathInfo.data;

        // clear contents of complex string file on disk
        const complexStringContentsToStore = "\n";
        fs.writeFileSync(
          complexStringFilePath,
          complexStringContentsToStore,
          "utf-8"
        );

        // return result of clear complex string operation
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
