import { quadraticRegression, randn } from "../utils/MathUtils.js";
import { createFilledMatrix, zeros } from "../utils/MatrixUtils.js";
import { calculateExerciseValue } from "../utils/OptionUtils.js";
import { isNumberGreaterThanZero } from "../utils/ValidationUtils.js";

function initializeSpotPriceMatrix(M, N, S0, vol, dt, drift) {
  const spotPriceMatrix = zeros(M, N);
  for (let i = 0; i < M; i += 1) {
    spotPriceMatrix[i][0] = S0;
  }

  for (let j = 1; j < N; j += 1) {
    let brownianMotion = [];
    for (let i = 0; i < M / 2; i += 1) {
      brownianMotion.push(randn());
    }
    // antithetic variables
    brownianMotion = [
      ...brownianMotion,
      ...brownianMotion.map((randNum) => -randNum),
    ];
    for (let i = 0; i < M; i += 1) {
      const St =
        spotPriceMatrix[i][j - 1] *
        Math.exp(drift + vol * brownianMotion[i] * Math.sqrt(dt));
      spotPriceMatrix[i][j] = St;
    }
  }
  return spotPriceMatrix;
}

function leastSquaresLongstaffSchwartz(
  V,
  spotPriceMatrix,
  exerciseValueMatrix,
  M,
  N,
  discount
) {
  for (let k = N - 2; k > 0; k -= 1) {
    const x = spotPriceMatrix.map((row) => row[k]);
    const y = V.map((row) => row[k + 1] * discount);
    const regressors = quadraticRegression(x, y);

    const continuationValue = spotPriceMatrix.map(
      (row) =>
        regressors[0] + regressors[1] * row[k] + regressors[2] * row[k] ** 2
    );

    for (let i = 0; i < M; i += 1) {
      // eslint-disable-next-line no-param-reassign
      V[i][k] =
        exerciseValueMatrix[i][k] > continuationValue[i]
          ? exerciseValueMatrix[i][k]
          : V[i][k + 1] * discount;
    }
  }
}

function calculatePrice(option, spotPriceMatrix, M, N, mu, dt) {
  const exerciseValueMatrix = [];
  for (let i = 0; i < M; i += 1) {
    exerciseValueMatrix.push([]);
    for (let k = 0; k < N; k += 1) {
      const exerciseValue = calculateExerciseValue(
        option,
        spotPriceMatrix[i][k],
        k === N - 1 ? option.timeToMaturity : k * dt
      );
      exerciseValueMatrix[i].push(exerciseValue);
    }
  }

  const discount = Math.exp(-mu * dt);
  const V = createFilledMatrix(M, N, 0);
  for (let i = 0; i < M; i += 1) {
    V[i][N - 1] = exerciseValueMatrix[i][N - 1];
  }

  if (N > 2) {
    leastSquaresLongstaffSchwartz(
      V,
      spotPriceMatrix,
      exerciseValueMatrix,
      M,
      N,
      discount
    );
  }

  return (
    V.reduce(
      (previousValue, currentValue) =>
        previousValue + currentValue[1] * discount,
      0
    ) / M
  );
}

/**
 * Calculates the price of an option using a Monte Carlo Simulation.
 * Early exercise is handled using the least-squares Monte Carlo approach (with a fixed degree of 2) proposed by Longstaff and Schwartz (https://www.researchgate.net/publication/5216848_Valuing_American_Options_by_Simulation_A_Simple_Least-Squares_Approach).
 * @param {Option} option option to price
 * @param {object} params
 * @param {number} params.simulations number of simulated price paths (> 0)
 * @param {number} [params.timeSteps=1] number of time steps to simulate for each path (> 0)
 * @returns price of the option
 * @throws if params.simulations is not a number greater than zero
 * @throws if params.timeSteps is not a number greater than zero
 */
function price(option, params) {
  let M;
  let timeSteps;
  // allow spot price matrix override for testing purposes
  if (Object.hasOwn(params, "spotPriceMatrixOverride")) {
    const { spotPriceMatrixOverride } = params;
    M = spotPriceMatrixOverride.length;
    timeSteps = spotPriceMatrixOverride[0].length - 1;
  } else {
    M = params.simulations;
    timeSteps = Object.hasOwn(params, "timeSteps") ? params.timeSteps : 1;
  }
  // simulations must be even for generating brownian motion
  M += M % 2;

  if (!isNumberGreaterThanZero(M)) {
    throw new Error(
      `invalid simulations (${M}), must be a number greater than zero.`
    );
  }
  if (!isNumberGreaterThanZero(timeSteps)) {
    throw new Error(
      `invalid time steps (${timeSteps}), must be a number greater than zero.`
    );
  }
  const N = timeSteps + 1;

  const dt = option.timeToMaturity / (N - 1);
  const mu = option.riskFreeRate - option.dividendYield;
  const drift = (mu - option.volatility ** 2 / 2) * dt;
  const spotPriceMatrix = Object.hasOwn(params, "spotPriceMatrixOverride")
    ? params.spotPriceMatrixOverride
    : initializeSpotPriceMatrix(
        M,
        N,
        option.initialSpotPrice,
        option.volatility,
        dt,
        drift
      );

  return calculatePrice(option, spotPriceMatrix, M, N, mu, dt);
}

export { price };
