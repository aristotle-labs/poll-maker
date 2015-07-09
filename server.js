var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

var invalid = [
    "favicon.ico"
];

app.get('/:id', function (req, res) {
    for (var i = 0; i < invalid.length; i++) {
        if (invalid[i] == req.params.id) {
            return;
        }
    }
    
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