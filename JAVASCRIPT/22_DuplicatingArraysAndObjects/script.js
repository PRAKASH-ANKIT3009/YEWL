// const username1 = 'Anurag'
// let username2 = username1
// username2 = username2 + ' Singh'


const fruits = ['Mango', 'Apple', 'Orange']

// const myFruits = fruits

// myFruits.push('Dates')
// myFruits.push('Grapes')

// const myFruits = []
// Object.assign(myFruits, fruits) // assign krne ka ye bhi way hai

// const myFruits = [...fruits] // is tarah se ek naya array create ho gaya hai

// const myFruits = fruits // is tarah se koi naya array create nahi hota hai

// const myFruits = [].concat(fruits) // ye bhi ek way hai

// const myFruits = fruits.slice() // ye sab tarike se hm ek array ko duplicate kr skte hain

const user1 = {
    firstName: 'Anurag',
    lastName: 'Singh',
    address: {
        city: 'Delhi',
        pincode: 801105,
    },
    subject: ['Physics', 'CS', 'Maths']
}

// const user2 = user1

// user2.lastName = 'Pandey'

// user1.firstName = 'Akash'
// Ye bhi ek way hai properties change krne ke

//Agar hm ek variable to dusre variable mein assign krte hai to agar hm koi change ek mein krte hai to by default dusre mein bhi change ho jata hai

// Shallow cpoy

// const user2 = {}
// Object.assign(user2, user1) // this method is also out-dated

const user2 = {...user1} // ... -> spread operator
