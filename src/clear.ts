import path from "path";
import fs from "node:fs";
import yaml from "js-yaml";
import { load, YdsResult } from "./index.js";
import {
  EMPTY_WORKINGDIR_PATH_ERROR,
  INVALID_PATH_ERROR,
  ElementPathType,
  getElementPathInfo,
} from "./load.js";
import { getParentElementInfo, testListItemFileName } from "./delete.js";
import { storeYaml } from "./store.js";

export function clear(
  workingDirectoryPath: string,
  elementPath: string
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
    let parentElement = load(workingDirectoryPath, parentElementPath).element;
    switch (elementPathInfo.type) {
      case ElementPathType.empty:
      case ElementPathType.simpleToObject:
      case ElementPathType.complexToObject:
        fs.rmSync(path.parse(elementPathInfo.data).dir, { recursive: true });
        parentElement[parentElementInfo.indexOfChild] = {};
        fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.simpleToList:
      case ElementPathType.complexToList:
        const listFilePath = path.parse(elementPathInfo.data);
        const directoryContents = fs.readdirSync(
          path.parse(elementPathInfo.data).dir
        );
        for (const item of directoryContents) {
          if (
            testListItemFileName(
              listFilePath,
              path.parse(path.join(listFilePath.dir, item))
            )
          ) {
            const fileToDelete = path.join(
              path.parse(elementPathInfo.data).dir,
              item
            );
            fs.rmSync(fileToDelete, {
              recursive: true,
            });
          }
        }
        fs.rmSync(elementPathInfo.data);
        const listMetadataFilePath = path.join(
          listFilePath.dir,
          "." + listFilePath.base
        );
        if (directoryContents.includes("." + listFilePath.base)) {
          fs.rmSync(listMetadataFilePath);
        }
        parentElement[parentElementInfo.indexOfChild] = [];
        storeYaml(parentElement, workingDirectoryPath, parentElementPath);
        return new YdsResult(true, parentElement, parentElementPath);
      case ElementPathType.simpleToSimple:
      case ElementPathType.complexToSimple:
        if (
          parentElement[parentElementInfo.indexOfChild] === null ||
          parentElement[parentElementInfo.indexOfChild] === "" ||
          typeof parentElement[parentElementInfo.indexOfChild] === "object"
        ) {
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof parentElement[parentElementInfo.indexOfChild] === "string"
        ) {
          parentElement[parentElementInfo.indexOfChild] = "";
          fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        } else if (
          typeof parentElement[parentElementInfo.indexOfChild] === "number" ||
          typeof parentElement[parentElementInfo.indexOfChild] === "boolean"
        ) {
          parentElement[parentElementInfo.indexOfChild] = null;
          fs.writeFileSync(parentElementFilePath, yaml.dump(parentElement));
          return new YdsResult(true, parentElement, parentElementPath);
        }
      case ElementPathType.simpleToComplexString:
      case ElementPathType.complexToComplexString:
        fs.rmSync(elementPathInfo.data);
        parentElement[parentElementInfo.indexOfChild] = "";
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
