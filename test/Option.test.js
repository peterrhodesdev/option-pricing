import Option from '../src/Option';

describe('check arguments', () => {
  test('valid style and type combinations', () => {
    expect(() => new Option('european', 'call', 100, 100, 1, 0.25, 0.1, 0.05)).not.toThrow();
    expect(() => new Option('european', 'put', 100, 100, 1, 0.25, 0.1, 0.05)).not.toThrow();
    expect(() => new Option('american', 'call', 100, 100, 1, 0.25, 0.1, 0.05)).not.toThrow();
  });

  test('initial spot price is a number greater than zero', () => {
    const [ K, t, vol, r, q ] = [ 100, 1, 0.25, 0.1, 0.05 ];
    expect(() => new Option('european', 'call', undefined, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', null, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', NaN, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', -Infinity, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', Infinity, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', -100, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', 0, K, t, vol, r, q)).toThrow();
    expect(() => new Option('european', 'call', 100, K, t, vol, r, q)).not.toThrow();
  });
});
