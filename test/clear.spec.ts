import { clear } from "../src/index";
import { load } from "../src/load";
import { toJsonString, toSpecCasePath } from "./utils.spec";
import { DEFAULT_SPEC_CASE_FOLDER } from "./spec_constants";
import { StoreTestResult } from "./store.spec";
import { getElementPathInfo } from "../src/utils";
import { INVALID_PATH_ERROR } from "../src/store";
import { expect } from "chai";
import fs from "node:fs";
import path from "path";
import { hashElement } from "folder-hash";
import { CLEAR_EMPTY_ELEMENT_PATH_ERROR } from "../src/clear";

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

// see invalid in ElementPathType (enum)
describe("Test basic clear function for invalid path", () => {
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
  it("shall throw an error when attempting to clear an empty element path where working directory is not an object", () => {
    // 1. get spec case path
    const specCasePath = toSpecCasePath(
      "1.2.3_object_with_object_of_complex_data_types/" +
        DEFAULT_SPEC_CASE_FOLDER
    );
    const workingDirectoryPath = TMP_WORKING_DIR_PATH;
    const elementPathToClear = "";

    // 2 copy (before operation state) spec case files into TMP_WORKING_DIR_PATH
    const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);
    fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

    // 3. clear element, given working directory path and element path
    const result = clear(workingDirectoryPath, elementPathToClear);

    // 4. verify results of clearElement operation
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
});

// see empty in ElementPathType (enum)
describe("Test basic clear function for empty element path pointing to an object", () => {
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
  it("shall throw an error when attempting to clear an empty element path where working directory is an object and its parent is not an element", () => {
    // 1. get spec case path
    const specCasePath = toSpecCasePath(
      "1.2.3_object_with_object_of_complex_data_types/" +
        DEFAULT_SPEC_CASE_FOLDER
    );
    const workingDirectoryPath = path.join(TMP_WORKING_DIR_PATH, "model");
    const elementPathToClear = "";

    // 2 copy (before operation state) spec case files into TMP_WORKING_DIR_PATH
    const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);
    fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

    // 3. clear element, given working directory path and element path
    const result = clear(workingDirectoryPath, elementPathToClear);

    // 4. verify results of clearElement operation
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(CLEAR_EMPTY_ELEMENT_PATH_ERROR));
  });
  it("shall throw an error when attempting to clear an empty element path where working directory is an object and its parent is an element", () => {
    // 1. get spec case path
    const specCasePath = toSpecCasePath(
      "1.2.3_object_with_object_of_complex_data_types/" +
        DEFAULT_SPEC_CASE_FOLDER
    );
    const workingDirectoryPath = path.join(TMP_WORKING_DIR_PATH, "model/myObj");
    const elementPathToClear = "";

    // 2 copy (before operation state) spec case files into TMP_WORKING_DIR_PATH
    const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);
    fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

    // 3. clear element, given working directory path and element path
    const result = clear(workingDirectoryPath, elementPathToClear);

    // 4. verify results of clearElement operation
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(CLEAR_EMPTY_ELEMENT_PATH_ERROR));
  });
});

// see shortToObject in ElementPathType (enum)
describe("Test basic clear function for short element path pointing to object", () => {
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
  it("shall clear object of complex data types from object for short element path to object where working directory is an object", async () => {
    // 1. get spec case path
    const specCasePath = toSpecCasePath(
      "1.2.3_object_with_object_of_complex_data_types/clearMyObj"
    );
    const workingDirectoryPath = path.join(TMP_WORKING_DIR_PATH, "model");
    const specCaseWorkingDirectoryPath = path.join(
      TMP_SPEC_DIR_AFTER_OPERATION_PATH,
      "model"
    );
    const elementPathToDelete = "myObj";
    const depth = 0;

    // 2.1 copy before-operation state spec case files into TMP_WORKING_DIR_PATH
    const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);
    fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

    // 2.2 copy after-operation state spec case files into TMP_SPEC_DIR_AFTER_OPERATION_PATH
    fs.cpSync(specCasePath, TMP_SPEC_DIR_AFTER_OPERATION_PATH, {
      recursive: true,
    });

    // 3. delete element, given working directory path and element path
    const result = clear(workingDirectoryPath, elementPathToDelete, depth);

    // 4. verify results of deleteElement operation
    const expectedResult = load(
      specCaseWorkingDirectoryPath,
      result.message,
      depth
    );

    const expectedParentElement = expectedResult.element;
    expect(result.success).to.equal(true);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedParentElement)
    );

    // 5. get hashElements for expected directory and resulting (after-operation) directory
    const specCasePathHash = await hashElement(
      TMP_SPEC_DIR_AFTER_OPERATION_PATH,
      options
    );
    const storePathHash = await hashElement(TMP_WORKING_DIR_PATH, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear object of object of complex data types for short element path to object where working directory is not an object", async () => {
    // 1. get spec case path
    const specCasePath = toSpecCasePath(
      "1.2.3_object_with_object_of_complex_data_types/clearModel"
    );
    const workingDirectoryPath = TMP_WORKING_DIR_PATH;
    const specCaseWorkingDirectoryPath = TMP_SPEC_DIR_AFTER_OPERATION_PATH;
    const elementPathToDelete = "model";
    const depth = 0;

    // 2.1 copy before-operation state spec case files into TMP_WORKING_DIR_PATH
    const defaultCasePath = path.join(specCasePath, DEFAULT_SPEC_CASE_PATH);
    fs.cpSync(defaultCasePath, TMP_WORKING_DIR_PATH, { recursive: true });

    // 2.2 copy after-operation state spec case files into TMP_SPEC_DIR_AFTER_OPERATION_PATH
    fs.cpSync(specCasePath, TMP_SPEC_DIR_AFTER_OPERATION_PATH, {
      recursive: true,
    });

    // 3. delete element, given working directory path and element path
    const result = clear(workingDirectoryPath, elementPathToDelete, depth);

    // 4. verify results of deleteElement operation
    const expectedResult = load(
      specCaseWorkingDirectoryPath,
      result.message,
      depth
    );

    const expectedParentElement = expectedResult.element;
    expect(result.success).to.equal(true);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedParentElement)
    );

    // 5. get hashElements for expected directory and resulting (after-operation) directory
    const specCasePathHash = await hashElement(
      TMP_SPEC_DIR_AFTER_OPERATION_PATH,
      options
    );
    const storePathHash = await hashElement(TMP_WORKING_DIR_PATH, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});

