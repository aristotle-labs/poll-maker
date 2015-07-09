var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var r = require("random-js")();

var polls = {};

app.use(express.static('client'));
app.use(express.static('client/poll'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/client/index.html");
});

app.get('/id/:id', function (req, res) {
    if (polls[req.params.id]) {
        res.sendFile(__dirname + "/client/poll/poll.html");
        return;
    }
    
    console.log("requested invalid id: " + req.params.id);
    res.redirect("/")
});

io.on('connection', function (socket) {
    socket.on('startpoll', function (data) {
        if (!data || !data.poll || !data.answers) return;
        
        var poll = data.poll;
        var filter = poll.replace(/^\s+/, '').replace(/\s+$/, '');
        if (filter == '') return;
        
        var answers = data.answers;
        for (var i = 0; i < answers.length; i++) {
            var filter2 = answers[i];
            filter2.replace(/^\s+/, '').replace(/\s+$/, '');
            
            if (filter2 == '')
                answers.splice(answers.indexOf(i), 1);
            
            if (answers.length == 0) return;
        }
        
        var id = r.string(5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        
        while (polls[id]) {
            id = r.string(5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        }
        
        polls[id] = {
            "id": id,
            "poll": data.poll,
            "answers": answers,
            "votes": {}
        };
        
        console.log("New poll: \nid: " + id + "\npoll: " + data.poll);
        
        socket.emit('pollinfo', polls[id]);
    });
    
    socket.on('getpollinfo', function (data) {
        if (!data || !data.id) return;
        
        socket.emit('pollinfo', polls[data.id]);
    });
    
    socket.on('pollvote', function (data) {
        if (!data || !data.id || data.vote || !polls[data.id]) return;
        
        if (typeof data.vote != "number") return;
        
        if (polls[data.id].votes[data.vote.toString()])
            polls[data.id].votes[data.vote.toString()]++;
        else
            polls[data.id].votes[data.vote.toString()] = 1;
            
        io.emit('pollinfo', polls[data.id]);
        
        console.log(polls[data.id].votes)
    });
});

// replace with your own port, this was developed on c9.
var port = process.env.PORT;

server.listen(port);
console.log("Poller running on port: " + port);