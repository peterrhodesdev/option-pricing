# option-pricing

[![GitHub license](https://img.shields.io/badge/license-MIT-yellow.svg)](https://github.com/peterrhodesdev/option-pricing/blob/main/LICENSE) [![npm version](https://img.shields.io/npm/v/option-pricing.svg?style=flat&logo=npm)](https://www.npmjs.com/package/option-pricing) [![build](https://github.com/peterrhodesdev/option-pricing/workflows/build/badge.svg)](https://github.com/peterrhodesdev/option-pricing/actions?query=workflow%3Abuild) [![coverage](https://img.shields.io/endpoint?url=https://raw.githubusercontent.com/wiki/peterrhodesdev/option-pricing/coverage.md)](https://github.com/peterrhodesdev/option-pricing/actions?query=workflow%3Acoverage)

Analytical and numerical option pricing calculator supporting different payoff styles.

Pricing methods implemented:
- **Black-Scholes**: analytical calculation of the value of a European option using the [Black-Scholes model](https://www.jstor.org/stable/1831029), extended by [Merton](https://www.jstor.org/stable/3003143) to allow for the inclusion of a continuous dividend yield.
- **Binomial tree**: using the binomial options pricing model described by [Cox, Ross, and Rubinstein](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.379.7582), i.e. the Cox-Ross-Rubinstein (CRR) model (also known as the binomial model)
- **Monte Carlo simulation**: risk neutral valuation of random price paths as first applied by [Boyle](http://ideas.repec.org/a/eee/jfinec/v4y1977i3p323-338.html), with early exercise handled using the least-squares Monte Carlo approach (with a fixed degree of 2) proposed by [Longstaff and Schwartz](https://www.researchgate.net/publication/5216848_Valuing_American_Options_by_Simulation_A_Simple_Least-Squares_Approach).

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
  - [Black-Scholes](#black-scholes-analytically-priced-options)
  - [Binomial Tree](#binomial-tree)
  - [Monte Carlo simulation](#monte-carlo-simulation)
- [References](#references)

## Installation

To install the package run:

```sh
npm install option-pricing
```

or load it directly in the browser using a CDN like [unpkg](https://unpkg.com/):

```js
<script crossorigin src="https://unpkg.com/option-pricing/client-dist/bundle.js"></script>
```

## Usage

Import the `Option` class:

```js
import { Option } from "option-pricing";
```

Create a new `Option`:

```js
const option = new Option({
  style: "european",     // Style of the option defined by the exercise rights ("european" or "american").
  type: "call",          // Type of the option ("call" or "put").
  initialSpotPrice: 100, // Initial price of the underlying asset (S₀ > 0).
  strikePrice: 105,      // Strike/exercise price of the option (K > 0).
  timeToMaturity: 0.5,   // Time until maturity/expiration in years (τ = T - t > 0).
  volatility: 0.3,       // Underlying volatility (σ > 0).
  riskFreeRate: 0.2,     // [optional=0] Annualized risk-free interest rate continuously compounded (r).
  dividendYield: 0.1,    // [optional=0] Annual dividend yield continuously compounded (q).
});
```

Then call the `price` method on the `Option`, selecting the desired pricing method/model (and passing in the required parameters if a numerical method is selected).

> You can use the setter methods provided to update the option parameters.

### Pricing method selection and parameters

The available pricing methods are:
- Black-Scholes: `"bs"` or `"black-scholes"`
- Binomial tree: `"bt"` or `"binomial-tree"`
  - timeSteps: number of time steps in the tree (> 0)
- Monte Carlo simulation: `"mcs"` or `"monte-carlo-simulation"`
  - simulations: number of simulated price paths (> 0)
  - timeSteps: number of time steps to simulate for each path (default is `1`, a higher value should be chosen for options with early exercise)

```js
// Black-Scholes
option.price("bs");
option.price("black-scholes");
// Binomial tree
option.price("bt", { timeSteps: 25 });
option.price("binomial-tree", { timeSteps: 100 });
// Monte Carlo simulation
option.price("mcs", { simulations: 1000 }); // default timeSteps = 1 for European options
option.price("monte-carlo-simulation", { simulations: 1000, timeSteps: 50 });
```

## Examples

### Black-Scholes (analytically priced options)

- European call option

_Hull SSM (2014), Problem 15.13, page 166_

S₀ = 52, K = 50, τ = 0.25, σ = 0.3, r = 0.12, q = 0

```js
const option = new Option({
  style: "european",
  type: "call",
  initialSpotPrice: 52,
  strikePrice: 50,
  timeToMaturity: 0.25,
  volatility: 0.3,
  riskFreeRate: 0.12,
});
const price = option.price("bs");
console.log(price);
// 5.057...
```

- European put option

_Hull SSM (2014), Problem 17.7, page 187_

S₀ = 0.52, K = 0.5, τ = 0.6667, σ = 0.12, r = 0.04, q = 008

```js
const option = new Option({
  style: "european",
  type: "put",
  initialSpotPrice: 0.52,
  strikePrice: 0.5,
  timeToMaturity: 0.6667,
  volatility: 0.12,
  riskFreeRate: 0.04,
  dividendYield: 0.08,
});
const price = option.price("black-scholes");
console.log(price);
// 0.0162...
```

- American call option on a non-dividend paying stock

> "Since it is never optimal to exercise early an American call option on a non-dividend-paying stock (see Section 11.5), equation (15.20) [the Black-Scholes-Merton pricing formula] is the value of an American call option on a non-dividend-paying stock." (Hull, 2014, p. 359)

That is, the price of an American call option on a non-dividend paying stock is the same as the price of a European call option.

```js
const option = new Option({
  style: "american",
  type: "call",
  initialSpotPrice: 52,
  strikePrice: 50,
  timeToMaturity: 0.25,
  volatility: 0.3,
  riskFreeRate: 0.12,
});
const price = option.price("bs");
console.log(price);
// 5.057...
```

- American put option

> "no exact analytic formula for the value of an American put option on a non-dividend-paying stock has been produced" (Hull, 2014, p. 359)

So, the result when attempting to analytically price an American put option will be `undefined`.

```js
const option = new Option({
  style: "american",
  type: "put",
  initialSpotPrice: 52,
  strikePrice: 50,
  timeToMaturity: 0.25,
  volatility: 0.3,
  riskFreeRate: 0.12,
});
const price = option.price("bs");
console.log(price);
// undefined
```

### Binomial tree

- American put option

_Hull SSM (2014): Problem 13.17, page 142_

S₀ = 1500, K = 1480, τ = 1, σ = 0.18, r = 0.04, q = 0.025, time steps = 2

```js
const option = new Option({
  style: "american",
  type: "put",
  initialSpotPrice: 1500,
  strikePrice: 1480,
  timeToMaturity: 1,
  volatility: 0.18,
  riskFreeRate: 0.04,
  dividendYield: 0.025,
});
const price = option.price("bt", { timeSteps: 2 });
console.log(price);
// 78.413...
```

### Monte Carlo simulation

- Convergence to European call option price

S₀ = 52, K = 50, τ = 0.25, σ = 0.3, r = 0.12, q = 0

```js
const option = new Option({
  style: "european",
  type: "call",
  initialSpotPrice: 52,
  strikePrice: 50,
  timeToMaturity: 0.25,
  volatility: 0.3,
  riskFreeRate: 0.12,
});
const analyticalPrice = 5.057;
const decimalPlaces = 3;
console.log("| simulations | price | error |\n| --- | --- | --- |");
const simulationsArray = [10, 100, 1000, 10000, 100000, 1000000];
for (const simulations of simulationsArray) {
  const price = option.price("mcs", { simulations });
  console.log(`| ${simulations} | ${price.toFixed(decimalPlaces)} | ${(price - analyticalPrice).toFixed(decimalPlaces)} |`);
}
```

| simulations | price | error |
| --- | --- | --- |
| 10 | 4.493 | -0.564 |
| 100 | 5.599 | 0.542 |
| 1000 | 5.091 | 0.034 |
| 10000 | 5.051 | -0.006 |
| 100000 | 5.041 | -0.016 |
| 1000000 | 5.058 | 0.001 |

## References

- Black, F., & Scholes, M. (1973). The Pricing of Options and Corporate Liabilities. Journal of Political Economy, 81(3), 637–654.
- Boyle, P.P. (1977) Options: A Monte Carlo Approach. Journal of Financial Economics, 4, 323-338.
- Cox, J.C., Ross, S.A., & Rubinstein, M. (1979). Options pricing: A simplified approach. Journal of Financial Economics, 7, 229-263.
- _Hull (2014)_: Hull, J. (2014) Options, Futures and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
- _Hull SSM (2014)_: Hull, J. (2014) Student Solutions Manual for Options, Futures, and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
- Longstaff, F., & Schwartz, E. (2001). Valuing American Options by Simulation: A Simple Least-Squares Approach. Review of Financial Studies. 14. 113-47.
- Merton, R. C. (1973). Theory of Rational Option Pricing. The Bell Journal of Economics and Management Science, 4(1), 141–183.
