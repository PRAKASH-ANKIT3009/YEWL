const usernameInput = document.querySelector('#username')
const paragraph = document.querySelector('p')
const form = document.querySelector('form')

// usernameInput.addEventListener('click', function() {
//     console.log('Input single clicked')
// })

// usernameInput.addEventListener('dblclick', () => {
//     console.log('Input double clicked')
// })


let inputValue 

// usernameInput.addEventListener('input', (event) => {
//     console.log(event)
//     console.log(event.target.value)
//     // console.log('Input event triggered')
//     inputValue = event.target.value
//     paragraph.innerText = event.target.value
// })


// usernameInput.addEventListener('change', (event) => {
//     console.log(event)
//     console.log(event.target.value)
//     inputValue = event.target.value
//     paragraph.innerText = event.target.value
// })


// usernameInput.addEventListener('focus', (event) => {
//     // console.log(event)
//     console.log(event.type)
//     console.log(event.target.value)
//     inputValue = event.target.value
//     paragraph.innerText = event.target.value
// })


// usernameInput.addEventListener('blur', (event) => {
//     // console.log(event)
//     console.log(event.type)
//     console.log(event.target.value)
//     inputValue = event.target.value
//     paragraph.innerText = event.target.value
// })

// form.addEventListener('submit', (event) => {
//     event.preventDefault()
//     console.log(event)
// })


// form.addEventListener('submit', (event) => {
//     event.preventDefault()
//     const myFormData = new FormData(form)


//     for(const p of myFormData.entries()) {
//         console.log(p);
//     }
// })

// form.addEventListener('submit', (event) => {
//     event.preventDefault()
//     console.log('Form Submitted')  
// })

form.addEventListener('click', (event) => {
    event.preventDefault()
    console.log(event.target)
    console.log(event.currentTarget)
    console.log('Form Clicked')  
})