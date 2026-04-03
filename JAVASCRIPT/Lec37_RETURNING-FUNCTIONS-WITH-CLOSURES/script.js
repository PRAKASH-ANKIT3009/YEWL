const a = 4
const b = 6

// function add() {
//     console.log(a + b);
// }

// add()

// console.dir(add)

function parent() {
    function add() {
        console.log(a + b);
    }
    return add
}

const add1 = parent()

console.dir(add1);