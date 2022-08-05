import {
  isValidStyle,
  isValidType,
  isNumberGreaterThanZero,
} from "./utils/ValidationUtils.js";
import { price as priceBSM } from "./pricing-models/BlackScholesMerton.js";
import { price as priceCRR } from "./pricing-models/CoxRossRubinstein.js";
import { price as priceMCS } from "./pricing-models/MonteCarloSimulation.js";

const METHOD_BLACK_SCHOLES_MERTON = ["bsm", "black-scholes-merton"];
const METHOD_COX_ROSS_RUBINSTEIN = ["crr", "cox-roxx-rubinstein"];
const METHOD_MONTE_CARLO_SIMULATION = ["mcs", "monte-carlo-simulation"];

/**
 * @class Option
 */
class Option {
  #style;

  #type;

  #initialSpotPrice;

  #strikePrice;

  #timeToMaturity;

  #volatility;

  #riskFreeRate;

  #dividendYield;

  /**
   * @constructor Option
   * @param {object} option
   * @param {string} option.style style of the option defined by the exercise rights ("european" or "american")
   * @param {string} option.type type of the option ("call" or "put")
   * @param {number} option.initialSpotPrice initial price of the underlying asset (S₀ > 0)
   * @param {number} option.strikePrice strike/exercise price of the option (K > 0)
   * @param {number} option.timeToMaturity time until maturity/expiration in years (τ = T - t > 0)
   * @param {number} option.volatility underlying volatility (σ > 0)
   * @param {number} [option.riskFreeRate=0] [optional] annualized risk-free interest rate continuously compounded (r)
   * @param {number} [option.dividendYield=0] [optional] annual dividend yield continuously compounded (q)
   * @throws if the option params are invalid
   */
  constructor({
    style,
    type,
    initialSpotPrice,
    strikePrice,
    timeToMaturity,
    volatility,
    riskFreeRate,
    dividendYield,
  }) {
    Option.#checkStyle(style);
    this.#style = style;
    Option.#checkType(type);
    this.#type = type;
    Option.#checkIsNumberGreaterThanZero(
      initialSpotPrice,
      "initial spot price"
    );
    this.#initialSpotPrice = initialSpotPrice;
    Option.#checkIsNumberGreaterThanZero(strikePrice, "strike price");
    this.#strikePrice = strikePrice;
    Option.#checkIsNumberGreaterThanZero(timeToMaturity, "time to maturity");
    this.#timeToMaturity = timeToMaturity;
    Option.#checkIsNumberGreaterThanZero(volatility, "volatility");
    this.#volatility = volatility;
    this.#riskFreeRate = Number.isFinite(riskFreeRate) ? riskFreeRate : 0;
    this.#dividendYield = Number.isFinite(dividendYield) ? dividendYield : 0;
  }

  // Price

  /**
   * Calculates the price of the option.
   * @param {string} method pricing method/model ("bsm"|"black-scholes-merton", "crr"|"cox-ross-rubinstein")
   * @param {object} [params=null] [optional] params for numerical methods
   * @returns {number|undefined} analytically calculated option value, or undefined if the analytical solution is not known
   * @throws if the pricing method is not valid
   * @throws if the params are invalid for the selected pricing method
   */
  price(method, params = null) {
    const methodLowerCase = method.toLowerCase();
    if (
      !METHOD_BLACK_SCHOLES_MERTON.includes(methodLowerCase) &&
      params === null
    ) {
      throw new Error("params must be supplied for numerical methods");
    }

    switch (true) {
      case METHOD_BLACK_SCHOLES_MERTON.includes(methodLowerCase):
        return priceBSM(this);
      case METHOD_COX_ROSS_RUBINSTEIN.includes(methodLowerCase):
        return priceCRR(this, params);
      case METHOD_MONTE_CARLO_SIMULATION.includes(methodLowerCase):
        return priceMCS(this, params);
      default:
        throw new Error(`unknown method: ${method}`);
    }
  }

  // Checkers

  static #checkStyle(style) {
    if (!isValidStyle(style)) {
      throw new Error(`invalid style: ${style}`);
    }
  }

  static #checkType(type) {
    if (!isValidType(type)) {
      throw new Error(`Invalid type: ${type}`);
    }
  }

  static #checkIsNumberGreaterThanZero(value, argumentName) {
    if (!isNumberGreaterThanZero(value)) {
      throw new Error(
        `Invalid ${argumentName} (${value}), must be a number greater than zero.`
      );
    }
  }

  // Getters and setters

  get style() {
    return this.#style;
  }

  set style(newStyle) {
    Option.#checkStyle(newStyle);
    this.#style = newStyle;
  }

  get type() {
    return this.#type;
  }

  set type(newType) {
    Option.#checkType(newType);
    this.#type = newType;
  }

  get initialSpotPrice() {
    return this.#initialSpotPrice;
  }

  set initialSpotPrice(newInitialSpotPrice) {
    Option.#checkIsNumberGreaterThanZero(newInitialSpotPrice);
    this.#initialSpotPrice = newInitialSpotPrice;
  }

  get strikePrice() {
    return this.#strikePrice;
  }

  set strikePrice(newStrikePrice) {
    Option.#checkIsNumberGreaterThanZero(newStrikePrice);
    this.#strikePrice = newStrikePrice;
  }

  get timeToMaturity() {
    return this.#timeToMaturity;
  }

  set timeToMaturity(newTimeToMaturity) {
    Option.#checkIsNumberGreaterThanZero(newTimeToMaturity);
    this.#timeToMaturity = newTimeToMaturity;
  }

  get volatility() {
    return this.#volatility;
  }

  set volatility(newVolatility) {
    Option.#checkIsNumberGreaterThanZero(newVolatility);
    this.#volatility = newVolatility;
  }

  get riskFreeRate() {
    return this.#riskFreeRate;
  }

  set riskFreeRate(newRiskFreeRate) {
    this.#riskFreeRate = Number.isFinite(newRiskFreeRate) ? newRiskFreeRate : 0;
  }

  get dividendYield() {
    return this.#dividendYield;
  }

  set dividendYield(newDividendYield) {
    this.#dividendYield = Number.isFinite(newDividendYield)
      ? newDividendYield
      : 0;
  }
}

export { Option };
