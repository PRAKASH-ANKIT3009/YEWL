// const a = 4
// const b = 6

// // function add() {
// //     console.log(a + b);
// // }

// // add()

// // console.dir(add)

// function parent() {
//     function add() {
//         console.log(a + b);
//     }
//     return add
// }


function outer() {
  const a = 4
  function parent() {
     const b = 6
     function add() {
       console.log(a + b);
    }
    return add
  }
  return parent()
}


const add1 = outer()

console.dir(add1);