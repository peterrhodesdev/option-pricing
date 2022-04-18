import { Option } from "../../src/Option";
import { price } from "../../src/pricing-models/CoxRossRubinstein";

test("American call: Hull (2014), Section 13.11, Figure 13.12, page 314", async () => {
  const option = new Option(
    "american",
    "call",
    0.61,
    0.6,
    0.25,
    0.12,
    0.05,
    0.07
  );
  const actual = await price(option, 3);
  expect(actual).toBeCloseTo(0.019, 3);
});

test("American put: Hull SSM (2014), Problem 13.17, page 142", async () => {
  const option = new Option(
    "american",
    "put",
    1500,
    1480,
    1,
    0.18,
    0.04,
    0.025
  );
  const actual = await price(option, 2);
  expect(actual).toBeCloseTo(78.41, 2);
});

test("European call: Hull (2014), Section 13.11, Figure 13.11, page 313", async () => {
  const option = new Option("european", "call", 810, 800, 0.5, 0.2, 0.05, 0.02);
  const actual = await price(option, 2);
  expect(actual).toBeCloseTo(53.39, 2);
});

test("European put: Hull SSM (2014), Problem 13.19, page 144", async () => {
  const option = new Option("european", "put", 140, 150, 0.5, 0.25, 0.04, 0);
  const actual = await price(option, 2);
  expect(actual).toBeCloseTo(14.58, 2);
});
