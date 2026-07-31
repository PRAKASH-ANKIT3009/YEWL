// if(dayNumber === 0) {
//     console.log('It is Sunday Today');
// } else if(dayNumber === 1) {
//     console.log('It is Monday Today');
// } else if(dayNumber === 2) {
//     console.log('It is Tuesday Today');
// } else if(dayNumber === 3) {
//     console.log('It is Wednesday Today');
// } else if(dayNumber === 4) {
//     console.log('It is Thursday Today');
// } else if(dayNumber === 5) {
//     console.log('It is Friday Today');
// } else if(dayNumber === 6) {
//     console.log('It is Saturday Today.');
// } else {
//     console.log('Please enter a valid daynumber');
// }

// const dayNumber = 3

// debugger

// switch(dayNumber) {
//     case 0:
//         console.log('It is Sunday Today')
//         break
//     case 1:
//         console.log('It is Monday Today')
//         break
//     case 2:
//         console.log('It is Tuesday Today')
//         break
//     case 3:
//         console.log('It is Wednesday Today')
//         break
//     case 4:
//         console.log('It is Thursday Today')
//         break
//     case 5:
//         console.log('It is Friday Today')
//         break
//     case 6:
//         console.log("It is Saturday Today")
//         break
//     default:
//         console.log('Please enter a valid day number');
// }

// const userName = 'Anurag'
// const userAge = 24

// debugger

// switch(true) {
//     case(userAge >= 0 && userAge <= 4):
//         console.log(`${userName} is a kid.`);
//         console.log('And he/she is playing.');
//         break
//     case(userAge >= 5 && userAge <= 17):
//         console.log(`${userName} is a school student.`);
//         console.log('And he/she is learning science and maths.');
//         break
//     case (userAge >= 18 && userAge <= 24):
//         console.log(`${userName} is a college student.`);
//         console.log('And he/she is learning computer science.');
//         break
//     case (userAge >= 25 && userAge <= 45):
//         console.log(`${userName} is a working professional.`);
//         console.log('And he/she is a web developer.');
//         break
//     case (userAge > 45 && userAge < 121):
//         console.log(`${userName} is retired.`);
//         console.log('And he/she reads newspaper.');
//         break
//     case (userAge >= 121):
//         console.log(`${userName} is  immortal.`);
//         console.log('And he/she sleeps everytime.');
//         break
//     default:
//         console.log('Please enter a valid age.');
// }


// const userName = 'Anurag'
// const userAge = 24

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
//     console.log(`${userName} is retired.`);
//     console.log('And he/she reads newspaper.');
// } else if (userAge >= 121) {
//     console.log(`${userName} is  immortal.`);
//     console.log('And he/she sleeps everytime.');
// } else if (userAge < 0) {
//     console.log('Please enter a valid age.');
// }


// Here sequence of case is not important. We can write cases in any order. 
// Sitch cse Statement mein agar switch aur case strictly equal hai to hi case execute hoga. Switch case statement mein hum boolean expression bhi use kar sakte hai.
const grade = 'C'

debugger

switch(grade) {
    case 'A':
        console.log('Your score is between 85% to 100%.');
        break
    case 'B':
        console.log('Your score is between 75% to 85%.');
        break
    case 'C':
        console.log('Your score is 60% to 75%.');
        break
    case 'D':
        console.log('Your score is between 50% to 60%.');
        break
    case 'E':
        console.log('Your score is between 30% to 50%.');
        break
    default:
        console.log('Sorry, you are failed.');
}

console.log('Program Ended!!')