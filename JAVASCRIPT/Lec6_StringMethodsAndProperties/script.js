const message = 'Hello World!'
// String ke sath agar dot(.) lagane par f aaye to iska mtlb wo method hai aur agar corresponding value aaye to iska mtlb wo property hai(eg: message.length)

const capitalMessage = message.toUpperCase()
const smallMessage = message.toLowerCase()

const faltuMessage = '        Hi, I am Ankit.       '
const finalMessage = faltuMessage.trim()
const finalMessageLowerCase = faltuMessage.toLowerCase()

// finalMessage.includes('Ankit') // gives true if Ankit is present in finalMessage otherwise gives false

// finalMessage.indexOf('Ankit') // gives the index of the first letter of Ankit if occurence of Ankit in finalMessage otherwise gives -1

const replacedMessage = finalMessage.replace('Hi', 'Hello') // replaces the first occurence of Hi with Hello, if there are multiple occurences of Hi then only the first one will be replaced

message.concat(' ',finalMessage) // concatenates message and finalMessage with a space in between

const lastFourDigits = '9996'
const maskedAccountNumber = lastFourDigits.padStart(16, '*')

// lastFourDigits.padStart(16, '*') // gives a string of length 16 as output with lastFourDigits at the end and rest of the characters are * (asterisk) at the beginning

// startFourDigits.padEnd(16, '*') // gives a string of length 16 as output with startFourDigits at the beginning and rest of the characters are * (asterisk) at the end

// 'My name is Ankit'.charAt(3) // gives the character at index 3 of the string 'My name is Ankit' which is 'n'

// 'My name is Ankit'.charCodeAt(11) // gives the unicode of the character at index 11 of the string 'My name is Ankit' which is 'A' and its unicode is 65


// 'My name is Ankit'.split('a') // gives an array of substrings by splitting the string 'My name is Ankit' at every occurence of 'a' which is 2 in this cse and the output will be
// ['My n', 'me is Ankit']


// const templateString = `Last four digit of my account number is` + ' ' + lastFourDigits
const concatenatedString = `Last four digit of my account number is`.concat(' ', lastFourDigits) // gives the same output as above

const templateString = `My account number is ${lastFourDigits.padStart(16, '*')}.`

// If you want to show '$' sign in output
const bankBalance = 987
const templateString2 = `I have $${bankBalance} in my account.`
const templateString3 = `I have ₹${bankBalance} in my account.`

const addedString = 'I have ₹' + bankBalance + ' in my account.' // gives the same output as templateString3 but template string is more readable and easier to write