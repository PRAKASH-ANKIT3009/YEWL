const nums1 = [1, 2, 3, 4]
const nums2 = [5, 6, 7, 8, 9, 10]

// const joinedArray = nums1.concat(nums2)

// const joinedArray = {...nums1, ...nums2}

// const myName = 'Ankit'

// const joinedArray = [...nums1, ...nums2, ...myName]

// const user = {
//     name: 'Ankit',
//     age: 21,
// }

// const updatedUser = {...user}

// const updatedUser = {...user, city: 'Banglore'}

function add() {
    console.log(arguments);
    let sum = 0
    for(let i = 0; i < arguments.length; i++) {
        sum += arguments[i]
    }
    return sum
}

// const joinedArray = [...nums1, ...nums2]

const joinedArray = [...nums1, ...nums2, 10, 11, 12]