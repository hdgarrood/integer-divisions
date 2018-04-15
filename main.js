// ## INTEGER DIVISION
//
// Much of the information in this file is based off the paper "The Euclidean
// definition of the functions div and mod", Raymond T. Boute, ACM Transactions
// on Programming Languages and Systems, Vol 14, No. 2, April 1992, pages
// 127-144.
//
// First, some vocabulary. If we write a / b, then a is called the
// _dividend_, and b is called the _divisor_.
//
// Now, suppose we wish to define an integer division operation, that is,
// a division operation which accepts two integers and returns another integer.
// First, remember that when we divide integers, we in fact end up with two
// integers as a result: the first is called the _quotient_, and it represents
// the number of times the divisor 'goes into' the dividend, and the second is
// called the _remainder_, and it represents what is left over after taking
// away that multiple of the divisor.
//
// This idea leads us to the quotient/remainder law: if we divide a by b, and
// call the quotient q, and the remainder r, then we should have that a = b*q +
// r. This equation corresponds to saying that "the number of times b goes into
// a is q, and the remainder is r". For example, 5 goes into 13 twice with
// remainder 3, so if we choose a = 13 and b = 5, we get q = 2 and r = 3.
//
// Note that if we fix a and b, and we have a pair of integers q and r such
// that a = b*q + r, then we can always find a different choice for q and r
// which satisfy the same equation. For example, we can perform the
// substitutions q -> q-1 and r -> r+b, since b*(q-1) + (r+b) = b*q - b + r + b
// = b*q + r = a.  Similarly, we can substitute q -> q+1, and r -> r-b.
// Therefore, when we are defining an integer division operation, since we have
// many different options for q and r, we must decide which one we are going to
// choose.
//
// Our task is made easier by the fact that there is only one sensible choice
// of q and r when a and b are both postive: we take r such that 0 <= r < b,
// and we take q to be the largest integer satisfying b*q <= a. Equivalently,
// we obtain q by taking the exact result of dividing a by b and rounding down.
//
// However, when either of a or b are negative, there are a few different
// options to choose from.
//
// One of the most common options taken by programming languages is called
// "truncating" division, because we obtain q by taking the exact result of
// division and "truncating" (rounding towards zero). This can be implemented
// in JavaScript as follows:

// Truncating division
function tdiv(x,y) {
  return x / y | 0;
}
function tmod(x,y) {
  return x % y;
}

// To give an example, suppose we have a = -2 and b = 3, and we want to divide
// a by b. The exact result of division is -2/3; rounding this towards zero, we
// obtain q=0. Then, we must choose r=-2 so that the quotient/remainder law is
// satisfied.

// The other most common option is called "flooring" or "Knuthian" division. It
// works by taking the exact result of division and then rounding towards
// negative infinity. Therefore, if the exact result of division is positive --
// this happens precisely when the divisor and the dividend have the same sign
// -- flooring division is identical to truncating division. However, if the
// exact result is negative, then the result will be slightly different. For
// example, consider a=-2 and b=3 again. We saw that truncating division
// produces q=0 in this case, but flooring division rounds towards negative
// infinity and so we obtain q=-1. To satisfy the quotient/remainder law, we
// then need to choose r=1.
//
// Now consider a similar example, where we wish to perform flooring division
// with a=2 and b=-3. In this case, we again obtain q=-1. Since a=2, we need to
// choose r=-1 to satisfy the quotient/remainder law.

// Flooring/Knuthian division
function fdiv(x,y) {
  return Math.floor(x/y);
}
function fmod(x,y) {
  return ((x % y) + y) % y;
}

// It turns out that, with truncating division, the remainder has the same sign
// as the dividend. Also, with flooring division, the remainder has the same
// sign as the divisor.
//
// It is arguably a severe drawback of truncating division that the remainder
// takes the sign of the dividend; as any number theorist will tell you, when
// performing division with a dividend a and a divisor b, it makes the most
// sense to consider only |b| different possibilities for the remainder.
// However, with truncating division, the fact that the remainder can be either
// positive or negative means that we actually have 2|b| + 1 possibilities.
//
// Flooring division improves on this situation in that if we fix a divisor b,
// there are |b| possibilities for the remainder, as we wanted. However, as we
// have seen, this remainder can be negative.
//
// It is arguably more useful to have a form of division in which the remainder
// is always nonnegative. There is in fact a form of division which satisfies
// this, and it is called Euclidean division:

// Euclidean division
function emod(x,y) {
  var yy = Math.abs(y);
  return ((x % yy) + yy) % yy;
}
function ediv(x,y) {
  return Math.sign(y) * Math.floor(x / Math.abs(y));
}

// The rounding behaviour of Euclidean division is a little more complex, in
// order to accommodate our requirement that the remainder is always positive.
// With Euclidean division, the type of rounding depends on the sign of the
// divisor. If the divisor is positive, Euclidean division rounds towards
// negative infinity. If the divisor is negative, Euclidean division rounds
// towards positive infinity.
//
// If this seems a bit overly-complicated, there is another way of
// understanding these different kinds of division, by considering the signs of
// the dividend and the divisor.
//
// * If both dividend and divisor are positive, then all three definitions
//   agree.
// * If the dividend is positive and the divisor is negative, then the
//   truncating and Euclidean definitions agree.
// * If the dividend is negative and the divisor is positive, then the flooring
//   and Euclidean definitions agree.
// * If both dividend and divisor are negative, then the truncating and
//   flooring definitions agree.

// Check that all of these satisfy the laws
function test(name, div, mod) {
  var cases = [[2,3], [-2,3], [2,-3], [-2, -3]];
  for (var i = 0; i < cases.length; i++) {
    var a = cases[i][0];
    var b = cases[i][1];

    var q = div(a,b);
    var r = mod(a,b);

    if (b * q + r !== a) {
      throw new Error(
        "While testing " + name + " division, quot/rem law was not satisfied "
        + " for a: " + a + ", b: " + b);
    }

    if (name === "Euclidean") {
      if (r < 0 || r >= Math.abs(b)) {
        throw new Error("While testing Euclidean division, got a bad remainder.");
      }
    }
  }

  console.log("Tests passed for " + name + " division");
}

test("Truncating", tdiv, tmod);
test("Flooring", fdiv, fmod);
test("Euclidean", ediv, emod);

module.exports = {
  tdiv: tdiv,
  tmod: tmod,
  fdiv: fdiv,
  fmod: fmod,
  ediv: ediv,
  emod: emod
};
