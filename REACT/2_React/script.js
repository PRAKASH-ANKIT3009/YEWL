

// const element = React.createElement('h1', {id: 'title'}, "Hello Indian Army");

// const element2 = React.createElement('div',null,     
//     React.createElement('div', null, "Hello"), 
//     React.createElement('div', null, "Hi"));


// JSX: javascript XML: Look like HTML
// Babel  works as to convert JSX --> React.creatElement() --> Create React Element(JS Object) --> Convert into Real DOM(HTML Element)
//                             Babel                      React                             ReactDOM


// <h1 id="title">Hello Indian Army</h1> --> React.createElement('h1', {id: 'title'}, "Hello Indian Army") --> {type: "h1", props: {id: "title", children: "Hello Indian Army"}} --> <h1 id="title">Hello Indian Army</h1>
// const element = React.createElement('h1', {id: 'title'}, "Hello Indian Army");

// const element = <h1 id="title" className="first">Hello Indian Army</h1>;
// console.log(element);


// const element2 = (<div>
//     <h1>Hello</h1>
//     <h2>hi</h2>
// </div>);

// React.createElement('div', null, 
//     React.createElement("h1", null, "Hello Coder Army"),
//     React.createElement("h2", null, "Kaise ho")
// )


// React Element same as of above
// const element3 = (
//     <div>
//         <h1>Hello Coder Army</h1>
//         <h2>Kaise ho</h2>
//     </div>
// )


// React Component

// function App() {

//     return (
//         <h1>Hello Coder Army</h1>
//     )
// }


// const a = App();
// // const a = <App/>;


// const root = ReactDOM.createRoot(document.getElementById('root'));

// root.render(element);
// root.render(element3); // Calling React Element


// root.render(a);
// root.render(App());
// root.render(<App/>);
// root.render(<h1>Hello Coder Army</h1>);


// Kya main argument pass kr sakta hu

// function App(name) {

//     return (
//         <h1>Hello Coder Army {name}</h1>
//     )
// }

// const a = App("Ankit");
// text / element: Javascript ka expression aap iske andar likh sakte hain
// Number, string, true, false, null, undefined, array, object

// Number, string, array
// true, false, null, undefined (render honge lekin kuch display nahi hoga)
// Object: Error
// const element = <h1>Hello Coder {[10, 20, 30, 40]}</h1> // array

// const element = <h1>Hello Coder {{name:"Ankit", age: 30}}</h1> // object: error dega

// const age = 12;
// const element = <h1>Hello Coder {age > 10 ? "Adult": "Kid"}</h1> 


// const age = 12;
// const isLoggedIn = true;
// const element = <h1>Hello Coder {isLoggedIn ? <h2>Logged In</h2> : <h2>Kindly Signed In</h2>}</h1> 


// React.createElement("ul", null, [React.createElement("ul", null, <li>HTML</li>), [React.createElement("ul", null, <li>CSS</li>)])

// const courses = ["HTML", "CSS", "Javascript", "React"];
// // [<li>HTML</li>, <li>CSS</li>, <li>Javascript</li>, <li>React</li>]
// const element = (
//     <ul>
//     {courses.map(courses => <li>{courses}</li>)}
//     </ul>
// )


// const ab = {backgroundColor: "orange", color: "white"}
// const element = <h1 id="title" className="first" style={{backgroundColor: "orange", color: "white"}} >Hello Coder Army</h1>

// function App(props){

//     return (
//         <h1>Hello Coder Army {props.name} {props.age}</h1>
//     )
// }

// {
//     name="Rohit",
//     age:30
// }


// React.createElement("App")
// const element = <App name="Rohit" age={30}></App>


function Header(props) {

    return (
        <h1>{name} Welcome to Indian Election Commission Website</h1>
    )
}

// const props = {
//     name:"Ankit"
// }

// const {name} = props;

function Main({user}) {

    return (
        <>
        <h2>Hi {user.name}</h2>
        <h3>{user.age > 18 ? "You are eligible for vote": "You are not eligible for vote"}</h3>
        <p>Your city is {user.city}</p>
        </>

    )
}

function Footer() {

    return (
        <h3>Thanks for visiting our website</h3>
    )
}

// function Card() {

// }

function App(){

    return (
        <>
            <Header name="Ankit"></Header>
            <Main user={{name:"Ankit", age:30, city:"Sasaram"}}></Main>
            <Footer/>
        </>
        
    )
}


const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(<App/>);