const http = require("http");

const server = http.createServer((req, res) => {
    console.log(req)
    res.end("Hello from Node.js server.Hii");
});

server.listen(3000);