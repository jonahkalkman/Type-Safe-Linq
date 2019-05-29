"use strict";
let Fun = function (f) {
    return {
        f: f,
        then: function (g) {
            return then(this, g);
        }
    };
};
let then = function (f, g) {
    return Fun(a => g.f(f.f(a)));
};
// let incr = Fun<number,number>(x => x + 1)
// let double = Fun<number,number>(x => x * 2)
// let negate= Fun<boolean,boolean>(x => !x)
// let is_even = Fun<number,boolean>(x => x % 2 == 0)
// let incr_twice = incr.then(incr)
// let double_twice = double.then(double)
// let incr_then_double = incr.then(double)
// let my_f = incr.then(is_even)
// // let id = function<a>() : Fun<a,a>(x => x)
// console.log(incr_twice.f(3))
// console.log(double_twice.f(5))
// console.log(incr.f(2))
// type Fun<a,b> = { f:(i:a) => b }
// let Fun = function<a,b>(f:(_:a) => b) : Fun<a, b> { return { f:f } }
// console.log(double)
let incr = Fun((x) => x + 1);
let double = Fun((x) => x * 2);
let square = Fun((x) => x * x);
let isPositive = Fun((x) => x > 0);
let isEven = Fun((x) => x % 2 == 0);
let invert = Fun((x) => -x);
let squareRoot = Fun((x) => Math.sqrt(x));
let ifThenElse = function (p, _then, _else) {
    return Fun((x) => {
        if (p.f(x)) {
            return _then.f(x);
        }
        else {
            return _else.f(x);
        }
    });
};
let incrCheckPos = incr.f(0);
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
