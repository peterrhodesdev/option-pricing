import { price } from "./pricing-models/AnalyticalSolution.js";
import { isNumberGreaterThanZero } from "./utils/ValidationUtils.js";

class Option {
  #style;

  #type;

  #initialSpotPrice;

  #strikePrice;

  #timeToMaturity;

  #volatility;

  #riskFreeRate;

  #dividendYield;

  constructor(
    style,
    type,
    initialSpotPrice,
    strikePrice,
    timeToMaturity,
    volatility,
    riskFreeRate,
    dividendYield
  ) {
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

  // Pricers

  analyticalSolution() {
    return price(this);
  }

  // Checkers

  static #checkStyle(style) {
    const validStyles = ["american", "european"];
    if (!validStyles.includes(style)) {
      throw new Error(
        `Invalid style (${style}), must be one of: ${validStyles}.`
      );
    }
  }

  static #checkType(type) {
    const validTypes = ["call", "put"];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type (${type}), must be one of: ${validTypes}.`);
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
