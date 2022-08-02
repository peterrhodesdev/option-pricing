import { isNumberGreaterThanZero } from "../utils/ValidationUtils.js";

function determineModelParameters(option, timeSteps) {
  const deltat = option.timeToMaturity / timeSteps;
  const u = Math.exp(option.volatility * Math.sqrt(deltat)); // proportional up movement
  const d = Math.exp(-option.volatility * Math.sqrt(deltat)); // proportional down movement
  const a = Math.exp((option.riskFreeRate - option.dividendYield) * deltat); // growth factor
  const p = (a - d) / (u - d); // probability of an up movement (probability of a down movement is 1 - p)
  return [deltat, u, d, p];
}

function createNode(initialSpotPrice, i, j, u, d) {
  return {
    i,
    j,
    spotPrice: initialSpotPrice * u ** j * d ** (i - j),
    value: 0,
  };
}

function calculateExerciseValue(option, spotPrice, time) {
  const isCall = option.type === "call" ? 1 : -1;

  switch (option.style) {
    case "european":
      return time < option.timeToMaturity
        ? 0
        : Math.max(0, isCall * (spotPrice - option.strikePrice));
    case "american":
      return Math.max(0, isCall * (spotPrice - option.strikePrice));
    default:
      throw new Error(`Invalid option style (${option.style})`);
  }
}

function calculateNodeOptionValue(option, timeSteps, nodes, i, j, deltat, p) {
  const nodeIndex = (i * (i + 1)) / 2 + j; // sum of numbers from 1 to i, plus j

  let currentValue = 0;
  if (i < timeSteps) {
    currentValue =
      (p * nodes[nodeIndex + (i + 1) + 1].value +
        (1 - p) * nodes[nodeIndex + (i + 1)].value) *
      Math.exp(-option.riskFreeRate * deltat);
  }

  const exerciseValue = calculateExerciseValue(
    option,
    nodes[nodeIndex].spotPrice,
    i === timeSteps ? option.timeToMaturity : i * deltat
  );

  return [nodeIndex, Math.max(currentValue, exerciseValue)];
}

/**
 * Calculates the price of an option using the binomial options pricing model described by Cox, Ross, and Rubinstein (1979) (https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.379.7582).
 * @param {Option} option the option to price
 * @param {number} timeSteps number of time steps in the tree (> 0)
 * @returns {number} price of the option
 */
function price(option, timeSteps) {
  if (!isNumberGreaterThanZero(timeSteps)) {
    throw new Error(
      `Invalid time steps (${timeSteps}), must be a number greater than zero.`
    );
  }

  const [deltat, u, d, p] = determineModelParameters(option, timeSteps);

  // Create the tree
  const nodes = [];
  for (let i = 0; i <= timeSteps; i += 1) {
    for (let j = 0; j <= i; j += 1) {
      nodes.push(createNode(option.initialSpotPrice, i, j, u, d));
    }
  }

  // Work backwards through the tree calculating the option values
  for (let i = timeSteps; i >= 0; i -= 1) {
    for (let j = 0; j <= i; j += 1) {
      const [index, value] = calculateNodeOptionValue(
        option,
        timeSteps,
        nodes,
        i,
        j,
        deltat,
        p
      );
      nodes[index].value = value;
    }
  }

  return nodes[0].value;
}

export { price };
