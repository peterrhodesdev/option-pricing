import { Option } from "../../src/Option";

describe("options with no known analytical solution", () => {
  test("American put option", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 100,
      timeToMaturity: 1,
      volatility: 0.25,
      riskFreeRate: 0,
      dividendYield: 0,
    });
    const actual = option.price("bsm");
    expect(actual).toBeUndefined();
  });

  test("American call option on a dividend paying stock", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 250,
      strikePrice: 250,
      timeToMaturity: 0.25,
      volatility: 0.18,
      riskFreeRate: 0.1,
      dividendYield: 0.03,
    });
    const actual = option.price("bsm");
    expect(actual).toBeUndefined();
  });
});

// References:
// Hull (2014): Hull, J. (2014) Options, Futures and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
// Hull SSM (2014): Hull, J. (2014) Student Solutions Manual for Options, Futures, and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.

describe("options with analytical solutions", () => {
  test("European call: Hull SSM (2014), Problem 15.13, page 166", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 52,
      strikePrice: 50,
      timeToMaturity: 0.25,
      volatility: 0.3,
      riskFreeRate: 0.12,
      dividendYield: 0,
    });
    const actual = option.price("bsm");
    expect(actual).toBeCloseTo(5.06, 2);
  });

  test("American call on a non-dividend paying stock", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 52,
      strikePrice: 50,
      timeToMaturity: 0.25,
      volatility: 0.3,
      riskFreeRate: 0.12,
      dividendYield: 0,
    });
    const actual = option.price("bsm");
    expect(actual).toBeCloseTo(5.06, 2);
  });

  test("European call with non-zero dividend yield: Hull SSM (2014), Problem 17.6, page 187", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 250,
      strikePrice: 250,
      timeToMaturity: 0.25,
      volatility: 0.18,
      riskFreeRate: 0.1,
      dividendYield: 0.03,
    });
    const actual = option.price("bsm");
    expect(actual).toBeCloseTo(11.15, 2);
  });

  test("European put: Hull (2014), Section 15.9, Example 15.6, page 360", () => {
    const option = new Option({
      style: "european",
      type: "put",
      initialSpotPrice: 42,
      strikePrice: 40,
      timeToMaturity: 0.5,
      volatility: 0.2,
      riskFreeRate: 0.1,
      dividendYield: 0,
    });
    const actual = option.price("bsm");
    expect(actual).toBeCloseTo(0.81, 2);
  });

  test("European put with non-zero dividend yield: Hull SSM (2014), Problem 17.7, page 187", () => {
    const option = new Option({
      style: "european",
      type: "put",
      initialSpotPrice: 0.52,
      strikePrice: 0.5,
      timeToMaturity: 0.6667,
      volatility: 0.12,
      riskFreeRate: 0.04,
      dividendYield: 0.08,
    });
    const actual = option.price("bsm");
    expect(actual).toBeCloseTo(0.0162, 4);
  });
});
