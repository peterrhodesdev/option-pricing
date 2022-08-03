import { Option } from "../../src/Option";

const PRICING_METHOD_CRR = "crr";

describe("check arguments", () => {
  test("null parameters", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 810,
      strikePrice: 800,
      timeToMaturity: 0.5,
      volatility: 0.2,
      riskFreeRate: 0.05,
      dividendYield: 0.02,
    });
    expect(() => option.price(PRICING_METHOD_CRR)).toThrow();
  });

  test("timeSteps not defined", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 810,
      strikePrice: 800,
      timeToMaturity: 0.5,
      volatility: 0.2,
      riskFreeRate: 0.05,
      dividendYield: 0.02,
    });
    expect(() => option.price(PRICING_METHOD_CRR, {})).toThrow();
  });

  test("time steps not greater than zero", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 810,
      strikePrice: 800,
      timeToMaturity: 0.5,
      volatility: 0.2,
      riskFreeRate: 0.05,
      dividendYield: 0.02,
    });
    expect(() => option.price(PRICING_METHOD_CRR, { timeSteps: 0 })).toThrow();
  });
});

test("American call: Hull (2014), Section 13.11, Figure 13.12, page 314", () => {
  const option = new Option({
    style: "american",
    type: "call",
    initialSpotPrice: 0.61,
    strikePrice: 0.6,
    timeToMaturity: 0.25,
    volatility: 0.12,
    riskFreeRate: 0.05,
    dividendYield: 0.07,
  });
  const actual = option.price(PRICING_METHOD_CRR, { timeSteps: 3 });
  expect(actual).toBeCloseTo(0.019, 3);
});

test("American put: Hull SSM (2014), Problem 13.17, page 142", () => {
  const option = new Option({
    style: "american",
    type: "put",
    initialSpotPrice: 1500,
    strikePrice: 1480,
    timeToMaturity: 1,
    volatility: 0.18,
    riskFreeRate: 0.04,
    dividendYield: 0.025,
  });
  const actual = option.price(PRICING_METHOD_CRR, { timeSteps: 2 });
  expect(actual).toBeCloseTo(78.41, 2);
});

test("European call: Hull (2014), Section 13.11, Figure 13.11, page 313", () => {
  const option = new Option({
    style: "european",
    type: "call",
    initialSpotPrice: 810,
    strikePrice: 800,
    timeToMaturity: 0.5,
    volatility: 0.2,
    riskFreeRate: 0.05,
    dividendYield: 0.02,
  });
  const actual = option.price(PRICING_METHOD_CRR, { timeSteps: 2 });
  expect(actual).toBeCloseTo(53.39, 2);
});

test("European put: Hull SSM (2014), Problem 13.19, page 144", () => {
  const option = new Option({
    style: "european",
    type: "put",
    initialSpotPrice: 140,
    strikePrice: 150,
    timeToMaturity: 0.5,
    volatility: 0.25,
    riskFreeRate: 0.04,
    dividendYield: 0,
  });
  const actual = option.price(PRICING_METHOD_CRR, { timeSteps: 2 });
  expect(actual).toBeCloseTo(14.58, 2);
});
