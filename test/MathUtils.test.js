import { standardNormalCdf } from '../src/MathUtils';

describe('Standard normal CDF', () => {
  // https://en.wikipedia.org/wiki/Standard_normal_table#Cumulative_from_minus_infinity_to_Z
  it('matches the table of values on wikipedia', () => {
    const values = [
      { z: -4.0, result: 0.00003 },
      { z: -3.0, result: 0.00135 },
      { z: -2.0, result: 0.02275 },
      { z: -1.0, result: 0.15866 },
      { z: 0.0, result: 0.50000 },
      { z: 1.0, result: 0.84134 },
      { z: 2.0, result: 0.97725 },
      { z: 3.0, result: 0.99865 },
      { z: 4.0, result: 0.99997 },
    ];
    const decimalPlaces = 5;

    for (let value of values) {
      expect(standardNormalCdf(value.z)).toBeCloseTo(value.result, decimalPlaces);
    }
  })
})
