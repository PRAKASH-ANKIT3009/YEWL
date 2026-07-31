const userAge = 15

const isSchoolStudent = (userAge >= 5) && (userAge <= 18)
const isCollegeStudent = (userAge >= 18) && (userAge <= 24)

const isStudent = isSchoolStudent || isCollegeStudent

const andResult = 0 && 2
const orResult = 0 || 2
 
const andResult2 = '' && 'Hello'
const orResult2 = '' || 'Hello'
 
const andResult3 = 'Hello' && null
const orResult3 = 'Hello' || null
 
const andResult4 = 'Hello' && 4 + 8
const orResult4 = 'Hello' || 4 + 8 * 3
 
const andResult5 = 'Hello' && undefined
const orResult5 = undefined || 'Hello' 

const logResult = console.log('hello')

// and mein agar pura statement true hai to last value return karega

const andResult6 = 'Hello' && console.log('hello1')
const orResult6 = undefined || console.log('hello2') 