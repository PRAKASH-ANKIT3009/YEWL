// 2nd way to add event listener
// const h1 = document.querySelector('h1')


// function sayHi() {
//     console.log('Hiiii');
// }


// function secondSayHi() {
//     console.log('Second Hi');
// }

// h1.onclick = sayHi
// h1.onclick = secondSayHi

// 3rd way to add event listener

// const h1 = document.querySelector('h1')


// function sayHi() {
//     console.log('Hiiii');
// }

// function secondSayHi() {
//     console.log('Second Hi');
// }

// h1.addEventListener('click', sayHi)
// // h1.addEventListener('click', function() {
// //     console.log('Second Hi');

// h1.addEventListener('click', secondSayHi)

// Add event listener to card

// const card = document.querySelector('.card')

// card.addEventListener('click', function() {
//     console.log('Card clicked');
// })

// Add event listener to add card

// const card = document.querySelector('.card')
// const container = document.querySelector('.container')

// let count = 1

// card.addEventListener('click', function() {
//     const newCard = document.createElement('div')
//     newCard.classList.add('card')
//     newCard.innerText = count++
//     container.append(newCard)
//     console.log(newCard);
// })

// We can also do the same thing by cloning the card

const card = document.querySelector('.card')
const container = document.querySelector('.container')

let count = 1

card.addEventListener('click', function() {
    const newCard = card.cloneNode()
    newCard.classList.remove('add-card')
    console.log(newCard)
    newCard.innerText = count++
    container.append(newCard)
})
