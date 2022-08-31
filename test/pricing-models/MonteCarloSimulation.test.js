import { Option } from "../../src/Option";

const PRICING_METHOD_MCS = "mcs";

test("Pseudorandom number generators, European call, price = 5.06", () => {
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
  const params = {
    simulations: 10000,
    prngSeed: "123",
    prngAdvancePast: 15,
  };
  const sfc32 = option.price(PRICING_METHOD_MCS, {
    ...params,
    prngName: "sfc32",
  });
  expect(sfc32).toBeCloseTo(5.07, 2);
  const mulberry32 = option.price(PRICING_METHOD_MCS, {
    ...params,
    prngName: "mulberry32",
  });
  expect(mulberry32).toBeCloseTo(5.01, 2);
  const xoshiro128ss = option.price(PRICING_METHOD_MCS, {
    ...params,
    prngName: "xoshiro128ss",
  });
  expect(xoshiro128ss).toBeCloseTo(5.02, 2);
  const jsf32 = option.price(PRICING_METHOD_MCS, {
    ...params,
    prngName: "jsf32",
  });
  expect(jsf32).toBeCloseTo(5.15, 2);
});

test("American put: Hull (2014), Section 27.8, The Least-Squares Approach, page 668", () => {
  const option = new Option({
    style: "american",
    type: "put",
    initialSpotPrice: 1, // overridden
    strikePrice: 1.1,
    timeToMaturity: 3,
    volatility: 0.1, // not given
    riskFreeRate: 0.06,
    dividendYield: 0,
  });
  // simulations = 8, time steps = 3
  const spotPriceMatrixOverride = [
    [1, 1.09, 1.08, 1.34],
    [1, 1.16, 1.26, 1.54],
    [1, 1.22, 1.07, 1.03],
    [1, 0.93, 0.97, 0.92],
    [1, 1.11, 1.56, 1.52],
    [1, 0.76, 0.77, 0.9],
    [1, 0.92, 0.84, 1.01],
    [1, 0.88, 1.22, 1.34],
  ];
  const actual = option.price(PRICING_METHOD_MCS, {
    spotPriceMatrixOverride,
  });
  expect(actual).toBeCloseTo(0.1144, 4);
});

/*
 * Values checked against the Python implementation at:
 * https://github.com/jpcolino/IPython_notebooks/blob/master/Least%20Square%20Monte%20Carlo%20Implementation%20in%20a%20Python%20Class.ipynb
 * - change the degree in `np.polyfit` to 2
 * - fix dividend yield not being applied (subtract from `self.r`)
 * - Python 2 to 3:
 *   - change `xrange` to `range`
 *   - add parentheses to `print` statements
 */
describe("Least-Square Monte Carlo for American Options in a Python Class", () => {
  test("American put, time steps = 3, simulations = 10, seed = 123", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 36, // overridden
      strikePrice: 40,
      timeToMaturity: 1,
      volatility: 0.2, // overridden
      riskFreeRate: 0.06,
      dividendYield: 0,
    });
    const spotPriceMatrixOverride = [
      [36.0, 32.18480502623097, 39.46914576340212, 36.983118790136864],
      [36.0, 40.93624286167312, 31.347682931072583, 31.422922366085412],
      [36.0, 37.69501336404151, 36.35510314218994, 43.76694083490719],
      [36.0, 30.658818589756493, 35.960869946052746, 33.851749663020094],
      [36.0, 34.125375924397225, 31.289796123894472, 30.125101301610016],
      [36.0, 41.35569323375276, 34.634557783520584, 37.96164535699372],
      [36.0, 32.5145843977571, 43.607574206186314, 44.67885015118809],
      [36.0, 35.31037144352519, 37.6012249026562, 32.07763697724575],
      [36.0, 43.414096976902584, 38.013441044654044, 41.47318982570703],
      [36.0, 39.00396368971172, 43.68824917222262, 46.60366203089627],
    ];
    const actual = option.price(PRICING_METHOD_MCS, {
      spotPriceMatrixOverride,
    });
    expect(actual).toBeCloseTo(5.434, 3);
  });

  test("American call, time steps = 3, simulations = 10, seed = 123", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 52, // overridden
      strikePrice: 50,
      timeToMaturity: 0.25,
      volatility: 0.3, // overridden
      riskFreeRate: 0.12,
      dividendYield: 0.08,
    });
    const spotPriceMatrixOverride = [
      [52.0, 47.31411587052554, 54.56598026417513, 51.42892124980213],
      [52.0, 56.667434666229454, 45.90740565946958, 45.51344348030177],
      [52.0, 53.26788989934684, 51.30417427721203, 58.35316403924439],
      [52.0, 45.621454675038784, 50.8863509017858, 48.127201152359326],
      [52.0, 49.43797236287657, 45.843811317705345, 44.09619866323759],
      [52.0, 57.1023584734861, 49.472163310070165, 52.446140759234936],
      [52.0, 47.67725275033307, 58.8030852108607, 59.262675743928334],
      [52.0, 50.72000431028779, 52.617494089606346, 46.22283105589175],
      [52.0, 59.220987680891184, 53.049531730297495, 56.04415753211748],
      [52.0, 54.64923976784239, 58.88465660272807, 61.167368724039065],
    ];
    const actual = option.price(PRICING_METHOD_MCS, {
      spotPriceMatrixOverride,
    });
    expect(actual).toBeCloseTo(5.283, 3);
  });
});
