const userName = prompt('Please enter your name:') 
const userAge = parseInt(prompt('Please enter your age:')) 

// let userName = prompt('Please enter your name:') 
// let userAge = parseInt(prompt('Please enter your age:'))

// prompt se jo bhi input jata hai wo string ke form mein jata hai

// const userName = 'Akash'
// const userAge = 23

// debugger

// if(!userName) {
//     userName = 'Ankit'
// }
// if(!userAge) {
//     userAge = 21
// }

// console.log(`Name: ${userName}`);
// console.log(`Age: ${userAge}`);

if(userName) {
    console.log(`Name: ${userName}`);
}
if(userAge) {
    console.log(`Age: ${userAge}`);
}


// if(userAge >= 0 && userAge <= 4) {
//     console.log(`${userName} is a kid.`);
//     console.log('And he/she is playing.');
// } else if(userAge >= 5 && userAge <= 17) {
//     console.log(`${userName} is a school student.`);
//     console.log('And he/she is learning science and maths.');
// } else if(userAge >= 18 && userAge <= 24) {
//     console.log(`${userName} is a college student.`);
//     console.log('And he/she is learning computer science.');
// } else if(userAge >= 25 && userAge <= 45) {
//     console.log(`${userName} is a working professional.`);
//     console.log('And he/she is a web developer.');
// } else if (userAge > 45 && userAge < 121) {
//     console.log(`${userName} is  retired.`);
//     console.log('And he/she reads newspaper.');
// } else if (userAge >= 121) {
//     console.log(`${userName} is  immortal.`);
//     console.log('And he/she sleeps everytime.');
// } else if (userAge < 0) {
//     console.log('Please enter a valid age.');
// }

console.log('Program Ended!!');