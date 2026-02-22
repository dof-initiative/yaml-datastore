import { clear } from "../src/index";
import { getElementPathInfo, load } from "../src/load";
import { toJsonString, toSpecCasePath } from "./load.spec";
import { DEFAULT_SPEC_CASE_FOLDER } from "./spec_constants";
import { StoreTestResult } from "./store.spec";
import { expect } from "chai";
import fs from "node:fs";
import path from "path";
import { hashElement } from "folder-hash";

const TMP_WORKING_DIR_PATH = "/tmp/my-project";
const TMP_SPEC_DIR_AFTER_OPERATION_PATH = "/tmp/spec-project";
const DEFAULT_SPEC_CASE_PATH = "../" + DEFAULT_SPEC_CASE_FOLDER;

// options for files/folders to ignore for hashElement
const options = {
  files: { exclude: ["*.json"] },
};

/**
 *
 * @param specCaseName folder name of spec to test
 * @param elementPathToClear element path to element to be cleared from working directory of spec case
 * @param depth depth of element to be returned in YdsResult object
 * @returns StoreTestResult where specCasePath is path to expected parent element after clear operation and storePath is path to parent element contained cleared element
 */
function runBasicClearTest(
  specCaseName: string,
  elementPathToClear: string,
  depth: number = -1
) {
  // 1. select spec case
  const specCasePath = toSpecCasePath(specCaseName);

  // 2.1 copy (before operation state) spec case files into TMP_WORKING_DIR_PATH
  const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);

  fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

  // 2.2 copy (after operation state) spec case files into TMP_SPEC_DIR_AFTER_OPERATION_PATH
  fs.cpSync(specCasePath, TMP_SPEC_DIR_AFTER_OPERATION_PATH, {
    recursive: true,
  });

  // 3. clear element, given working directory path and element path
  const result = clear(TMP_WORKING_DIR_PATH, elementPathToClear, depth);

  // 4. verify results of clear operation
  const expectedParentElement = load(
    specCasePath,
    result.message,
    depth
  ).element;

  expect(result.success).to.equal(true);
  expect(toJsonString(result.element)).to.equal(
    toJsonString(expectedParentElement)
  );

  // 5. return test results
  const filePathToExpectedParentElement = getElementPathInfo(
    TMP_SPEC_DIR_AFTER_OPERATION_PATH,
    result.message
  ).data;

  const directoryPathToExpectedParentElement = path.parse(
    filePathToExpectedParentElement
  ).dir;
  const directoryPathToResultParentElement = path.parse(
    getElementPathInfo(TMP_WORKING_DIR_PATH, result.message).data
  ).dir;

  return new StoreTestResult(
    directoryPathToExpectedParentElement,
    directoryPathToResultParentElement
  );
}

describe("Test basic clear function", () => {
  beforeEach(function () {
    fs.mkdirSync(TMP_WORKING_DIR_PATH);
    fs.mkdirSync(TMP_SPEC_DIR_AFTER_OPERATION_PATH);
  });
  afterEach(function () {
    fs.rmSync(TMP_WORKING_DIR_PATH, { recursive: true, force: true });
    fs.rmSync(TMP_SPEC_DIR_AFTER_OPERATION_PATH, {
      recursive: true,
      force: true,
    });
  });
  it("shall clear simple string from object", async () => {
    const result = runBasicClearTest(
      "1.1_object_with_simple_data_types/clearName",
      "model.name"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear other simple data types from object", async () => {
    const elementPaths = [
      "model.age",
      "model.attending",
      "model.plusOne",
      "model.degrees",
      "model.aliases",
      "model.notes",
    ];

    for (const elementPathToClear of elementPaths) {
      const elementPathAsSplitString = elementPathToClear.split(".");
      const expectedParentElementPath =
        "clear" +
        elementPathAsSplitString[1].charAt(0).toUpperCase() +
        elementPathAsSplitString[1].slice(1);
      const result = runBasicClearTest(
        path.join(
          "1.1_object_with_simple_data_types",
          expectedParentElementPath
        ),
        elementPathToClear
      );

      const specCasePathHash = await hashElement(result.specCasePath, options);
      const storePathHash = await hashElement(result.storePath, options);

      // verify that checksums of on-disk representation from spec case versus serialized content are identical
      expect(toJsonString(storePathHash["children"])).to.equal(
        toJsonString(specCasePathHash["children"])
      );
    }
  });
  it("shall clear complex string from object", async () => {
    const result = runBasicClearTest(
      "1.2.1_object_with_complex_string/clearLyrics_txt",
      "model.lyrics_txt",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear object of simple data types from object", async () => {
    const result = runBasicClearTest(
      "1.2.2_object_with_object_of_simple_data_types/clearAddress",
      "model.address"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear list of complex strings from object", async () => {
    const result = runBasicClearTest(
      "1.2.6_object_with_list_of_complex_strings/clearVerses_txt",
      "model.verses_txt"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear list of object of simple data types from object", async () => {
    const result = runBasicClearTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types/clearNcc1701dCommanders",
      "model.ncc1701dCommanders"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear list of list of simple data type from object", async () => {
    const result = runBasicClearTest(
      "1.3.7.2_object_with_two_lists_of_list_of_simple_data_type/clearSecond4Primes",
      "model.second4Primes"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear simple string from list", async () => {
    const result = runBasicClearTest(
      "2.1_list_of_simple_data_types/clearItem4",
      "model[4]"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});
