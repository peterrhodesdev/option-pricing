import {
  quadraticRegression,
  standardNormalCdf,
} from "../../src/utils/MathUtils";

describe("Standard normal CDF", () => {
  // https://en.wikipedia.org/wiki/Standard_normal_table#Cumulative_from_minus_infinity_to_Z
  it("matches the table of values on wikipedia", () => {
    const values = [
      { z: -4.0, result: 0.00003 },
      { z: -3.0, result: 0.00135 },
      { z: -2.0, result: 0.02275 },
      { z: -1.0, result: 0.15866 },
      { z: 0.0, result: 0.5 },
      { z: 1.0, result: 0.84134 },
      { z: 2.0, result: 0.97725 },
      { z: 3.0, result: 0.99865 },
      { z: 4.0, result: 0.99997 },
    ];
    const decimalPlaces = 5;

    values.forEach((value) => {
      expect(standardNormalCdf(value.z)).toBeCloseTo(
        value.result,
        decimalPlaces
      );
    });
  });
});

describe("quadratic regression", () => {
  // https://www.cs.odu.edu/~tkennedy/cs417/f19/Public/approximationExample2/index.html
  test("example 1", () => {
    const x = [0, 1, 2];
    const y = [0, 1, 4];
    const actual = quadraticRegression(x, y);
    expect(actual).toHaveLength(3);
    expect(actual[0]).toBeCloseTo(0, 0);
    expect(actual[1]).toBeCloseTo(0, 0);
    expect(actual[2]).toBeCloseTo(1, 0);
  });

  // https://math.stackexchange.com/a/1638456
  test("example 2", () => {
    const x = [1.08, 1.07, 0.97, 0.77, 0.84];
    const y = [0, 0.0659232, 0.169517, 0.188352, 0.0847584];
    const actual = quadraticRegression(x, y);
    expect(actual).toHaveLength(3);
    // expect(actual[0]).toBeCloseTo(-1.06998, 5); // rounding error
    expect(actual[0]).toBeCloseTo(-1.06999, 5);
    expect(actual[1]).toBeCloseTo(2.9834, 4);
    expect(actual[2]).toBeCloseTo(-1.81357, 5);
  });

  // https://textbooks.math.gatech.edu/ila/least-squares.html
  test("example 3", () => {
    const x = [-1, 1, 2, 3];
    const y = [0.5, -1, -0.5, 2];
    const actual = quadraticRegression(x, y);
    expect(actual).toHaveLength(3);
    expect(actual[0]).toBeCloseTo(-41 / 44, 4);
    expect(actual[1]).toBeCloseTo(-379 / 440, 4);
    expect(actual[2]).toBeCloseTo(53 / 88, 4);
  });

  // https://www.uobabylon.edu.iq/eprints/publication_6_22943_553.pdf
  test("example 4", () => {
    const x = [0, 1, 2, 3, 4, 5];
    const y = [2.1, 7.7, 13.6, 27.2, 40.9, 61.1];
    const actual = quadraticRegression(x, y);
    expect(actual).toHaveLength(3);
    expect(actual[0]).toBeCloseTo(2.479, 3);
    expect(actual[1]).toBeCloseTo(2.359, 3);
    expect(actual[2]).toBeCloseTo(1.861, 3);
  });
});
