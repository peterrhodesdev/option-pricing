import { createFilledMatrix, ones, zeros } from "../../src/utils/MatrixUtils";

describe("create filled matrix", () => {
  test("create an MxN matrix filled with a number", () => {
    const M = 2;
    const N = 3;
    const fillValue = 999;
    const actual = createFilledMatrix(M, N, fillValue);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) =>
      row.forEach((col) => expect(col).toEqual(fillValue))
    );
  });

  test("create an MxN matrix filled with a string", () => {
    const M = 2;
    const N = 3;
    const fillValue = "string";
    const actual = createFilledMatrix(M, N, fillValue);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) =>
      row.forEach((col) => expect(col).toEqual(fillValue))
    );
  });

  test("create an MxN matrix filled with an array", () => {
    const M = 2;
    const N = 3;
    const fillValue = [0];
    const actual = createFilledMatrix(M, N, fillValue);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) =>
      row.forEach((col) => expect(col).toEqual(fillValue))
    );
    // Check the fill value was copied by value and not reference
    actual[0][0][0] = 1;
    expect(actual[0][1][0]).toEqual(0);
  });

  test("create an MxN matrix filled with an array", () => {
    const M = 2;
    const N = 3;
    const fillValue = { field1: 999, field2: "string" };
    const actual = createFilledMatrix(M, N, fillValue);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) =>
      row.forEach((col) => expect(col).toEqual(fillValue))
    );
    // Check the fill value was copied by value and not reference
    actual[0][0].field1 = -1;
    expect(actual[0][1].field1).toEqual(999);
  });
});

describe("zeros", () => {
  test("create an MxN matrix filled with zeros", () => {
    const M = 2;
    const N = 3;
    const actual = zeros(M, N);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) => row.forEach((col) => expect(col).toEqual(0)));
  });
});

describe("ones", () => {
  test("create an MxN matrix filled with ones", () => {
    const M = 2;
    const N = 3;
    const actual = ones(M, N);
    expect(actual).toHaveLength(M);
    actual.forEach((row) => expect(row).toHaveLength(N));
    actual.forEach((row) => row.forEach((col) => expect(col).toEqual(1)));
  });
});
