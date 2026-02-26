import { uniformints, resetRNG } from "../src/idgen";
import { generateIDs } from "../src/index";
import { expect } from "chai";

const firstD6RollResults = [5];
const firstDrawHexResults = [14, 1, 6, 15, 4, 15];
const secondDrawHexResults = [5, 0, 6, 14, 5, 9];
const thirdDrawHexResults = [10, 2, 8, 8, 3, 6];
const expected10Skip0Results = [
  "E16F4F",
  "506E59",
  "A28836",
  "4B0D2F",
  "7A1D77",
  "B008AA",
  "058F13",
  "CE5CEF",
  "409FD4",
  "FE0F6F",
];

describe("Test Uniform Ints", () => {
  it("shall return an array, firstDrawHexResults, for lBound == 0, uBound == 15, and numInts == 6", () => {
    resetRNG();
    const result = uniformints(0, 15, 6);
    expect(result.toString()).to.equal(firstDrawHexResults.toString());
  });
  it("shall return expected arrays for 3 draws with lBound == 0, uBound == 15, and numInts == 6", () => {
    resetRNG();
    const firstResult = uniformints(0, 15, 6);
    const secondResult = uniformints(0, 15, 6);
    const thirdResult = uniformints(0, 15, 6);
    expect(firstResult.toString()).to.equal(firstDrawHexResults.toString());
    expect(secondResult.toString()).to.equal(secondDrawHexResults.toString());
    expect(thirdResult.toString()).to.equal(thirdDrawHexResults.toString());
  });
  it("shall return expected arrays for 4 draws with lBound == 0, uBound == 15, and numInts == 6 with 4th result matching first result after resetting RNG after 3rd result", () => {
    resetRNG();
    const firstResult = uniformints(0, 15, 6);
    const secondResult = uniformints(0, 15, 6);
    const thirdResult = uniformints(0, 15, 6);
    resetRNG();
    const fourthResult = uniformints(0, 15, 6);
    expect(firstResult.toString()).to.equal(firstDrawHexResults.toString());
    expect(secondResult.toString()).to.equal(secondDrawHexResults.toString());
    expect(thirdResult.toString()).to.equal(thirdDrawHexResults.toString());
    expect(fourthResult.toString()).to.equal(firstDrawHexResults.toString());
  });
  it("shall return an array, firstDrawHexResults, for lBound == 0, uBound == 15, and numInts == 6", () => {
    resetRNG();
    const result = uniformints(0, 15, 6);
    expect(result.toString()).to.equal(firstDrawHexResults.toString());
  });
  it("shall return an array, firstD6RollResults, if lBound == 1, uBound == 6, and numInts == 1", () => {
    resetRNG();
    const result = uniformints(1, 6, 1);
    expect(result.toString()).to.equal(firstD6RollResults.toString());
  });
  it("shall return an empty array if lBound is not an integer", () => {
    const result = uniformints(3.14, 5, 1);
    expect(result.length).to.equal(0);
  });
  it("shall return an empty array if uBound is not an integer", () => {
    const result = uniformints(1, 3.14, 1);
    expect(result.length).to.equal(0);
  });
  it("shall return an empty array if numInts is not an integer", () => {
    const result = uniformints(1, 3, 3.14);
    expect(result.length).to.equal(0);
  });
  it("shall return an empty array if numInts is less than 1", () => {
    const result = uniformints(1, 3, 0);
    expect(result.length).to.equal(0);
  });
  it("shall return an empty array if lBound and uBound are not integers", () => {
    const result = uniformints(3.14, 6.28, 1);
    expect(result.length).to.equal(0);
  });
  it("shall return an empty array if uBound is less than lBound", () => {
    const result = uniformints(6, 3, 1);
    expect(result.length).to.equal(0);
  });
});

describe("Test Short ID Generation", () => {
  it("shall return empty array if numIDs is not an integer", () => {
    const result = generateIDs(3.14, 0);
    expect(result.toString()).to.equal("");
  });
  it("shall return empty array if numSkip is not an integer", () => {
    const result = generateIDs(6, 3.14);
    expect(result.toString()).to.equal("");
  });
  it("shall return empty array if numIDS and numSkip is not an integer", () => {
    const result = generateIDs(6.28, 3.14);
    expect(result.toString()).to.equal("");
  });
  it("shall return empty array if numIDs is less than 1", () => {
    const result = generateIDs(0, 0);
    expect(result.toString()).to.equal("");
  });
  it("shall return empty array if numSkip is less than 0", () => {
    const result = generateIDs(6, -1);
    expect(result.toString()).to.equal("");
  });
  it("shall return expected array", () => {
    const result = generateIDs(10, 0);
    expect(result.toString()).to.equal(expected10Skip0Results.toString());
  });
  it("shall return expected array for skip 5", () => {
    const numSkip = 4;
    const result = generateIDs(6, numSkip);
    expect(result.toString()).to.equal(
      expected10Skip0Results.slice(numSkip).toString()
    );
  });
  it("shall return expected array when called twice", () => {
    const result1 = generateIDs(10, 0);
    const result2 = generateIDs(10, 0);
    expect(result1.toString()).to.equal(expected10Skip0Results.toString());
    expect(result2.toString()).to.equal(expected10Skip0Results.toString());
  });
  it("shall return expected array for skip 5 when called twice", () => {
    const numSkip = 4;
    const result1 = generateIDs(6, numSkip);
    const result2 = generateIDs(6, numSkip);
    expect(result1.toString()).to.equal(
      expected10Skip0Results.slice(numSkip).toString()
    );
    expect(result2.toString()).to.equal(
      expected10Skip0Results.slice(numSkip).toString()
    );
  });
});
