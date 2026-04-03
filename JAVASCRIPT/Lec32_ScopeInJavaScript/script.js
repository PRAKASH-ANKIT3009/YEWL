const username = 'Anurag'
let userAge = 25
var a = 50

function add() {
    debugger
    const username = 'Akash'
    const x = 5
    const y = 8
    console.log(x + y);
    console.log(username);
}
function subtract() {
    const x = 18
    const y = 15
    console.log(x - y);
    console.log(username);
}

// console.log(y); // gives error because y is defined at inside function

add()

subtract()

console.log('Program Ended');