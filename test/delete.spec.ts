import { deleteElement, load, store } from "../src/index";
import { getElementPathInfo } from "../src/load";
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
 * @param elementPathToDelete element path to element to be deleted from working directory of spec case
 * @returns StoreTestResult where specCasePath is path to expected parent element after delete operation and storePath is path to parent element contained deleted element
 */
function runBasicDeleteTest(specCaseName: string, elementPathToDelete: string) {
  // 1. select spec case
  const specCasePath = toSpecCasePath(specCaseName);

  // 2.1 copy (before operation state) spec case files into TMP_WORKING_DIR_PATH
  const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);

  fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

  // 2.2 copy (after operation state) spec case files into TMP_SPEC_DIR_AFTER_OPERATION_PATH
  fs.cpSync(specCasePath, TMP_SPEC_DIR_AFTER_OPERATION_PATH, {
    recursive: true,
  });

  // 3. delete element, given working directory path and element path
  const result = deleteElement(TMP_WORKING_DIR_PATH, elementPathToDelete);

  // 4. verify results of deleteElement operation
  const expectedParentElement = load(
    TMP_SPEC_DIR_AFTER_OPERATION_PATH,
    result.message
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

describe("Test basic delete function", () => {
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
  it("should delete simple string from object", async () => {
    const result = runBasicDeleteTest(
      "1.1_object_with_simple_data_types/deleteName",
      "model.name"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete other simple data types from object", async () => {
    const elementPaths = [
      "model.age",
      "model.attending",
      "model.plusOne",
      "model.degrees",
      "model.aliases",
    ];

    for (const elementPath of elementPaths) {
      const elementPathAsSplitString = elementPath.split(".");
      const expectedRootElementSpec =
        "delete" +
        elementPathAsSplitString[1].charAt(0).toUpperCase() +
        elementPathAsSplitString[1].slice(1);
      const result = runBasicDeleteTest(
        "1.1_object_with_simple_data_types/" + expectedRootElementSpec,
        elementPath
      );

      const specCasePathHash = await hashElement(result.specCasePath, options);
      const storePathHash = await hashElement(result.storePath, options);

      // verify that checksums of on-disk representation from spec case versus serialized content are identical
      expect(toJsonString(storePathHash["children"])).to.equal(
        toJsonString(specCasePathHash["children"])
      );
      fs.rmSync(result.specCasePath, { recursive: true, force: true });
      fs.rmSync(result.storePath, { recursive: true, force: true });
    }
  });
  it("should delete complex string from object", async () => {
    const result = runBasicDeleteTest(
      "1.2.1_object_with_complex_string/deleteLyrics_txt",
      "model.lyrics_txt"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete object of simple data types from object", async () => {
    const result = runBasicDeleteTest(
      "1.2.2_object_with_object_of_simple_data_types/deleteAddress",
      "model.address"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete list of complex strings from object", async () => {
    const result = runBasicDeleteTest(
      "1.2.6_object_with_list_of_complex_strings/deleteVerses_txt",
      "model.verses_txt"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete list of object of simple data types from object", async () => {
    const result = runBasicDeleteTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types/deleteNcc1701dCommanders",
      "model.ncc1701dCommanders"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete list of list of simple data type from object", async () => {
    const result = runBasicDeleteTest(
      "1.3.7.2_object_with_two_lists_of_list_of_simple_data_type/deleteSecond4Primes",
      "model.second4Primes"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete simple string from list", async () => {
    const result = runBasicDeleteTest(
      "2.1_list_of_simple_data_types/deleteItem4",
      "model[4]"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete middle complex string entry from list", async () => {
    const result = runBasicDeleteTest(
      "2.2.1_list_of_complex_string/deleteItem1",
      "model[1]"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("should delete last complex string entry from list", async () => {
    const result = runBasicDeleteTest(
      "2.2.1_list_of_complex_string/deleteItem2",
      "model[2]"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});

describe("Test delete function with nested elements", () => {
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
  it("should delete simple data type list item from object of list", async () => {
    const result = runBasicDeleteTest(
      "1.2.4_object_with_list_of_simple_data_type/deleteEmployee2",
      "model.employees[2]"
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});
