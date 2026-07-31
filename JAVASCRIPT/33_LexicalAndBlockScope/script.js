const username = 'Anurag'
let userAge = 25
var a = 50

// function add() {
//     const username = 'Akash'
//     const x = 5
//     const y = 8
//     console.log(x + y);
//     console.log(username);
// }
function subtract() {
    // debugger
    const x = 18
    const y = 15
    const z = 28
    console.log(x - y);
    console.log(username);

    function child() {
        // debugger 

        const childName = 'Golu'
        console.log(childName);
        console.log(x, z)

        if(true){
            const num1 = 78
            var num2 = 987
            num3 = 1000 // this will become global variable because we have not used var, let or const keyword to declare it
            console.log(num1);
            console.log(num2);
        }

        // console.log(num1); // gives error in case of const & var because they are block scoped but not in case of var because it is function scoped

        console.log(num2);

        function grandChild() {
            const grandChildName = 'Molu'
            console.log(grandChildName)
        }
        grandChild()

    }

    child()

    console.log(num3);
}

// console.log(y); // gives error because y is defined at inside function

// add()

subtract()

console.log('Program Ended');

// By writing 'use strict' at the top of the file, we can avoid creating global variables by mistake. It will throw an error if we try to create a global variable without using var, let or const keyword.