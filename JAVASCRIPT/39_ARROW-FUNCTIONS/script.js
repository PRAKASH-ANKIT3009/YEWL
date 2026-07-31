// // Function Declaration

// function square(num) {
//     return num * num // num ** 2
// }

// // Function Expression

// const square = function(num) {
//     return num * num
// }

// // Arrow Function Expression

// const square =(num) => {
//     return num * num
// }

// const square =(num) =>
//     num * num

// const square =(num) => num * num // This is called as implicit(automatic) return

const add = (a, b) => a + b

// const random = () => Math.floor(Math.random() * 10) + 1

const random = () => (
    Math.floor(Math.random() * 10) + 1
)

// setTimeout(() => {
//     debugger
//     console.log('Hiii');
// }, 2000) // This is anonymous as well as arrow function
