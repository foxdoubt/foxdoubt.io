// from: https://andrew.hedges.name/experiments/aspect_ratio/behaviors.js
export default function reduceRatio(numerator, denominator) {
  var gcd, temp, divisor;

  // from: http://pages.pacificcoast.net/~cazelais/euclid.html
  gcd = function(a, b) {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  // take care of the simple case
  if (numerator === denominator) return '1-1';

  // make sure numerator is always the larger number
  if (+numerator < +denominator) {
    temp = numerator;
    numerator = denominator;
    denominator = temp;
  }

  divisor = gcd(+numerator, +denominator);

  return 'undefined' === typeof temp
    ? numerator / divisor + '-' + denominator / divisor
    : denominator / divisor + '-' + numerator / divisor;
}
