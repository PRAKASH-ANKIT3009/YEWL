const colors = ['red', 'green', 'yellow', 'pink', 'black', 'white']

// const color1 = colors[0]
// const color2 = colors[1]
// const color3 = colors[2]

// const [color1, color2, color3, o, i] = colors

// const [,,,color3] = colors

const {3: color4, 5: color6} = colors

const user = {
    name: 'Anurag',
    age: 25,
    address: {
        city: 'Banglore',
        state: 'Karnataka',
    },
}

// const name = user.name
// const age = user.age 

const {name, age} = user
// const {name: username, age: userAge} = user

// const {address: {city}} = user

// const {address} = user
// const {city} = address


// function intro(userObj) {
//     console.log(userObj);
// }

// intro(user)

// function intro({age, name}) {
//     console.log(age, name);
// }

// intro(user)

// function printColor(colorsArray) {
//     console.log(colorsArray);
// }

// printColor(colors)


// function printColor([a, b,,g]) {
//     console.log([a, b, g]);
// }

// printColor(colors)


function printColor({4: color5}) {
    console.log(color5);
}

printColor(colors)



