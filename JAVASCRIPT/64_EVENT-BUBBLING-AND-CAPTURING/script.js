const green = document.querySelector('.green')
const pink = document.querySelector('.pink')
const blue = document.querySelector('.blue')


// window.addEventListener('click', (e) => {
//     // e.stopPropagation() -> to stop event bubbling and event capturing till where we applied it
//     console.log('6.Window Event Listener')
// })
    

// document.addEventListener('click', (e) => {
//     console.log('5.Document Event Listener')
// })


// document.body.addEventListener('click', (e) => {
//     console.log('4.Body Event Listener')
// })


// green.addEventListener('click', (e) => {
//     console.log('3.Green Event Listener')
// })


// pink.addEventListener('click', (e) => {
// console.log('2.Pink Event Listener')
// })


// blue.addEventListener('click', (e) => {
//     e.stopPropagation()
//     console.log('1.Blue Event Listener')
// })


// Event Capturing

// By default capture is false, so we need to set it to true to enable event capturing

// window.addEventListener('click', (e) => {
//     e.stopPropagation()
//     console.log('6.Window Event Listener')
// }, {capture: true})


// document.addEventListener('click', (e) => {
//     console.log('5.Document Event Listener')
// }, {capture: true})


// document.body.addEventListener('click', (e) => {
//     console.log('4.Body Event Listener')
// }, {capture: true})


// green.addEventListener('click', (e) => {
//     console.log('3.Green Event Listener')
// }, {capture: true})


// pink.addEventListener('click', (e) => {
// console.log('2.Pink Event Listener')
// }, {capture: true})


// blue.addEventListener('click', (e) => {
//     e.stopPropagation()
//     console.log('1.Blue Event Listener')
// }, {capture: true})

// Another property 

blue.addEventListener('click', (e) => {
    console.log('1.Blue Event Listener');
}, {once: true})
