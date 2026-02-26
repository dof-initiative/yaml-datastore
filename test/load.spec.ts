import { load } from "../src/index";
import { EMPTY_WORKINGDIR_PATH_ERROR, INVALID_PATH_ERROR } from "../src/load";
import { DEFAULT_SPEC_CASE_FOLDER } from "./spec_constants";
import { expect } from "chai";
import fs from "node:fs";
import path from "path";

export function toJsonString(o: Object): string {
  return JSON.stringify(o, null, 2);
}

export function toSpecCasePath(specCaseName: string): string {
  return path.join("test/spec", specCaseName);
}

export function runBasicLoadTest(
  specCaseName: string,
  workingDir: string = toSpecCasePath(
    path.join(specCaseName, DEFAULT_SPEC_CASE_FOLDER)
  ),
  elementPath: string = "model"
) {
  const specCasePath = toSpecCasePath(specCaseName);
  const expectedModel = JSON.parse(
    fs.readFileSync(path.resolve(specCasePath, "model.json"), "utf8")
  );
  const result = load(workingDir, elementPath);
  expect(result.success).to.equal(true);
  expect(result.message).to.equal(elementPath);
  expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
}

describe("Test basic load function", () => {
  it("shall return a LoadResult object where success is false, element is null, and message is a correct error message string, given an empty working directory path", () => {
    const result = load("", "");
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message).to.equal(EMPTY_WORKINGDIR_PATH_ERROR);
  });
  it("shall return a LoadResult object where success is false, element is null, and message is a correct error message string, given an empty working directory path and a non-empty element path", () => {
    const result = load("", "model");
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message).to.equal(EMPTY_WORKINGDIR_PATH_ERROR);
  });
  it("shall error when working directory does not exist with empty element path", () => {
    const result = load("test/spec/does_not_exist", "");
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall error when working directory does not exist with simple element path", () => {
    const result = load("test/spec/does_not_exist", "model");
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall error when working directory does not exist with complex element path", () => {
    const result = load("test/spec/does_not_exist", "model.address");
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall load object with simple data types", () => {
    runBasicLoadTest("1.1_object_with_simple_data_types");
  });
  it("shall load object with complex string", () => {
    runBasicLoadTest("1.2.1_object_with_complex_string");
  });
  it("shall load object with object of simple data types", () => {
    runBasicLoadTest("1.2.2_object_with_object_of_simple_data_types");
  });
  it("shall load object with object of complex data types", () => {
    runBasicLoadTest("1.2.3_object_with_object_of_complex_data_types");
  });
  it("shall load object with list of simple data type", () => {
    runBasicLoadTest("1.2.4_object_with_list_of_simple_data_type");
  });
  it("shall load object with list of simple data types", () => {
    runBasicLoadTest("1.2.5_object_with_list_of_simple_data_types");
  });
  it("shall load object with list of complex strings", () => {
    runBasicLoadTest("1.2.6_object_with_list_of_complex_strings");
  });
  it("shall load object with list of objects of simple data types", () => {
    runBasicLoadTest(
      "1.2.7.1_object_with_list_of_objects_of_simple_data_types"
    );
  });
  it("shall load object with list of list of simple data type", () => {
    runBasicLoadTest("1.2.7.2_object_with_list_of_list_of_simple_data_type");
  });
  it("shall load object with two complex strings", () => {
    runBasicLoadTest("1.3.1_object_with_two_complex_strings");
  });
  it("shall load object with two objects of simple data types", () => {
    runBasicLoadTest("1.3.2_object_with_two_objects_of_simple_data_types");
  });
  it("shall load object with two objects of complex data types", () => {
    runBasicLoadTest("1.3.3_object_with_two_objects_of_complex_data_types");
  });
  it("shall load object with two lists of simple data type", () => {
    runBasicLoadTest("1.3.4_object_with_two_lists_of_simple_data_type");
  });
  it("shall load object with two lists of simple data types", () => {
    runBasicLoadTest("1.3.5_object_with_two_lists_of_simple_data_types");
  });
  it("shall load object with two lists of complex strings", () => {
    runBasicLoadTest("1.3.6_object_with_two_lists_of_complex_strings");
  });
  it("shall load object with two lists of objects of simple data types", () => {
    runBasicLoadTest(
      "1.3.7.1_object_with_two_lists_of_objects_of_simple_data_types"
    );
  });
  it("shall load object with two lists of list of simple data type", () => {
    runBasicLoadTest(
      "1.3.7.2_object_with_two_lists_of_list_of_simple_data_type"
    );
  });
  it("shall load object with empty object", () => {
    runBasicLoadTest("1.4.1_object_with_empty_object");
  });
  it("shall load object with empty list", () => {
    runBasicLoadTest("1.4.2_object_with_empty_list");
  });
  it("shall load list of simple data types", () => {
    runBasicLoadTest("2.1_list_of_simple_data_types");
  });
  it("shall load list of complex string", () => {
    runBasicLoadTest("2.2.1_list_of_complex_string");
  });
  it("shall load list of objects of simple data types", () => {
    runBasicLoadTest("2.2.2_list_of_objects_of_simple_data_types");
  });
  it("shall load list of objects of complex data types", () => {
    runBasicLoadTest("2.2.3_list_of_objects_of_complex_data_types");
  });
  it("shall load list of list of simple data type", () => {
    runBasicLoadTest("2.2.4_list_of_list_of_simple_data_type");
  });
  it("shall load list of list of simple data types", () => {
    runBasicLoadTest("2.2.5_list_of_list_of_simple_data_types");
  });
  it("shall load list of list of complex strings", () => {
    runBasicLoadTest("2.2.6_list_of_list_of_complex_strings");
  });
  it("shall load list of list of objects of simple data types", () => {
    runBasicLoadTest("2.2.7.1_list_of_list_of_objects_of_simple_data_types");
  });
  it("shall load list of list of of list simple data type", () => {
    runBasicLoadTest("2.2.7.2_list_of_list_of_list_of_simple_data_type");
  });
  it("shall load list with empty object", () => {
    runBasicLoadTest("2.3.1_list_with_empty_object");
  });
  it("shall load list with empty list", () => {
    runBasicLoadTest("2.3.2_list_with_empty_list");
  });
  it("shall load legacy project", () => {
    runBasicLoadTest("3.1_legacy_project");
  });
});

