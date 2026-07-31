const evenNumbers = [0, 2, 10, 4, 6, 8]


// evenNumbers.some((num) => {
//     console.log(num);
// })


// console.log(
//     evenNumbers.some((num) => {
//     console.log(num);
// }));


// evenNumbers.some((num) => {
//     return 'Anurag'
// })


// const result = evenNumbers.some((num) => {
//     debugger
//     return num % 2 == 1
// })

// const result = evenNumbers.some((num, i) => {
//     if(num % 2 === 1) {
//          console.log(i);  
//     }
//        return n % 2 === 1
// })


const result = evenNumbers.every((num) => {
    debugger
    return num % 2 === 0
})

