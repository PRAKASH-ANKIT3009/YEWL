let firstName = 'Ankit'
let lastName = 'Prakash'
// let userIntro = 'My name is Ankit Prakash.'
let userAge = 22
let isHappy = true

// firstName = 'Akash'
firstName = 100

// userIntro = firstName
let userIntro = 
'Hi, my name is ' 
+ firstName + ' ' 
+ lastName + ' '
+ 'and I am ' 
+ userAge + ' '
+ 'years old.'

let a = undefined
let b = null

let c 
c = 'Ankur'

const hoursInADay = 24
// hoursInADay = 19


// var is totally similar as of let but having one difference and i.e., var is function scoped (means isko hm bracket ke andar declare krte hai to wo usi ke andar accessible hota hai) and let is block scoped (means isko hm bracket ke andar declare krte hai to wo usi ke andar accessible hota hai). But var ko hm kisi bhi jagah se access kr skte hai. So, var is not recommended to use in modern JavaScript.

// {
//     var friendName = 'Amit'
// }

// {
//     let sisterName = 'Amrita'
// }

// let friendIntro = 'My sister\'s name is ' + sisterName

// var a

// console.log(brotherName);

var friendName = 'Amit'

let sisterName = 'Amrita'

const brotherName = 'Zen'

// declare krne se pehle access krne par undefined aayega, kyunki var ko hoisting ke through memeory me upar le jata hai,but let ko nahi le jata hai, isliye let ko declare krne se pehle access krne par error aayega. const ke bhi case me error aata hai, kyunki const ko bhi let ki tarah hoisting ke through memeory me upar nahi le jata hai.

let खु_शी = true