var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var r = require("random-js")();

var polls = [];

app.use(express.static('client'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});

app.get('/id/:id', function (req, res) {
    for (var i = 0; i < polls.length; i++) {
        if (req.params.id == polls[i].id) {
            res.end(polls[i].poll);
            return;
        }
    }
    
    console.log("requested id: " + req.params.id);
    res.end("Sorry, " + req.params.id + " is not a valid poll id.");
});

io.on('connection', function (socket) {
    socket.on('startpoll', function (data) {
        var id = r.string(5);
        polls.push({
            "id": id,
            "poll": data.poll
        });
        console.log("New poll: \nid: " + id + "\npoll: " + data.poll);
        socket.emit('pollinfo', {
            "id": id,
            "poll": data.poll
        });
    });
});

// replace with your own port, this was developed on c9.
var port = process.env.PORT;

server.listen(port);
console.log("Poller running on port: " + port);