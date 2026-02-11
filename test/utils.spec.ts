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


// TODO: test to replace single underscores with dots
describe("Test complex string key name to file name mapping function", () => {
  it("shall ignore leading underscore", () => {
    const keyName = "_3mTape";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore trailing underscore", () => {
    const keyName = "3mTape_";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore leading underscores", () => {
    const keyName = "__3mTape";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore trailing underscores", () => {
    const keyName = "3mTape__";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore leading and trailing underscore when both are present", () => {
    const keyName = "_3mTape_";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore leading and trailing underscores when both are present", () => {
    const keyName = "__3mTape__";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall ignore non-single underscores", () => {
    const keyName = "3m__Tape";
    const expectedFileName = keyName;
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
  it("shall replace single underscores with dots", () => {
    //TODO
    const keyName = "_my__View_md_njk_";
    const expectedFileName = "_my__View.md.njk_";
    const fileName = complexStringKeyToFileName(keyName);

    expect(fileName).to.equal(expectedFileName);
  });
});

// TODO: test fileNameToComplexStringKey(complexStringKeyToFileName('_3mTape_md')) === '_3mTape_md'
// TODO: test complexStringKeyToFileName(fileNameToComplexStringKey('_3mTape.md')) === '_3mTape.md'
// TODO: 5 or so test cases of one-to-one and onto mapping
describe("Test one-to-one and onto mapping", () => {
  it("shall map keyName to keyName", () => {
    const keyName = '3mTape_md';
    const result = fileNameToComplexStringKey(complexStringKeyToFileName(keyName))

    expect(result).to.equal(keyName);
  });
  it("shall map fileName to fileName", () => {
    const fileName = '3mTape.md';
    const result = complexStringKeyToFileName(fileNameToComplexStringKey(fileName))

    expect(result).to.equal(fileName);
  });
  it("shall map keyName to keyName with leading and muliple underscores", () => {
    const keyName = '_3m__tape_md';
    const result = fileNameToComplexStringKey(complexStringKeyToFileName(keyName))

    expect(result).to.equal(keyName);
  });
  it("shall map fileName to fileName with leading and multiple underscores", () => {
    const fileName = '_3m__tape.md';
    const result = complexStringKeyToFileName(fileNameToComplexStringKey(fileName))

    expect(result).to.equal(fileName);
  });
  it("shall map keyName to keyName with multiple single underscores", () => {
    const keyName = 'myView_md_njk';
    const result = fileNameToComplexStringKey(complexStringKeyToFileName(keyName))

    expect(result).to.equal(keyName);
  });
  it("shall map fileName to fileName with multiple single underscores", () => {
    const fileName = 'myView.md.njk';
    const result = complexStringKeyToFileName(fileNameToComplexStringKey(fileName))

    expect(result).to.equal(fileName);
  });
});
