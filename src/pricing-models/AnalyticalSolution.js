import { standardNormalCdf } from "../utils/MathUtils";

/**
 * Vanilla European option.
 * The value of a European option and it's greeks can be calculated analytically using the Black-Scholes model (https://www.jstor.org/stable/1831029). This model was extended by Merton (https://www.jstor.org/stable/3003143) to allow for the inclusion of a continuous dividend yield.
 */
function blackScholesMerton(type, S, K, t, vol, r, q) {
  const isCall = type === "call" ? 1 : -1;
  const d1 =
    (Math.log(S / K) + (r - q + vol ** 2 / 2) * t) / (vol * Math.sqrt(t));
  const d2 =
    (Math.log(S / K) + (r - q - vol ** 2 / 2) * t) / (vol * Math.sqrt(t));

  return (
    isCall * S * Math.exp(-q * t) * standardNormalCdf(isCall * d1) +
    -isCall * K * Math.exp(-r * t) * standardNormalCdf(isCall * d2)
  );
}

function price(option) {
  const [S, K, t, vol, r, q] = [
    option.initialSpotPrice,
    option.strikePrice,
    option.timeToMaturity,
    option.volatility,
    option.riskFreeRate,
    option.dividendYield,
  ];

  if (option.style === "european") {
    return blackScholesMerton(option.type, S, K, t, vol, r, q);
  }

  return undefined; // There is no known analytical solution
}

export { price };
