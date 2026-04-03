const userName = prompt('Please enter your name:') || ('Ankit');
const userAge = parseInt(prompt('Please enter your age:')) || 21;

// prompt se jo bhi input jata hai wo string ke form mein jata hai

// const userName = 'Akash'
// const userAge = 23
debugger
console.log(`Name: ${userName}`);
console.log(`Age: ${userAge}`);

if(userAge >= 0 && userAge <= 4) 
{
    console.log(`${userName} is a kid.`);
    console.log('And he/she is playing.');
} 
if(userAge >= 5 && userAge <= 17) 
{
    console.log(`${userName} is a school student.`);
    console.log('And he/she is learning science and maths.');
} 
if(userAge >= 18 && userAge <= 24) 
{
    console.log(`${userName} is a college student.`);
    console.log('And he/she is learning computer science.');
} 
if(userAge >= 25 && userAge <= 45) 
{
    console.log(`${userName} is a working professional.`);
    console.log('And he/she is a web developer.');
}
if(userAge > 45) 
{
    console.log(`${userName} is  retired.`);
    console.log('And he/she reads newspaper.');
}

console.log('Program Ended!!');