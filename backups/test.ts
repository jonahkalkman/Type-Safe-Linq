// class Int {
//     value: number
  
//     constructor() {
//       this.value = 0
//     }
  
//     incr() {
//       this.value = this.value + 1
//     }
// }
  
// class EvenCounter {
//     number: Int

//     constructor() {
//         this.number = new Int()
//     }

//     tick() : void {
//         this.number.incr()
//         this.number.incr()
//     }
// }

// class RegularCounter {
//     number: Int

//     constructor() {
//         this.number = new Int()
//     }

//     tick() : void {
//         this.number.incr()
//         this.number.incr()
//     }
// }

// export let main = function() {
//     let ec = new EvenCounter()
//     console.log(ec)
// }



let foo1 = 123;
let foo2 = 123
if (true) {
    let foo2 = 456;
}
console.log(foo2); // 123