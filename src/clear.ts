import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { load, YdsResult } from "./index.js";
import { EMPTY_WORKINGDIR_PATH_ERROR, INVALID_PATH_ERROR } from "./load.js";
import {
  getElementPathInfo,
  ElementPathType,
  convertYamlFilePathToElementPath,
} from "./utils.js";
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
    const parentFilePath = elementPathInfo.parentFilePath;
    const parentIsAnElement = elementPathInfo.parentIsElement;
    let parentElement = null;
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
        // empty element path must be pointing to an object

        // get file path to object
        const elementFilePath = elementPathInfo.data;
        // get parsed path to object
        const emptyToObjectParsedPath = path.parse(elementPathInfo.data);
        // get directory path to object
        const emptyToObjectDirPath = emptyToObjectParsedPath.dir;

        // recursively delete contents of directory path and directory itself
        fs.rmSync(emptyToObjectDirPath, { recursive: true });

        // if parent is an element clear its key-value pair
        if (parentIsAnElement && fs.existsSync(parentFilePath)) {
          // extract element name from filepath
          const elementName = convertYamlFilePathToElementPath(elementFilePath)
            .split(".")
            .slice(-1)[0];
          // clear key-value pair for element name in parent element
          (parentElement as any)[elementName] = {};
          // load contents of parent element
          const parentElementOfObjectContentsToStore = yaml.dump(parentElement);

          // overwrite contents of parent element with cleared key-value pair for element name
          fs.writeFileSync(
            parentFilePath,
            parentElementOfObjectContentsToStore
          );

          // return result of clear object operation
          return new YdsResult(true, parentElement, parentElementPath);
        }

        // object has no parent, therefore it is the root element whose contents shall be cleared
        const objectContentsToStore = yaml.dump({});

        // recreate directory for persisting cleared object
        fs.mkdirSync(emptyToObjectDirPath);
        // recreate _this.yaml whose contents are an empty object, {}
        fs.writeFileSync(elementFilePath, objectContentsToStore, "utf-8");

        // return result of clear object operation
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.shortToObject:
        // get parsed path to object
        const shortToObjectParsedPath = path.parse(elementPathInfo.data);
        // get directory path to object
        const shortToObjectDirPath = shortToObjectParsedPath.dir;

        // if object has no parent, clear its contents
        if (!parentIsAnElement) {
          // rm -rf directory
          fs.rmSync(shortToObjectDirPath, { recursive: true });
          // recreate new directory with a _this.yaml containing empty object, {}
          fs.mkdirSync(shortToObjectDirPath);

          const elementToStore = {};
          const objectContentsToStore = yaml.dump(elementToStore);
          const thisYamlFilePath = path.join(
            shortToObjectDirPath,
            "_this.yaml"
          );

          // recreate _this.yaml whose contents are an empty object, {}
          fs.writeFileSync(thisYamlFilePath, objectContentsToStore);

          // return result of clear object operation
          return new YdsResult(true, elementToStore, elementPathInfo.keyName);
        }
      case ElementPathType.hierarchicalToObject:
        // get parsed path to object
        const hierarchicalToObjectParsedPath = path.parse(elementPathInfo.data);
        // get directory path to object
        const hierarchicalToObjectDirPath = hierarchicalToObjectParsedPath.dir;

        fs.rmSync(hierarchicalToObjectDirPath, { recursive: true });

        if (parentIsAnElement && fs.existsSync(parentFilePath)) {
          (parentElement as any)[elementPathInfo.keyName] = {};
          const parentElementOfObjectContentsToStore = yaml.dump(parentElement);
          fs.writeFileSync(
            parentFilePath,
            parentElementOfObjectContentsToStore
          );
        }

        // return result of clear object operation
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.shortToList:
      case ElementPathType.hierarchicalToList:
        // get file path to list
        const listFilePath = elementPathInfo.data;
        // get parsed path to list
        const listPath = path.parse(listFilePath);
        // get parent diriectory of list
        const listParentDir = listPath.dir;

        // read list metadata file if one exists
        const listMetadataFilePath = path.join(
          listPath.dir,
          "." + listPath.base
        );
        const directoryContents = fs.readdirSync(listParentDir);
        let listMeetadataFileContents = "";
        if (directoryContents.includes("." + listPath.base)) {
          listMeetadataFileContents = fs.readFileSync(
            listMetadataFilePath,
            "utf-8"
          );
        }

        // (recursively) delete list from disk
        recursivelyDeleteList(listPath);

        let parentElementOfListStoredToDisk = null;
        // clear list from parent element
        if (
          parentIsAnElement &&
          fs.existsSync(parentFilePath) /*&&
          elementPathInfo.type === ElementPathType.hierarchicalToList*/
        ) {
          (parentElement as any)[elementPathInfo.keyName] = [];

          // load parent element into memory for YdsResult object
          const parentElementOfListContentsToStore = yaml.dump(parentElement);
          fs.writeFileSync(
            parentFilePath,
            parentElementOfListContentsToStore,
            "utf-8"
          );
          parentElementOfListStoredToDisk = load(
            workingDirectoryPath,
            parentElementPath,
            depth
          ).element;

          // return result of clear list operation
          return new YdsResult(
            true,
            parentElementOfListStoredToDisk,
            parentElementPath
          );
        }

        // create file at list file path and set its contents to an empty list, [], for case where list is the root element
        const listContentsToStore = yaml.dump([]);
        fs.writeFileSync(listFilePath, listContentsToStore, "utf-8");

        // recreate list metadata file, if one existed
        // TODO: consider refactoring recursivelyDeleteList() helper function to not delete root list metadata file when used for clear operation
        if (listMeetadataFileContents !== "") {
          const listMetadataFilePath = path.join(
            listPath.dir,
            "." + listPath.base
          );
          fs.writeFileSync(listMetadataFilePath, listMeetadataFileContents);
        }

        // return result of clear list operation
        return new YdsResult(true, parentElement, parentElementPath);
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
