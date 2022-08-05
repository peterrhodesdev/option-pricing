import { Option } from "../../src/Option";
import { calculateExerciseValue } from "../../src/utils/OptionUtils";

describe("exercise value calculation: European call", () => {
  test("in-the-money at expiry", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 1);
    expect(actual).toEqual(5);
  });

  test("out-the-money at expiry", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 1);
    expect(actual).toEqual(0);
  });

  test("in-the-money before expiry", () => {
    const option = new Option({
      style: "european",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 0.5);
    expect(actual).toEqual(0);
  });
});

describe("exercise value calculation: European put", () => {
  test("in-the-money at expiry", () => {
    const option = new Option({
      style: "european",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 1);
    expect(actual).toEqual(5);
  });

  test("out-the-money at expiry", () => {
    const option = new Option({
      style: "european",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 1);
    expect(actual).toEqual(0);
  });

  test("in-the-money before expiry", () => {
    const option = new Option({
      style: "european",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 0.5);
    expect(actual).toEqual(0);
  });
});

describe("exercise value calculation: American call", () => {
  test("in-the-money at expiry", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 1);
    expect(actual).toEqual(5);
  });

  test("out-the-money at expiry", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 1);
    expect(actual).toEqual(0);
  });

  test("in-the-money before expiry", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 0.5);
    expect(actual).toEqual(5);
  });

  test("out-the-money before expiry", () => {
    const option = new Option({
      style: "american",
      type: "call",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 0.5);
    expect(actual).toEqual(0);
  });
});

describe("exercise value calculation: American put", () => {
  test("in-the-money at expiry", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 1);
    expect(actual).toEqual(5);
  });

  test("out-the-money at expiry", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 1);
    expect(actual).toEqual(0);
  });

  test("in-the-money before expiry", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 105, 0.5);
    expect(actual).toEqual(5);
  });

  test("out-the-money before expiry", () => {
    const option = new Option({
      style: "american",
      type: "put",
      initialSpotPrice: 100,
      strikePrice: 110,
      timeToMaturity: 1,
      volatility: 0.25,
    });
    const actual = calculateExerciseValue(option, 115, 0.5);
    expect(actual).toEqual(0);
  });
});
