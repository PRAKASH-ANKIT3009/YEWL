const nums1 = [1, 2, 3, 4]

// function add() {
//     console.log(arguments);
//     let sum = 0
//     for(let i = 0; i < arguments.length; i++) {
//         sum += arguments[i]
//     }
//     return sum
// }


// function add(...nums) {
//     console.log('nums:', nums);
//     let sum = 0
//     for(let i = 0; i < nums.length; i++) {
//         sum += nums[i]
//     }
//     return sum
// }

// const result = add(...nums1)

// function add(a, b, c,  ...nums) {
//     console.log(a, b, c);
//     console.log('nums:', nums);
//     // let sum = 0
//     // for(let i = 0; i < nums.length; i++) {
//     //     sum += nums[i]
//     // }
//     // return sum
// }


function add(a, b, c,  ...nums) { // rest params must be the last parameter
    return nums.reduce((acc, curr) => acc + curr)
}

// function add() {
//     return [...arguments].reduce((acc, curr) => acc + curr)
// }

// function add() {
//     return Array.from(arguments).reduce((acc, curr) => acc + curr)
// }

const result = add(...nums1) // spread operator to pass array element as individual argument to the function