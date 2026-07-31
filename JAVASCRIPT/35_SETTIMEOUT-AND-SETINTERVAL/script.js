// setTimeout('hiiii') // setTimeout() converts the string into javascript code, make  and executes it after the specified time (in milliseconds). In this case, it will execute the string 'hiiii' as JavaScript code, which will not produce any output or effect.

// setTimeout('console.log("Hi"); console.log("I am  Ankit Prakash");', 2000) // gives Ankit Prakash as output and it will be printed after 2 seconds (2000 miliseconds) because setTimeout() executes the code after the specified time.


// setTimeout(`
//     console.log("Hi") 
//     console.log("I am  Ankit Prakash")`, 
//     2000)

// setTimeout(`console.log("Hii")`, 2000)


// const timer1 = setTimeout(`console.log("Hii-1")`, 1000)
// const timer2 = setTimeout(`console.log("Hii-2")`, 2000)
// // const timer3 = setTimeout(`console.log("Hii-3")`, 3000)
// const timer3 = setTimeout(a, 3000)
// const timer4 = setTimeout(a, 3000, 'sdf', 22, 'ujn', [1, 2]) // ye sab kuch argument mein chala jaayega, aur a function ke andar arguments object mein mil jaayega.


// clearTimeout(timer2)

// function a() {
//     // console.log(arguments); // arguments bilkul array ki tarah hota hai, lekin ye ek object hota hai. Isme humare pass timer4 ke arguments mil jaayenge

//     // console.log(arguments[2])
//     console.log('Hello World!!');
// }
 
// console.log('kjhghjkjh;jhgh;hjhghjhj');


// const timer1 = setInterval(`console.log("Hii-1")`, 1000)
// const timer4 = setInterval(a, 3000, 'sdf', 22, 'ujn', [1, 2])

// setInterval() bhi setTimeout() ki tarah hi hota hai, lekin ye code ko baar baar execute karta hai, jab tak hum ise clear nahi kar dete aur setTimeout() ek baar code ko execute karta hai

// clearInterval(timer4) // ye timer4 ko clear kar dega, aur timer4 ke andar jo bhi code hai wo execute nahi hoga. Isse hum setInterval() ko rok sakte hain.


setTimeout(function() {
    console.log('Hi-1');
}, 0) // called as asynchronous code

console.log('Hi-2');  // called as synchronous code
// output as Hi-2
// Hi-1

 