import Option from '../src/Option';

// References:
// Hull (2014): Hull, J. (2014) Options, Futures and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.
// Hull SSM (2014): Hull, J. (2014) Student Solutions Manual for Options, Futures, and Other Derivatives. 9th Edition, Prentice Hall, Upper Saddle River.

describe('Black-Scholes-Merton model', () => {
  test('European call: Hull SSM (2014), Problem 15.13, page 166', () => {
    const option = new Option('european', 'call', 52, 50, 0.25, 0.3, 0.12, 0);
    const price = option.analyticalSolution();
    expect(price).toBeCloseTo(5.06, 2);
  });

  test('European put: Hull (2014), Section 15.9, Example 15.6, page 360', () => {
    const option = new Option('european', 'put', 42, 40, 0.5, 0.2, 0.1, 0);
    const price = option.analyticalSolution();
    expect(price).toBeCloseTo(0.81, 2);
  });
});
