import { price } from './AnalyticalSolution';

export default class Option {
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
    Option.#checkIsNumberGreaterThanZero(initialSpotPrice, 'initial spot price');
    this.#initialSpotPrice = initialSpotPrice;
    Option.#checkIsNumberGreaterThanZero(strikePrice, 'strike price');
    this.#strikePrice = strikePrice;
    Option.#checkIsNumberGreaterThanZero(timeToMaturity, 'time to maturity');
    this.#timeToMaturity = timeToMaturity;
    Option.#checkIsNumberGreaterThanZero(volatility, 'volatility');
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
    const validStyles = [ 'american', 'european' ];
    if (!validStyles.includes(style)) {
      throw new Error(`Invalid style (${style}), must be one of: ${validStyles}.`);
    }
  }

  static #checkType(type) {
    const validTypes = [ 'call', 'put' ];
    if (!validTypes.includes(type)) {
      throw new Error(`Invalid type (${type}), must be one of: ${validTypes}.`);
    }
  }

  static #checkIsNumberGreaterThanZero(value, argumentName) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new Error(`Invalid ${argumentName} (${initialSpotPrice}), must be a number greater than zero.`);
    }
  }

  // Setters

  set style(newStyle) {
    Option.#checkStyle(newStyle);
    this.#style = newStyle;
  }

  set type(newType) {
    Option.#checkType(newType);
    this.#type = newType;
  }

  set initialSpotPrice(newInitialSpotPrice) {
    Option.#checkIsNumberGreaterThanZero(newInitialSpotPrice);
    this.#initialSpotPrice = newInitialSpotPrice;
  }

  set strikePrice(newStrikePrice) {
    Option.#checkIsNumberGreaterThanZero(newStrikePrice);
    this.#strikePrice = newStrikePrice;
  }

  set timeToMaturity(newTimeToMaturity) {
    Option.#checkIsNumberGreaterThanZero(newTimeToMaturity);
    this.#timeToMaturity = newTimeToMaturity;
  }

  set volatility(newVolatility) {
    Option.#checkIsNumberGreaterThanZero(newVolatility);
    this.#volatility = newVolatility;
  }

  set riskFreeRate(newRiskFreeRate) {
    this.#riskFreeRate = Number.isFinite(newRiskFreeRate) ? newRiskFreeRate : 0;
  }

  set dividendYield(newDividendYield) {
    this.#dividendYield = Number.isFinite(newDividendYield) ? newDividendYield : 0;
  }

  // Getters

  get style() {
    return this.#style;
  }

  get type() {
    return this.#type;
  }

  get initialSpotPrice() {
    return this.#initialSpotPrice;
  }

  get strikePrice() {
    return this.#strikePrice;
  }

  get timeToMaturity() {
    return this.#timeToMaturity;
  }

  get volatility() {
    return this.#volatility;
  }

  get riskFreeRate() {
    return this.#riskFreeRate;
  }

  get dividendYield() {
    return this.#dividendYield;
  }
}
