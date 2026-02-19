import { store } from "../src/index";
import { toJsonString, toSpecCasePath, runBasicLoadTest } from "./load.spec";
import {
  INVALID_ELEMENT_NAME,
  INVALID_PATH_ERROR,
  NONEMPTY_WORKINGDIR_PATH_ERROR,
  reserved_keywords,
} from "../src/store";
import { expect } from "chai";
import fs from "node:fs";
import path from "path";
import { hashElement } from "folder-hash";
import { DEFAULT_SPEC_CASE_FOLDER } from "./spec_constants";

const TMP_WORKING_DIR_PATH = "/tmp/my-project";
let workingDir = "";

// options for files/folders to ignore for hashElement
const options = {
  files: { exclude: ["*.json", "modelDelete*", "modelClear*"] },
  folders: { exclude: ["modelDelete*", "modelClear*"] },
};

export class StoreTestResult {
  private _specCasePath: string;
  private _storePath: string;

  /**
   * Default constructor for StoreTestResult
   *
   * @param specCasePath directory path containing spec case.
   * @param storePath directory path containing serialized content.
   */
  constructor(specCasePath: string, storePath: string) {
    this._specCasePath = specCasePath;
    this._storePath = storePath;
  }

  /** @returns directory path containing spec case. */
  public get specCasePath() {
    return this._specCasePath;
  }
  /** @returns directory path containing serialized content. */
  public get storePath() {
    return this._storePath;
  }
}

function runBasicStoreTest(specCaseName: string): StoreTestResult {
  // 1. select spec case
  const specCasePath = toSpecCasePath(
    path.join(specCaseName, DEFAULT_SPEC_CASE_FOLDER)
  );

  // 2. load model.json from spec case into memory
  const element = JSON.parse(
    fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
  );
  const elementName = "model";
  let specCaseDir = "";
  let tempDir = "";
  let filename = "";
  if (Array.isArray(element)) {
    specCaseDir = specCasePath;
    tempDir = TMP_WORKING_DIR_PATH;
    filename = elementName + ".yaml";
  } else {
    specCaseDir = path.join(specCasePath, elementName);
    tempDir = path.join(TMP_WORKING_DIR_PATH, elementName);
    filename = "_this.yaml";
  }
  const expectedFilePath = path.join(tempDir, filename);
  const specCaseFilePath = path.join(specCaseDir, filename);
  const expectedResultContents = fs.readFileSync(
    path.resolve(specCaseFilePath),
    "utf-8"
  );

  // 3. store element in working directory
  const result = store(element, workingDir, elementName);

  expect(result.success).to.equal(true);
  expect(result.message).to.equal(elementName);
  const resultContents = fs.readFileSync(
    path.resolve(expectedFilePath),
    "utf-8"
  );
  expect(resultContents).to.equal(expectedResultContents);

  // 4. run basic load test with TMP_WORKING_DIR_PATH (i.e., path containing serialized content from store() function) as working directory path
  runBasicLoadTest(specCaseName, workingDir);

  return new StoreTestResult(specCasePath, TMP_WORKING_DIR_PATH);
}

describe("Test basic store function", () => {
  beforeEach(function () {
    workingDir = TMP_WORKING_DIR_PATH;
    fs.mkdirSync(workingDir);
  });
  afterEach(function () {
    fs.rmSync(TMP_WORKING_DIR_PATH, { recursive: true, force: true });
  });
  it("shall error when working directory path does not exist", () => {
    const element = {};
    workingDir = "test/spec/does_not_exist";
    const elementName = "model";
    const result = store(element, workingDir, elementName);
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall error when working directory path exists, but non-empty", () => {
    const element = {};
    workingDir = "test/spec/1.1_object_with_simple_data_types";
    const elementName = "model";
    const result = store(element, workingDir, elementName);
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(NONEMPTY_WORKINGDIR_PATH_ERROR));
  });
  it("shall error when element name starts with a digit", () => {
    const element = {};
    const elementName = "1model";
    const result = store(element, workingDir, elementName);
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_ELEMENT_NAME));
  });
  it("shall error when element name contains a special character (except for underscores and dollar signs)", () => {
    const element = {};
    const elementName = "model!";
    const result = store(element, workingDir, elementName);
    expect(result.success).to.equal(false);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_ELEMENT_NAME));
  });
  it("shall error when element name is a reserved keyword in javascript", () => {
    for (const elementName of reserved_keywords) {
      const element = {};
      const result = store(element, workingDir, elementName);
      expect(result.success).to.equal(false);
      expect(result.message)
        .to.be.a("string")
        .and.satisfy((msg) => msg.startsWith(INVALID_ELEMENT_NAME));
    }
  });
  it("shall store object with simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.1_object_with_simple_data_types"
    );

    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with complex string", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.1_object_with_complex_string"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with object of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.2_object_with_object_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with object of complex data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.3_object_with_object_of_complex_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with list of simple data type", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.4_object_with_list_of_simple_data_type"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with list of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.5_object_with_list_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with list of complex strings", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.6_object_with_list_of_complex_strings"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with list of objects of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.2.7.1_object_with_list_of_objects_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with list of list of simple data type", () => {
    runBasicStoreTest("1.2.7.2_object_with_list_of_list_of_simple_data_type");
  });
  it("shall store object with two complex strings", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.1_object_with_two_complex_strings"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two objects of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.2_object_with_two_objects_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two objects of complex data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.3_object_with_two_objects_of_complex_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two lists of simple data type", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.4_object_with_two_lists_of_simple_data_type"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two lists of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.5_object_with_two_lists_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two lists of complex strings", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.6_object_with_two_lists_of_complex_strings"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two lists of objects of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with two lists of list of simple data type", async () => {
    const storeTestResult = runBasicStoreTest(
      "1.3.7.2_object_with_two_lists_of_list_of_simple_data_type"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with empty object", async () => {
    const storeTestResult = runBasicStoreTest("1.4.1_object_with_empty_object");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store object with empty list", () => {
    runBasicStoreTest("1.4.2_object_with_empty_list");
  });
  it("shall store list of simple data types", async () => {
    const storeTestResult = runBasicStoreTest("2.1_list_of_simple_data_types");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of complex string", async () => {
    const storeTestResult = runBasicStoreTest("2.2.1_list_of_complex_string");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of objects of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.2_list_of_objects_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of objects of complex data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.3_list_of_objects_of_complex_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of list of simple data type", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.4_list_of_list_of_simple_data_type"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of list of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.5_list_of_list_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of list of complex strings", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.6_list_of_list_of_complex_strings"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of list of objects of simple data types", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.7.1_list_of_list_of_objects_of_simple_data_types"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list of list of of list simple data type", async () => {
    const storeTestResult = runBasicStoreTest(
      "2.2.7.2_list_of_list_of_list_of_simple_data_type"
    );
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list with empty object", async () => {
    const storeTestResult = runBasicStoreTest("2.3.1_list_with_empty_object");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store list with empty list", async () => {
    const storeTestResult = runBasicStoreTest("2.3.2_list_with_empty_list");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
  it("shall store legacy project", async () => {
    const storeTestResult = runBasicStoreTest("3.1_legacy_project");
    const specCasePathHash = await hashElement(
      storeTestResult.specCasePath,
      options
    );

    const storePathHash = await hashElement(storeTestResult.storePath);

    // verify that checksums of on-disk representation from spec case versus serialized content are identical
    expect(toJsonString(storePathHash["children"])).to.equal(
      toJsonString(specCasePathHash["children"])
    );
  });
});
