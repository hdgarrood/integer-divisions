// Truncating division
function tdiv(x,y) {
  return x / y | 0;
}
function tmod(x,y) {
  return x % y;
}

// Flooring/Knuthian division
function fdiv(x,y) {
  return Math.floor(x/y);
}
function fmod(x,y) {
  return ((x % y) + y) % y;
}

// Euclidean division
function emod(x,y) {
  var yy = Math.abs(y);
  return ((x % yy) + yy) % yy;
}
function ediv(x,y) {
  return Math.sign(y) * Math.floor(x / Math.abs(y));
}

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
