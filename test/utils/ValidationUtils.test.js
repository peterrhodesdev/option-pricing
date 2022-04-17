import { isNumberGreaterThanZero } from "../../src/utils/ValidationUtils";

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
