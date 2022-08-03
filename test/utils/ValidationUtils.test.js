import {
  isValidStyle,
  isValidType,
  isNumberGreaterThanZero,
} from "../../src/utils/ValidationUtils";

test("check if a style is valid", () => {
  expect(isValidStyle(undefined)).toBe(false);
  expect(isValidStyle(null)).toBe(false);
  expect(isValidStyle("")).toBe(false);
  expect(isValidStyle("INVALID_STYLE")).toBe(false);
  expect(isValidStyle("american")).toBe(true);
  expect(isValidStyle("european")).toBe(true);
});

test("check if a type is valid", () => {
  expect(isValidType(undefined)).toBe(false);
  expect(isValidType(null)).toBe(false);
  expect(isValidType("")).toBe(false);
  expect(isValidType("INVALID_TYPE")).toBe(false);
  expect(isValidType("call")).toBe(true);
  expect(isValidType("put")).toBe(true);
});

test("check if a value is a number that is greater than zero", () => {
  expect(isNumberGreaterThanZero(undefined)).toBe(false);
  expect(isNumberGreaterThanZero(null)).toBe(false);
  expect(isNumberGreaterThanZero(NaN)).toBe(false);
  expect(isNumberGreaterThanZero(-Infinity)).toBe(false);
  expect(isNumberGreaterThanZero(Infinity)).toBe(false);
  expect(isNumberGreaterThanZero(-100)).toBe(false);
  expect(isNumberGreaterThanZero(0)).toBe(false);
  expect(isNumberGreaterThanZero(100)).toBe(true);
});
