# option-pricing

Analytical (Black-Scholes-Merton) and numerical (binomial tree) option pricing calculator supporting different payoff styles (European and American).

Pricing methods implemented:
- Black-Scholes-Merton (BSM) model for vanilla European call and put options (and vanilla American call options on a non-dividend paying stock)
- Cox-Ross-Rubinstein (CRR) model (also known as the binomial model)

## Table of contents

- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
  - [Analytically priced options](#analytically-priced-options)
  - [Cox, Ross, and Rubinstein](#cox-ross-and-rubinstein)
- [References](#references)

## Installation

To install the package run:

```sh
npm install option-pricing
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
  riskFreeRate: 0.2,     // [optional] Annualized risk-free interest rate continuously compounded (r).
  dividendYield: 0.1,    // [optional] Annual dividend yield continuously compounded (q).
});
```

Then call the `price` method on the `Option`, selecting the desired pricing method/model (and passing in the required parameters if a numerical method is selected).

> You can use the setter methods provided to update the option parameters.

### Pricing methods

The available pricing methods are:
- Black-Scholes-Merton (BSM): `"bsm"` or `"black-scholes-merton"`
- Cox-Ross-Rubinstein (CRR): `"crr"` or `"cox-ross-rubinstein"`

### Parameters for numerical methods

The parameters for the numerical methods are:
- Cox-Ross-Rubinstein (CRR):
  - timeSteps: number of time steps in the tree (> 0)

## Examples

### Black-Scholes-Merton (analytically priced options)

- European call/put options

The value of a European option and it's greeks can be calculated analytically using the [Black-Scholes model](https://www.jstor.org/stable/1831029). This model was extended by [Merton](https://www.jstor.org/stable/3003143) to allow for the inclusion of a continuous dividend yield.

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
const price = option.price("bsm");
console.log(price);
// 5.057...
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
const price = option.price("black-scholes-merton");
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
const price = option.price("bsm");
console.log(price);
// undefined
```

### Cox, Ross, and Rubinstein

Binomial options pricing model described by [Cox, Ross, and Rubinstein (1979)](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.379.7582).

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
const price = option.price("crr", { timeSteps: 2 });
console.log(price);
// 78.413...
```

## References

- Hull (2014): Hull, J. (2014) Options, Futures and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
- Hull SSM (2014): Hull, J. (2014) Student Solutions Manual for Options, Futures, and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
