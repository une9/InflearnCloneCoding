// let x = 1;

// function f(a) {
//     return x + a;
// }

// function g() {
//     let x = 2;
//     return f(0);
// }

// console.log(g());


let x = { b: 1 };
let y = { b: 2 };

function h(z) {
    return z.a;
}

x.a = 3;
y.a = 4;

console.log(h(x))
console.log(h(y))