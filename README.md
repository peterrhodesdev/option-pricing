# option-pricing

Analytical and numerical option pricing calculator.

Analytical solutions implemented:
- Black-Scholes-Merton (BSM) model for vanilla European call and put options

Numerical pricing models supported:
- `coxRossRubinstein`: Cox-Ross-Rubinstein (CRR) model (also known as the binomial model)

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

Import the `Option` class and the pricing model(s) you want to use:

```js
import { Option, coxRossRubinstein } from "option-pricing";
```

Create a new `Option`:

```js
const option = new Option(
  "european", // Style of the option defined by the exercise rights ("european" or "american").
  "call",     // Type of the option ("call" or "put").
  100,        // Initial price of the underlying asset (S₀ > 0).
  105,        // Strike/exercise price of the option (K > 0).
  0.5,        // Time until maturity/expiration in years (τ = T - t > 0).
  0.3,        // Underlying volatility (σ > 0).
  0.2,        // Annualized risk-free interest rate continuously compounded (r).
  0.1         // Annual dividend yield continuously compounded (q).
);
```

Then either call the `analyticalSolution` method on the `Option`, or pass the option to the desired pricing model along with the required parameters.

## Examples

### Analytically priced options

- European call option

The value of a European option and it's greeks can be calculated analytically using the [Black-Scholes model](https://www.jstor.org/stable/1831029). This model was extended by [Merton](https://www.jstor.org/stable/3003143) to allow for the inclusion of a continuous dividend yield.

_Hull SSM (2014), Problem 15.13, page 166_

S₀ = 52, K = 50, τ = 0.25, σ = 0.3, r = 0.12, q = 0

```js
const option = new Option("european", "call", 52, 50, 0.25, 0.3, 0.12, 0);
const price = option.analyticalSolution();
console.log(price);
// 5.06...
```

- American put option

No known analytical solution exists for American put options, so the result will be `undefined`.

```js
const option = new Option("american", "put", 52, 50, 0.25, 0.3, 0.12, 0);
const price = option.analyticalSolution();
console.log(price);
// undefined
```

### Cox, Ross, and Rubinstein

Binomial options pricing model described by [Cox, Ross, and Rubinstein (1979)](https://citeseerx.ist.psu.edu/viewdoc/summary?doi=10.1.1.379.7582).

- American put option

_Hull SSM (2014): Problem 13.17, page 142_

option: S₀ = 1500, K = 1480, τ = 1, σ = 0.18, r = 0.04, q = 0.025
parameters: timeSteps = 2

```js
const option = new Option("american", "put", 1500, 1480, 1, 0.18, 0.04, 0.025);
const price = coxRossRubinstein.price(
  option,
  2,      // Number of time steps in the tree.
);
console.log(price);
// 78.41...
```

## References

- Hull (2014): Hull, J. (2014) Options, Futures and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
- Hull SSM (2014): Hull, J. (2014) Student Solutions Manual for Options, Futures, and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
