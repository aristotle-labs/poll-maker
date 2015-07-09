var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static('client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html")
});

app.get('/id/:id', function (req, res) {
    console.log("requested id: " + req.params.id);
    res.end("Sorry, " + req.params.id + " is not a valid poll id.");
});

io.on('connection', function (socket) {
    socket.on('startpoll', function (msg) {
        
    })
});

// replace with your own port, this was developed on c9.
var port = process.env.PORT;

server.listen(port);
console.log("Poller running on port: " + port);