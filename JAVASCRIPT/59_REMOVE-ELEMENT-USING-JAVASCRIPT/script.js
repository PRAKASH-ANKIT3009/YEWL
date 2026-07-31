let container = document.querySelector('.container')

let myHTML = ``

for(let i = 1; i <= 100; i++) {
    myHTML += `
    <div class="img-container">
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${i}.png">
            <p>${i}</p>
        </div> 
    `
}

container.innerHTML = myHTML

// remove child element
const myImg = document.querySelector("body > div > div:nth-child(5)")
myImg.remove() // removes the element from the DOM