// function add(a, b) {
//     console.log(arguments);
//     return a + b
// }


// function add() {
//     console.log(arguments[0]);
//     console.log(arguments[1]);
//     console.log(arguments[2]);
//     console.log(arguments[3]);
// }

// const add = (...nums) => {
//     let sum = 0
//     for(let i = 0; i < nums.length; i++) {
//     sum += nums[i];
//     }
//     return sum
// }


const add = function () {
    let sum = 0
    for(let i = 0; i < arguments.length; i++) {
    sum += arguments[i];
    }
    return sum
}