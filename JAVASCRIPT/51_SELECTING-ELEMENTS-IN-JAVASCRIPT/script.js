// const allImages = document.images // ye wala aise array mein convert ho jaayega
// const allImages = [...document.images]

// const allImages = document.getElementsByTagName('img')

// const cssImage = document.getElementsByClassName('css-image')[0]

// const cssImage = document.getElementById('css-image')

// const cssImage = document.querySelector('.css-image') // use for one image

// const cssImage = document.querySelectorAll('#css-image')
// use for multiple images

// const jsImage = document.querySelector('.js-image')

// const jsImage = document.querySelector('[alt="JavaScript-framework"]')

// jsImage.src = 'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg'

// const li = document.querySelector('ul li')

// const li = document.querySelectorAll('ul li')

const ul = document.querySelector('ul')

const allImages = document.querySelectorAll('img')

const imageInsideUl = ul.querySelector('.css-image')

const imagesUrl = [
    'https://thumbs.dreamstime.com/b/beautiful-rain-forest-ang-ka-nature-trail-doi-inthanon-national-park-thailand-36703721.jpg',

    'https://img.freepik.com/free-photo/waterfall-chae-son-national-park-lampang-thailand_554837-639.jpg',
    
    'https://media.istockphoto.com/id/485371557/photo/twilight-at-spirit-island.jpg?s=612x612&w=0&k=20&c=FSGliJ4EKFP70Yjpzso0HfRR4WwflC6GKfl4F3Hj7fk=',
]


// allImages[0].src = imagesUrl[0]
// allImages[1].src = imagesUrl[1]
// allImages[2].src = imagesUrl[2]

// for(let i = 0; i < allImages.length; i++) {
//      allImages[i].src = imagesUrl[i]
// }

allImages.forEach((image, i) => {
    image.src = imagesUrl[i]
})
