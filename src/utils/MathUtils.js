// https://en.wikipedia.org/wiki/Error_function#Approximation_with_elementary_functions
function erf(x) {
  if (x === 0) {
    return 0;
  }

  const t = 1 / (1 + 0.5 * Math.abs(x));
  const tau =
    t *
    Math.exp(
      -(x ** 2) -
        1.26551223 +
        1.00002368 * t +
        0.37409196 * t ** 2 +
        0.09678418 * t ** 3 -
        0.18628806 * t ** 4 +
        0.27886807 * t ** 5 -
        1.13520398 * t ** 6 +
        1.48851587 * t ** 7 -
        0.82215223 * t ** 8 +
        0.17087277 * t ** 9
    );

  return x >= 0 ? 1 - tau : tau - 1;
}

function normalCdf(x, mean, standardDeviation) {
  return 0.5 * (1 - erf((mean - x) / (Math.sqrt(2) * standardDeviation)));
}

function standardNormalCdf(x) {
  return normalCdf(x, 0, 1);
}

function arraySumToPower(array, pow = 1) {
  return array.reduce(
    (previousValue, currentValue) => previousValue + currentValue ** pow,
    0
  );
}

function arraysProductToPower(array1, array2, pow1 = 1, pow2 = 1) {
  return array1.reduce(
    (previousValue, currentValue, currentIndex) =>
      previousValue + currentValue ** pow1 * array2[currentIndex] ** pow2,
    0
  );
}

// Ordinary least-squares regression for quadratic, like the ols() function of MATLAB but only for quadratics
// https://www.azdhs.gov/documents/preparedness/state-laboratory/lab-licensure-certification/technical-resources/calibration-training/12-quadratic-least-squares-regression-calib.pdf
function quadraticRegression(x, y) {
  const n = x.length;
  if (n !== y.length) {
    // throw new Error("unable to perform quadratic regression");
    return [0, 0, 0];
  }

  const Sx = arraySumToPower(x);
  const Sx2 = arraySumToPower(x, 2);
  const Sy = arraySumToPower(y);

  const Sxx = Sx2 - Sx ** 2 / n;
  const Sxy = arraysProductToPower(x, y) - (Sx * Sy) / n;
  const Sxx2 = arraySumToPower(x, 3) - (Sx * Sx2) / n;
  const Sx2y = arraysProductToPower(x, y, 2) - (Sx2 * Sy) / n;
  const Sx2x2 = arraySumToPower(x, 4) - Sx2 ** 2 / n;

  const a2 = (Sx2y * Sxx - Sxy * Sxx2) / (Sxx * Sx2x2 - Sxx2 ** 2);
  const a1 = (Sxy * Sx2x2 - Sx2y * Sxx2) / (Sxx * Sx2x2 - Sxx2 ** 2);
  const a0 = Sy / n - (a1 * Sx) / n - (a2 * Sx2) / n;

  return [a0, a1, a2];
}

export { quadraticRegression, standardNormalCdf };
