import { randn } from "../utils/MathUtils.js";
import { createFilledMatrix, zeros } from "../utils/MatrixUtils.js";
import { isNumberGreaterThanZero } from "../utils/ValidationUtils.js";

function initializeSpotPriceMatrix(M, N, S0, vol, dt, drift) {
  const spotPriceMatrix = zeros(M, N);
  for (let i = 0; i < M; i += 1) {
    spotPriceMatrix[i][0] = S0;
  }

  const vsqrdt = vol * dt ** 0.5;
  for (let i = 0; i < M; i += 1) {
    for (let j = 1; j < N; j += 1) {
      const St = S0 * Math.exp(drift + vsqrdt * randn());
      spotPriceMatrix[i][j] = St;
    }
  }
  return spotPriceMatrix;
}

function calculateCashFlowMatrix(option, spotPriceMatrix, M, N) {
  const cashFlowMatrix = createFilledMatrix(M, N, {
    continuationValue: 0,
    exerciseValue: 0,
    exerciseDecision: false,
  });

  for (let i = 0; i < M; i += 1) {
    const exerciseValue = option.calculateExerciseValue(
      spotPriceMatrix[i][N - 1],
      option.timeToMaturity
    );
    cashFlowMatrix[i][N - 1].exerciseValue = exerciseValue;
    cashFlowMatrix[i][N - 1].continuationValue = exerciseValue;
    cashFlowMatrix[i][N - 1].exerciseDecision = exerciseValue > 0;
  }

  return cashFlowMatrix;
}

function calculatePayoffSum(cashFlowMatrix, M, N, mu, dt) {
  let payoffSum = 0;
  for (let i = 0; i < M; i += 1) {
    for (let j = 0; j < N; j += 1) {
      if (cashFlowMatrix[i][j].exerciseDecision) {
        const payoff =
          Math.exp(-mu * j * dt) * cashFlowMatrix[i][j].exerciseValue;
        payoffSum += payoff;
      }
    }
  }
  return payoffSum;
}

// TODO
function price(option, params) {
  const M = params.simulations;
  const timeSteps = Object.hasOwn(params, "timeSteps") ? params.timeSteps : 1;
  if (!isNumberGreaterThanZero(timeSteps)) {
    throw new Error(
      `Invalid time steps (${timeSteps}), must be a number greater than zero.`
    );
  }
  const N = timeSteps + 1;

  const dt = option.timeToMaturity / (N - 1);
  const mu = option.riskFreeRate - option.dividendYield;
  const drift = (mu - option.volatility ** 2 / 2) * dt;
  const spotPriceMatrix = initializeSpotPriceMatrix(
    M,
    N,
    option.initialSpotPrice,
    option.volatility,
    dt,
    drift
  );

  const cashFlowMatrix = calculateCashFlowMatrix(option, spotPriceMatrix, M, N);
  const payoffSum = calculatePayoffSum(cashFlowMatrix, M, N, mu, dt);

  return payoffSum / M;
}

export { price };
