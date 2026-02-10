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

// TODO: test to ignore leading underscores
// TODO: test to ignore trailing underscores
// TODO: test to ignore leading and trailing underscores when both present
// TODO: test to ignore non-single underscores
// TODO: test to replace single underscores with dots
describe("Test complex string key name to file name mapping function", () => {
  it("should do a thing", () => {
    //TODO
  });
});

// TODO: test fileNameToComplexStringKey(complexStringKeyToFileName('_3mTape_md')) === '_3mTape_md'
// TODO: test complexStringKeyToFileName(fileNameToComplexStringKey('_3mTape.md')) === '_3mTape.md'
// TODO: 5 or so test cases of one-to-one and onto mapping
describe("Test one-to-one and onto mapping", () => {
  it("should do a thing", () => {
    //TODO
    //shall assert both mapping directions; fileNameToComplexStringKey() and complexStringKeyToFileName()
  });
});
