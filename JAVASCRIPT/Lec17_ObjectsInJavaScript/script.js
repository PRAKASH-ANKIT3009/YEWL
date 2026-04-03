const myName = 'Anurag'

// const username1 = ''
// const username2 = ''
// Agar variable mein value same hoga to wo ek hi address pe point karega, memory efficient hoga

// const user1 = {}
// const user2 = {}
// user1 aur user2 alag alag address pe point karega agar dono object mein same value hoga phir bhi, memory efficient nahi hoga

const user1 = {
    firstName: 'Akash'
}

// const user2 = {
//     firstName: 'Adarsh',
//     lastName: 'Singh',
// }

// console.log(user2.lastName);
// console.log(user2['lastName']); // both are same

// const user2 = {
//     firstName: 'Adarsh',
//     'last-Name': 'Singh',
//     'Anurag': 'Developer'
// }

// console.log(user2.firstName);
// console.log(user2['last-Name']);
// console.log(user2.Anurag);
// console.log(user2[myName]);
// console.log(user2["first" + "Name"]);

const user2 = {
    firstName: 'Adarsh',
    lastName: 'Singh',
    address: {
        city: 'Banglore',
        pincode: 801105,
        state: 'Karnataka',
        moreDetails: {
            population: 8098765678904,
            area: '787 sq km',
        }

    }
}

// user2.age = 26
// user2["is-student"] = true

// Objects mein do address ko compare krte hain na uske andar ke values ko, isliye user1 aur user2 alag alag address pe point kar rahe hain, chahe unke andar same value ho

