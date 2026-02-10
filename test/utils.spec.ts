import { expect } from "chai";
import {
  complexStringKeyToFileName,
  fileNameToComplexStringKey,
} from "../src/utils";

describe("Test file name to complex string key name mapping function", () => {
  it("shall replace all dots with underscores", () => {
    const fileName = "myKey.md.njk";
    const expectedKeyName = "myKey_md_njk";
    const keyName = fileNameToComplexStringKey(fileName);

    expect(keyName).to.equal(expectedKeyName);
  });
  it("shall return original string when there are no dots in string", () => {
    const fileName = "myKeyFile";
    const expectedKeyName = fileName;
    const keyName = fileNameToComplexStringKey(fileName);

    expect(keyName).to.equal(expectedKeyName);
  });
});

describe("Test complex string key name to file name mapping function", () => {
  it("should do a thing", () => {
    //TODO
  });
});
