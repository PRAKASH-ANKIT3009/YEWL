function a(b) {
    // console.log(typeof b);
    console.dir(b);

    b()
}

// a('Hiii')
// a({username: 'anurag', userAge: 50})
// a([1, 7, 9, 8])


// console.dir('Hiuytrfgh');
// console.dir(987678);
// console.dir(a);

// a.age = 87

function sayHi (){
    console.log('Hiiiiii');
}

const x = sayHi

// sayHi()
// x() // both will same 

x.age = 76

// a(sayHi)
// a('kjhghj')

sayHi() // same as of sayHi ()


// callback function -> Agar kisi function ke argument me hum ek function pass karte hai to usse callback function kehte hai aur jo function mein hm callback function ko pass karte hai usse higher order function kehte hai.

a(function sayHi (){
    console.log('Hiiiiiiiiiiiiiiiiiii');
}) // This is called as Anonymous function because it does not have any name and we are passing it as an argument to the function a() and it will be executed when the function a() is called.
