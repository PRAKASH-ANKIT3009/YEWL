// Function Definition
//  function introduceMe(username = 'Procoddr')
    function introduceMe(username, userProfession, userAge) {
    // if(!username) {
    //     username= 'Procddr'
    // } // this is sames as of default parameter
    // console.log(typeof username);
    // console.log(typeof userProfession);
    // console.log(typeof userAge);
    console.log('Hi,');
    console.log(`My name is ${username || 'Procoddr'}.`);
    console.log(`I am a ${userProfession || 'Web Developer'}.`);
    console.log(`I am ${userAge} years old.`);
    // return true
    // return 787
    // return 'I am Anurag'
}

// const returnValue = introduceMe()

// introduceMe('Anurag', 'Software Engineer', 23)
// introduceMe('Akash', 'Mechanical Engineer', 27)
