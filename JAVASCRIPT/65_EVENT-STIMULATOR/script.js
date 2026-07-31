// const addCardBtn = document.querySelector('.card')
// const container = document.querySelector('.container')

// let count = 1

// addCardBtn.addEventListener('click', () => {
//     const newCard = document.createElement('div')
//     newCard.classList.add('card')
//     newCard.innerText = count++
//     container.append(newCard)
// })

// // for(let i = 1; i <= 1000; i++) {
// //     addCardBtn.click()
// // }

// // If we want to see the click event in action

// // const intervalId = setInterval(() => {
// //     if(count > 999) {
// //         clearInterval(intervalId)
// //     }
// //     addCardBtn.click()
// // }, 100)


// Focused event

// const addCardBtn = document.querySelector('.card')
// const container = document.querySelector('.container')
// const input = document.querySelector('input')

// let count = 1

// addCardBtn.addEventListener('click', () => {
//     const newCard = document.createElement('div')
//     newCard.classList.add('card')
//     newCard.innerText = count++
//     container.append(newCard)
// })

// setTimeout(() => {
//     input.focus()
//     console.log('Input focused')
// }, 1000)

// setTimeout(() => {
//     input.blur()
//     console.log('Input blured')
// }, 3000)

// Submit event


const addCardBtn = document.querySelector('.card')
const container = document.querySelector('.container')
const input = document.querySelector('input')
const form = document.querySelector('form')


let count = 1

addCardBtn.addEventListener('click', () => {
    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.innerText = count++
    container.append(newCard)
})

setTimeout(() => {
    form.submit()
    console.log('Form Submitted');
}, 3000)