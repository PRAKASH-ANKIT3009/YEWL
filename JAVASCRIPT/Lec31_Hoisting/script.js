debugger

console.log(a);

// const  username = 'Anurag' // gives an error as Cannot access 'username' before initialization, const wala bhi hoist hota hai pr hm usko access nhi kr pate hain wo temporal dead zone me chala jaata hai

// let a = 'Anurag' // same as of const

var a = 'Anurag' // yaha pe variable hoist ho gaya hai, hoist means declare krne se pehle variable ko access krna aur access krne pr koi error na dena ko hoist kehte hain

hi()

// Function Definition
// Function Declaration

function hi() {
    console.log('Hello World');
} // this function is properly hoisted

sayHi()

// Function Definition
// Function Expression

// Another way to create a function
const sayHi = function() {
    console.log('Hiii');
}
// Function Expression mein hoist nhi hota hai error deta hai jb hm hoist krne ka koshish krte hain tb

// function() {
//     console.log('Hiii');
// } // bina naam wale function ko anonymous function kehte hain