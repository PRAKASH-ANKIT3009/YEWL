const h1 = document.querySelector('h1')
const paragraph = document.querySelector('p')

// console.log(paragraph.innerHTML);

// paragraph.innerHTML = '<h4>Hii</h4>'

h1.style.color = 'hotpink'
h1.style.backgroundColor = 'skyblue'


const allAnchorTags = document.querySelectorAll('a')
// for(let i = 0; i < allAnchorTags.length; i++) {
//     allAnchorTags[i].style.color = 'teal'
// }


for(const link of allAnchorTags) {
    // link.style.color = 'teal'
    // link.style.textDecorationLine = 'none'
    // link.style.fontWeight = '700'
    // link.style.fontFamily = 'cursive'
    // link.style.fontSize = '18px'

    // link.style.cssText = `
    //    color: teal;
    //    text-decoration-line: none;
    //    font-weight: 700;
    //    font-family: cursive;
    //    font-size: 18px;
    // `

    // link.className = 'my-link green-link'
    // link.setAttribute('class', 'green-link')

    link.classList.add('green-link')
    link.classList.remove('my-link')
    // link.classList.toggle('my-link')

    // document.querySelector("#hii").classList.add('hidden')
    // document.querySelector("#hii").classList.remove('hidden')
}

const firstLink = document.querySelector("body > p:nth-child(5) > a.hii.hello.green-link")

