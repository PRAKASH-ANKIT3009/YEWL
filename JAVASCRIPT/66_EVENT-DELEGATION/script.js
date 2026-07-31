const addCardBtn = document.querySelector('.add-card')
const container = document.querySelector('.container')

const cardsList = document.querySelector('.card')

let count = 1

addCardBtn.addEventListener('click', () => {
    const newCard = document.createElement('div')
    newCard.classList.add('card')
    newCard.innerText = count++
    container.append(newCard)
})

container.addEventListener('click', (event) => {
    if(event.target != container) {
        event.target.remove()
    }
})