// see shortToList in ElementPathType (enum)
describe("Test basic clear function for short element path pointing to list", () => {
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
  //TODO
});

// see shortToComplexString in ElementPathType (enum)
describe("Test basic clear function for short element path pointing to complex string", () => {
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
  //TODO
});

// see shortToSimple in ElementPathType (enum)
describe("Test basic clear function for short element path pointing to simple data type", () => {
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
  //TODO
});

// see hierarchicalToObject in ElementPathType (enum)
describe("Test basic clear function for hierarchical element path pointing to object", () => {
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
  it("shall clear object from list", async () => {
    const result = runBasicClearTest(
      "2.2.2_list_of_objects_of_simple_data_types/clearItem0",
      "model[0]",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});

// see hierarchicalToList in ElementPathType (enum)
describe("Test basic clear function for hierarchical element path pointing to list", () => {
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
  it("shall clear list of object of simple data types from object with two lists of objects of simple data types, for depth = 0", async () => {
    const result = runBasicClearTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types/clearNcc1701dCommanders",
      "model.ncc1701dCommanders",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear list of object of simple data types from object with two lists of objects of simple data types, for depth = 1", async () => {
    const result = runBasicClearTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types/clearNcc1701dCommanders",
      "model.ncc1701dCommanders",
      1
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
  it("shall clear list from list", async () => {
    const result = runBasicClearTest(
      "2.2.4_list_of_list_of_simple_data_type/clearFirst5Primes",
      "model[0]",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});

// see hierarchicalToComplexString in ElementPathType (enum)
describe("Test basic clear function for hierarchical element path pointing to complex string", () => {
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
  it("shall clear middle complex string entry from list", async () => {
    const result = runBasicClearTest(
      "2.2.1_list_of_complex_string/clearItem1",
      "model[1]",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall clear last complex string entry from list", async () => {
    const result = runBasicClearTest(
      "2.2.1_list_of_complex_string/clearItem2",
      "model[2]",
      0
    );

    const specCasePathHash = await hashElement(result.specCasePath, options);
    const storePathHash = await hashElement(result.storePath, options);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});

// see hierarchicalToSimple in ElementPathType (enum)
describe("Test basic clear function for hierarchical element path pointing to simple data type", () => {
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
  it("shall clear other simple data types from object", async () => {
    const elementPaths = [
      "model.name", // test for clearing a non-empty string
      "model.age", // test for clearing a number
      "model.attending", // test for clearing a boolean
      "model.plusOne", // test for clearing a null
      "model.degrees", // test for clearing an empty object
      "model.aliases", // test for clearing an empty list
      "model.notes", // test for clearing an empty string
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
  it("shall clear other simple data types from list", async () => {
    const elementPaths = [
      "model[0]", // test for deleting a non-empty string
      "model[1]", // test for deleting a number
      "model[2]", // test for deleting a boolean
      "model[3]", // test for deleting a null
      "model[5]", // test for deleting an empty object
      "model[6]", // test for deleting an empty list
      "model[7]", // test for deleting an empty string
    ];

    for (const elementPath of elementPaths) {
      const elementPathAsSplitString = elementPath.split("[");
      const expectedRootElementSpec =
        "clearItem" + elementPathAsSplitString[1].slice(0, -1);
      const result = runBasicClearTest(
        "2.1_list_of_simple_data_types/" + expectedRootElementSpec,
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
  it("shall clear simple data type from list in an object", async () => {
    const result = runBasicClearTest(
      "1.2.4_object_with_list_of_simple_data_type/clearEmployee2",
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
