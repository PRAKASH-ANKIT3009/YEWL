console.log('Hi-1');

function hello() {
    console.log('Hello World');
}

for(let i = 1; i <= 4; i++) {
    console.log(i);
}


// setTimeout(function() {
//     console.log('Hi-3');
// }, 0)

setTimeout(hello, 8000)

console.log('Hi-2');

// Jo code directly call stack mein jata hai usko hum synchronous code kehte hain. Jaise ki console.log('Hi-1'), console.log('Hi-2') aur for loop. Ye sab direct call stack mein jate hain aur execute hote hain.

// Jo code setTimeout ke andar likha hai, wo asynchronous code hai. Ye code call stack mein nahi jata, balki Web API ke paas chala jata hai. Web API usko timer ke saath set kar deta hai. Jab timer khatam ho jata hai, tab wo callback queue mein chala jata hai. Jab call stack khali hota hai, tab callback queue se wo function call stack mein jaata hai by the help of event loopaur execute hota hai. Isliye 'Hi-3' sabse last mein print hota hai, chahe setTimeout ka time 0 ho.