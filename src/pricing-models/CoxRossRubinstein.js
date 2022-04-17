import { isNumberGreaterThanZero } from "../utils/ValidationUtils";

function determineModelParameters(option, timeSteps) {
  const deltat = option.timeToMaturity / timeSteps;
  const u = Math.exp(option.volatility * Math.sqrt(deltat)); // proportional up movement
  const d = Math.exp(-option.volatility * Math.sqrt(deltat)); // proportional down movement
  const a = Math.exp((option.riskFreeRate - option.dividendYield) * deltat); // growth factor
  const p = (a - d) / (u - d); // probability of an up movement (probability of a down movement is 1 - p)
  return [ deltat, u, d, p ];
}

function createNode(initialSpotPrice, i, j, u, d) {
  return {
    i,
    j,
    spotPrice: initialSpotPrice * (u ** j) * (d ** (i - j)),
    value: 0,
  };
}

function calculateExerciseValue(option, spotPrice, time) {
  const isCall = (option.type === "call" ? 1 : -1);

  switch(option.style) {
    case "european":
      return time < option.timeToMaturity ? 0 : Math.max(0, isCall * (spotPrice - option.strikePrice));
    case "american":
      return Math.max(0, isCall * (spotPrice - option.strikePrice));
  }

  throw new Error(`Invalid option style (${option.style})`);
}

function calculateNodeOptionValue(option, timeSteps, nodes, i, j, deltat, p) {
  const nodeIndex = (i * (i + 1) / 2) + j; // sum of numbers from 1 to i, plus j

  if (i === timeSteps) {
    nodes[nodeIndex].value = calculateExerciseValue(option, nodes[nodeIndex].spotPrice, option.timeToMaturity);
  } else {
    const optionCurrentValue = (p * nodes[nodeIndex + (i + 1) + 1].value + (1 - p) * nodes[nodeIndex + (i + 1)].value) * Math.exp(-option.riskFreeRate * deltat);
    const exerciseValue = calculateExerciseValue(option, nodes[nodeIndex].spotPrice, i * deltat);
    nodes[nodeIndex].value = Math.max(optionCurrentValue, exerciseValue);
  }
}

function price(option, timeSteps) {
  if (!isNumberGreaterThanZero(timeSteps)) {
    throw new Error(`Invalid time steps (${value}), must be a number greater than zero.`);
  }
  
  const [ deltat, u, d, p ] = determineModelParameters(option, timeSteps);

  // Create the tree
  const nodes = [];
  for (let i = 0; i <= timeSteps; i++) {
    for (let j = 0; j <= i; j++) {
      nodes.push(createNode(option.initialSpotPrice, i, j, u, d));
    }
  }

  // Work backwards through the tree calculating the option values
  for (let i = timeSteps; i >= 0; i--) {
    for (let j = 0; j <= i; j++) {
      calculateNodeOptionValue(option, timeSteps, nodes, i, j, deltat, p);
    }
  }

  return nodes[0].value;
}

export { price };
