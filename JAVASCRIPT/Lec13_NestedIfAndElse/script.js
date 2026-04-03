const userName = 'Atul'
const userAge = 19
// console.log(`Name: ${userName}`);
// console.log(`Age: ${userAge}`);


if(userName) {
    console.log(`Name: ${userName}`);
}
if(userAge) {
    console.log(`Age: ${userAge}`);
}

debugger

if(userAge >= 0 && userAge <= 4) {
    console.log(`${userName} is a kid.`);
    console.log('And he/she is playing.');
} else if(userAge >= 5 && userAge <= 17) {
    console.log(`${userName} is a school student.`);
    console.log('And he/she is learning science and maths.');
} else if(userAge >= 18 && userAge <= 24) {
    console.log(`${userName} is a college student.`);
    console.log('And he/she is learning computer science.');
    if(userAge >= 20) {
        console.log('He is above 19.');
    } else {
        console.log('He is below 20.');
        if(userName.length > 5) {
            console.log('Username has length greater than 5.');
        } else {
            console.log('username is very short.');
        }
    }
} else if(userAge >= 25 && userAge <= 45) {
    console.log(`${userName} is a working professional.`);
    console.log('And he/she is a web developer.');
} else if (userAge > 45 && userAge < 121) {
    console.log(`${userName} is  retired.`);
    console.log('And he/she reads newspaper.');
} else if (userAge >= 121) {
    console.log(`${userName} is  immortal.`);
    console.log('And he/she sleeps everytime.');
} else if (userAge < 0) {
    console.log('Please enter a valid age.');
}

console.log('Program Ended!!');