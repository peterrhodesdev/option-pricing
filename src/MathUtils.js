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

export { standardNormalCdf };
