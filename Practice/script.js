// create a element using js

// const element1 = document.createElement('h1');
// element1.textContent = "Hello Coder Army";
// element1.className = 'element';
// element1.id = 'first';
// element1.style.fontSize = "30px";
// element1.style.backgroundColor = 'pink';
// element1.style.color = 'green';


// const element2 = document.createElement('h2');
// element2.textContent = "Poor are great";
// element2.className = 'element';
// element2.id = 'second';
// element2.style.fontSize = "20px";
// element2.style.backgroundColor = 'yellow';
// element2.style.color = 'red';

function createElement(tag, attributes, children) {

    const element = document.createElement(tag);
    element.textContent = children;

    for(const key in attributes) {

        if(key === 'style') {

            for(const key in attributes.style) {
               element.style[stylekey] = attributes.style[style.key];
            }
        }
        else {

            element[key] = attributes[key];
        }
    }

    return element;
}

const element1 = createElement(
    'h1',
    {
        className: 'element', 
        id: 'first', 
        style: {
            backgroundColor: 'red',
            color: 'white',
            fontSize: '40px'
        }
    }, 
    "Hello Coder Army"
);

const element2 = createElement(
    'h2', 
    { 
        className: 'element',
        id: 'second',
        style: {
            backgroundColor: 'yellow',
            color: 'blue',
            fontSize: '20px'
        }
    }, 
    "Hello Btech Students"
);


const root = document.getElementById('root');
root.append(element1);
root.append(element2);

