import React from "react";
import ReactDOM from "react-dom/client";


const element = <h1>Hello Coder Army</h1>

// React.createelement("h1", null, "Hello Coder Army")
// React.createElement(null, "h1", "Hello Coder Army")

ReactDOM.createRoot(document.getElementById('root')).render(element);