let username = 'Anurag'

const user = {
    firstName: 'Adarsh',
    lastName: 'Singh',
    address: {
        city: 'Banglore',
        pincode: 801105,
        state: 'Karnataka',
        moreDetails: {
            population: 8098765678904,
            area: '787 sq km',
        },

    },
    age: 15,
    isGraduate: false,
}

Object.seal(user) // is tarah se hm object ko seal kr skte hain, seal krne ke baad hm object ke properties ko delete nahi kr skte hain, but hm unki values ko change kr skte hain

Object.freeze(user) // is tarah se hm object ko freeze kr skte hain, freeze krne ke baad hm object ke properties ko delete nahi kr skte hain, aur unki values ko bhi change nahi kr skte hain



// delete user.firstName // is tarah se hm object ke properties ko delete kr skte hain, but ye recommended nahi hai, kyunki ye performance ko affect krta hai, isliye freeze aur seal ka use krte hain


// 'mobileNumber' in user // is tarah se hm check kr skte hain ki object ke andar koi property exist karti hai ya nahi, ye true return karega agar property exist karti hai, otherwise false return karega

console.log('isGraduate' in user);