import { Option } from "../src/Option";

describe("check arguments", () => {
  test("valid style and type combinations", () => {
    expect(
      () =>
        new Option({
          style: "european",
          type: "call",
          initialSpotPrice: 100,
          strikePrice: 100,
          timeToMaturity: 1,
          volatility: 0.25,
        })
    ).not.toThrow();
    expect(
      () =>
        new Option({
          style: "european",
          type: "put",
          initialSpotPrice: 100,
          strikePrice: 100,
          timeToMaturity: 1,
          volatility: 0.25,
          riskFreeRate: 0.1,
        })
    ).not.toThrow();
    expect(
      () =>
        new Option({
          style: "american",
          type: "call",
          initialSpotPrice: 100,
          strikePrice: 100,
          timeToMaturity: 1,
          volatility: 0.25,
          dividendYield: 0.05,
        })
    ).not.toThrow();
    expect(
      () =>
        new Option({
          style: "american",
          type: "put",
          initialSpotPrice: 100,
          strikePrice: 100,
          timeToMaturity: 1,
          volatility: 0.25,
          riskFreeRate: 0.1,
          dividendYield: 0.05,
        })
    ).not.toThrow();
  });

  test("initial spot price is a number greater than zero", () => {
    const options = {
      style: "european",
      type: "call",
      strikePrice: 100,
      timeToMaturity: 1,
      volatility: 0.25,
      riskFreeRate: 0.1,
      dividendYield: 0.05,
    };
    expect(
      () => new Option({ ...options, initialSpotPrice: undefined })
    ).toThrow();
    expect(() => new Option({ ...options, initialSpotPrice: null })).toThrow();
    expect(() => new Option({ ...options, initialSpotPrice: NaN })).toThrow();
    expect(
      () => new Option({ ...options, initialSpotPrice: -Infinity })
    ).toThrow();
    expect(
      () => new Option({ ...options, initialSpotPrice: Infinity })
    ).toThrow();
    expect(() => new Option({ ...options, initialSpotPrice: -100 })).toThrow();
    expect(() => new Option({ ...options, initialSpotPrice: 0 })).toThrow();
    expect(
      () => new Option({ ...options, initialSpotPrice: 100 })
    ).not.toThrow();
  });
});
