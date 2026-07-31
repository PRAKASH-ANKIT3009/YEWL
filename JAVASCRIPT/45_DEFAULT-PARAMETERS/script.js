// function multiply(a, b) {
//     return a * b
// }

function multiply(a, b = 1) {
    return a * b
}

// function rollADie(numberOfSides = 6) {
//     return Math.floor(Math.random() * numberOfSides) + 1
// }

function rollADie(numberOfSides) {
    if(numberOfSides === undefined) {
        numberOfSides = 6
    }
    return Math.floor(Math.random() * numberOfSides) + 1
}