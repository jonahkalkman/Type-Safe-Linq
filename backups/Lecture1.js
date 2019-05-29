var Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        }
    };
};
var then = function (f, g) {
    return Fun(function (a) { return g.f(f.f(a)); });
};
var incr = Fun(function (x) { return x + 1; });
var double = Fun(function (x) { return x * 2; });
var negate = Fun(function (x) { return !x; });
var is_even = Fun(function (x) { return x % 2 == 0; });
var incr_twice = incr.then(incr);
var double_twice = double.then(double);
var incr_then_double = incr.then(double);
var my_f = incr.then(is_even);
// let id = function<a>() : Fun<a,a>(x => x)
console.log(incr_twice.f(3));
console.log(double_twice.f(5));
console.log(incr.f(2));
// type Fun<a,b> = { f:(i:a) => b }
// let Fun = function<a,b>(f:(_:a) => b) : Fun<a, b> { return { f:f } }
// console.log(double)
// let incr = Fun((x: number) => x + 1)
// let double = Fun((x: number) => x * 2)
// let square = Fun((x: number) => x * x)
// let isPositive = Fun((x: number) => x > 0)
// let isEven = Fun((x: number) => x % 2 == 0)
// let invert = Fun((x: number) => -x)
// let squareRoot = Fun((x: number) => Math.sqrt(x))
// let ifThenElse =
//   function<a, b>(p: Fun<a, boolean>, _then: Fun<a, b>, _else: Fun<a, b>) : Fun<a, b> {
//     return Fun((x: a) => {
//       if (p.f(x)) {
//         return _then.f(x)
//       }
//       else {
//         return _else.f(x)
//       }
//     })
//   }
var incrCheckPos = incr.f(0);
// let doubleCheckPos = double.then(isPositive).f(1)
// //Hulp bij vragen!
// let sqrtPos = function ifThenElse(isPositive, squareRoot, invert) {
//   return isPositive._then.squareRoot_else.invert.squareRoot.f(2)
// }
console.log(incrCheckPos);
// console.log(doubleCheckPos)
// console.log(sqrtPos)
// // NOG MAKEN!
// let repeat = function<a>(f: Fun<a, a>, n: number): Fun<a, a> {
//   if (n <= 0) {
//     //COMPLETE
//   }
//   else {
//     //COMPLETE
//   }
// }
// export let Fun2 = function <a, b>(f: (_: a) => b): Fun<a, b> {
//   return {
//     f: f,
//     then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
//       return Fun<a, c>(a => g.f(this.f(a)))},
//     repeat: function(this: Fun<a, a>): Fun<number,Fun<a, a>> {
//       //COMPLETE
//     }
//   }
// }
// //NOG MAKEN!
// let repeatUntil = function<a>(f: Fun<a, a>, predicate: Fun<a, boolean>) : Fun<a, a> {
//   let g =
//     (x: a) => {
//       if (predicate.f(x)) {
//         //COMPLETE
//       }
//       else {
//         //COMPLETE
//       }
//     }
//   return //COMPLETE
// }
// repeatUntil: function(this: Fun<a, a>): Fun<a, c> {
//   return {
//     f: this.f,
//     then: function <c>(this: Fun<a, b>, g: Fun<b, c>): Fun<a, c> {
//       return Fun<a, c>(a => g.f(this.f(a)))},
//     repeatUntil: function(this: Fun<a, a>): Fun<Fun<a, boolean>, Fun<a, a>> {
//       //COMPLETE
//     }
//   }
// }