describe("Test load function support for elementPath", () => {
  it("shall load object for empty element path", () => {
    const specCasePath = toSpecCasePath(
      "1.1_object_with_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const elementPath = "";
    const workingDir = path.join(specCasePath, "model");
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall return error for non-object at empty element path", () => {
    const specCasePath = toSpecCasePath(
      "2.1_list_of_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const workingDir = path.join(specCasePath);
    const elementPath = "";
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall return error for simple element path when working directory is not an object", () => {
    const workingDir = path.join("test/spec/2.1_list_of_simple_data_types");
    const elementPath = "address";
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall return error for complex element path when first element is invalid", () => {
    const workingDir = path.join("test/spec/1.1_object_with_simple_data_types");
    const elementPath = "mode.name";
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall return error for complex element path when later element is invalid", () => {
    const workingDir = path.join("test/spec/1.1_object_with_simple_data_types");
    const elementPath = "model.nam";
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall return error for complex element path when later element is name of a typescript property", () => {
    const workingDir = path.join("test/spec/1.1_object_with_simple_data_types");
    const elementPath = "model.toString";
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall load object for simple element path to object", () => {
    const specCasePath = toSpecCasePath(
      "1.1_object_with_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const workingDir = path.join(specCasePath, "..");
    const elementPath = "model";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "model.json"), "utf8")
    );
    const result = load(specCasePath, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load list for simple element path to list", () => {
    const specCasePath = toSpecCasePath("2.1_list_of_simple_data_types");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load complex string for simple element path to complex string", () => {
    const specCasePath = toSpecCasePath("1.2.1_object_with_complex_string");
    const elementPath = "lyrics_txt";
    const workingDir = path.join(
      specCasePath,
      DEFAULT_SPEC_CASE_FOLDER,
      "model"
    );
    const expectedElement = fs.readFileSync(
      path.resolve(workingDir, "lyrics.txt"),
      "utf8"
    );
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(result.element).to.equal(expectedElement);
  });
  it("shall load simple value for simple element path to simple value", () => {
    const specCasePath = toSpecCasePath(
      "1.1_object_with_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const elementPaths = [
      "name",
      "age",
      "attending",
      "plusOne",
      "state",
      "notes",
    ];
    const workingDir = path.join(specCasePath, "model");
    for (const elementPath of elementPaths) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(result.element).to.equal(expectedElement);
    }
    const elementPathsToEmptyComplex = ["degrees", "aliases"];
    for (const elementPath of elementPathsToEmptyComplex) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(toJsonString(result.element)).to.equal(
        toJsonString(expectedElement)
      );
    }
  });
  it("shall load object for object property element path to object", () => {
    const specCasePath = toSpecCasePath(
      "1.2.2_object_with_object_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.address";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["address"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load object for object property element path using [] notation to object", () => {
    const specCasePath = toSpecCasePath(
      "1.2.2_object_with_object_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[address]";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["address"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load list for object property element path to list", () => {
    const specCasePath = toSpecCasePath(
      "1.2.5_object_with_list_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.personInfo";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["personInfo"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load complex string for object property element path to complex string", () => {
    const specCasePath = toSpecCasePath("1.2.1_object_with_complex_string");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.lyrics_txt";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["lyrics_txt"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load simple value for object property element path to simple value", () => {
    const specCasePath = toSpecCasePath("1.1_object_with_simple_data_types");
    const elementPaths = [
      "name",
      "age",
      "attending",
      "plusOne",
      "state",
      "notes",
    ];
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    for (const elementPath of elementPaths) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, "model." + elementPath);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal("model." + elementPath);
      expect(result.element).to.equal(expectedElement);
    }
    const elementPathsToEmptyComplex = ["degrees", "aliases"];
    for (const elementPath of elementPathsToEmptyComplex) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, "model." + elementPath);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal("model." + elementPath);
      expect(toJsonString(result.element)).to.equal(
        toJsonString(expectedElement)
      );
    }
  });
  it("shall load object for list item of an object property element path to object", () => {
    const specCasePath = toSpecCasePath(
      "1.2.7.1_object_with_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.avengers[1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["avengers"][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load list for list item of an object property element path to list", () => {
    const specCasePath = toSpecCasePath(
      "1.2.7.2_object_with_list_of_list_of_simple_data_type"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.matrix[1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["matrix"][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load complex string for list item of an object property element path to complex string", () => {
    const specCasePath = toSpecCasePath(
      "1.2.6_object_with_list_of_complex_strings"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.verses_txt[1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["verses_txt"][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load simple value for list item of an object property element path to simple value", () => {
    const specCasePath = toSpecCasePath(
      "1.2.5_object_with_list_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model.personInfo[1]";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )["personInfo"][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load object for list item element path to object", () => {
    const specCasePath = toSpecCasePath(
      "2.2.2_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0]";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall error for missing [ in element path", () => {
    const specCasePath = toSpecCasePath(
      "2.2.2_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model0]";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall error for missing ] in element path", () => {
    const specCasePath = toSpecCasePath(
      "2.2.2_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0";
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(false);
    expect(result.element).to.equal(null);
    expect(result.message)
      .to.be.a("string")
      .and.satisfy((msg) => msg.startsWith(INVALID_PATH_ERROR));
  });
  it("shall load list for list item element path to list", () => {
    const specCasePath = toSpecCasePath(
      "2.2.7.2_list_of_list_of_list_of_simple_data_type"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load complex string for list item element path to complex string", () => {
    const specCasePath = toSpecCasePath(
      "2.2.6_list_of_list_of_complex_strings"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load simple value for list item element path to simple value", () => {
    const specCasePath = toSpecCasePath("2.1_list_of_simple_data_types");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load object for object property of a list item element path to object", () => {
    const specCasePath = toSpecCasePath(
      "2.2.3_list_of_objects_of_complex_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1].personInfo";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1]["personInfo"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load list for object property of a list item element path to list", () => {
    const specCasePath = toSpecCasePath(
      "2.2.3_list_of_objects_of_complex_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1].primeNumbers";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1]["primeNumbers"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load complex string for object property of a list item element path to complex string", () => {
    const specCasePath = toSpecCasePath(
      "2.2.3_list_of_objects_of_complex_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1].lyrics_txt";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1]["lyrics_txt"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load simple value for object property of a list item element path to simple value", () => {
    const specCasePath = toSpecCasePath(
      "2.2.2_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1].name";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1]["name"];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load object for list item of a list item element path to object", () => {
    const specCasePath = toSpecCasePath(
      "2.2.7.1_list_of_list_of_objects_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load list for list item of a list item element path to list", () => {
    const specCasePath = toSpecCasePath(
      "2.2.7.2_list_of_list_of_list_of_simple_data_type"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[1][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[1][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load complex string for list item of a list item element path to complex string", () => {
    const specCasePath = toSpecCasePath(
      "2.2.6_list_of_list_of_complex_strings"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
  it("shall load simple value for list item of a list item element path to simple value", () => {
    const specCasePath = toSpecCasePath(
      "2.2.5_list_of_list_of_simple_data_types"
    );
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model[0][1]";
    const expectedElement = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    )[0][1];
    const result = load(workingDir, elementPath);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(
      toJsonString(expectedElement)
    );
  });
});

describe("Test load function support for depth", () => {
  it("shall load object for depth = 0", () => {
    const specCasePath = toSpecCasePath("3.1_legacy_project/");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const depth = 0;
    const expectedModel = JSON.parse(
      fs.readFileSync(
        path.resolve(workingDir, "..", "model_depth_0.json"),
        "utf8"
      )
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load object for depth = 1", () => {
    const specCasePath = toSpecCasePath("3.1_legacy_project/");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const depth = 1;
    const expectedModel = JSON.parse(
      fs.readFileSync(
        path.resolve(workingDir, "..", "model_depth_1.json"),
        "utf8"
      )
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load object for depth = 2", () => {
    const specCasePath = toSpecCasePath("3.1_legacy_project");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const depth = 2;
    const expectedModel = JSON.parse(
      fs.readFileSync(
        path.resolve(workingDir, "..", "model_depth_2.json"),
        "utf8"
      )
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load object for depth = 3", () => {
    const specCasePath = toSpecCasePath("3.1_legacy_project");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const depth = 3;
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load full object without error for depth > object's greatest depth", () => {
    const specCasePath = toSpecCasePath("3.1_legacy_project");
    const workingDir = path.join(specCasePath, DEFAULT_SPEC_CASE_FOLDER);
    const elementPath = "model";
    const depth = 10;
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load list for depth = 0", () => {
    const workingDir =
      "test/spec/2.2.3_list_of_objects_of_complex_data_types/" +
      DEFAULT_SPEC_CASE_FOLDER;
    const elementPath = "model";
    const depth = 0;
    const expectedModel = JSON.parse(
      fs.readFileSync(
        path.resolve(workingDir, "..", "model_depth_0.json"),
        "utf8"
      )
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load list for depth = 1", () => {
    const workingDir =
      "test/spec/2.2.3_list_of_objects_of_complex_data_types/" +
      DEFAULT_SPEC_CASE_FOLDER;
    const elementPath = "model";
    const depth = 1;
    const expectedModel = JSON.parse(
      fs.readFileSync(
        path.resolve(workingDir, "..", "model_depth_1.json"),
        "utf8"
      )
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load list for depth = 2", () => {
    const workingDir =
      "test/spec/2.2.3_list_of_objects_of_complex_data_types/" +
      DEFAULT_SPEC_CASE_FOLDER;
    const elementPath = "model";
    const depth = 2;
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load full list without error for depth > list's greatest depth", () => {
    const workingDir =
      "test/spec/2.2.3_list_of_objects_of_complex_data_types/" +
      DEFAULT_SPEC_CASE_FOLDER;
    const elementPath = "model";
    const depth = 10;
    const expectedModel = JSON.parse(
      fs.readFileSync(path.resolve(workingDir, "..", "model.json"), "utf8")
    );
    const result = load(workingDir, elementPath, depth);
    expect(result.success).to.equal(true);
    expect(result.message).to.equal(elementPath);
    expect(toJsonString(result.element)).to.equal(toJsonString(expectedModel));
  });
  it("shall load simple value for depth = 0", () => {
    const specCasePath = toSpecCasePath(
      "1.1_object_with_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const elementPaths = [
      "name",
      "age",
      "attending",
      "plusOne",
      "state",
      "notes",
    ];
    const depth = 0;
    const workingDir = path.join(specCasePath, "model");
    for (const elementPath of elementPaths) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath, depth);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(result.element).to.equal(expectedElement);
    }
    const elementPathsToEmptyComplex = ["degrees", "aliases"];
    for (const elementPath of elementPathsToEmptyComplex) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath, depth);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(toJsonString(result.element)).to.equal(
        toJsonString(expectedElement)
      );
    }
  });
  it("shall load simple value for depth = 1", () => {
    const specCasePath = toSpecCasePath(
      "1.1_object_with_simple_data_types/" + DEFAULT_SPEC_CASE_FOLDER
    );
    const elementPaths = [
      "name",
      "age",
      "attending",
      "plusOne",
      "state",
      "notes",
    ];
    const depth = 1;
    const workingDir = path.join(specCasePath, "model");
    for (const elementPath of elementPaths) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath, depth);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(result.element).to.equal(expectedElement);
    }
    const elementPathsToEmptyComplex = ["degrees", "aliases"];
    for (const elementPath of elementPathsToEmptyComplex) {
      const expectedElement = JSON.parse(
        fs.readFileSync(path.resolve(specCasePath, "..", "model.json"), "utf8")
      )[elementPath];
      const result = load(workingDir, elementPath, depth);
      expect(result.success).to.equal(true);
      expect(result.message).to.equal(elementPath);
      expect(toJsonString(result.element)).to.equal(
        toJsonString(expectedElement)
      );
    }
  });
});
