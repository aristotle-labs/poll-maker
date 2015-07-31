var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var r = require("random-js")();
var get_ip = require('ipware')().get_ip;

var polls = {};
var voted = {};

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
    res.redirect("/");
});

io.sockets.on('connection', function (socket) {
    var ip = socket.handshake.address;

     console.log(ip);
    
    socket.on('startpoll', function (data) {
        if (!data || !data.poll || !data.answers) return;
        
        var poll = data.poll;
        var filter = poll.replace(/^\s+/, '').replace(/\s+$/, '');
        if (filter == '') return;
        
        data.poll = data.poll.replace('<', '&lt;');
        data.poll = data.poll.replace('>', '&gt;');
        
        for (var i = 0; i < data.answers.length; i++) {
            var answer = data.answers[i].answer;
            answer = answer.split("<").join("");
            answer = answer.split(">").join("");
            data.answers[i].answer = answer;
            
            //console.log(data);
        }
        
        var id = r.string(5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        
        while (polls[id]) {
            id = r.string(5, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
        }
        
        polls[id] = {
            "id": id,
            "poll": data.poll,
            "answers": data.answers
        };
        
        console.log("New poll: \nid: " + id + "\npoll: " + data.poll);
        
        socket.emit('pollinfo', polls[id]);
    });
    
    socket.on('getpollinfo', function (data) {
        if (!data || !data.id) return;
        
        socket.emit('pollinfoupdate', polls[data.id]);
    });
    
    socket.on('pollvote', function (data) {
        if (!data || !data.id || data.vote == null || data.vote == undefined || !polls[data.id]) return;
        
        if (typeof data.vote != "number") return;
        
        if (!voted[data.id]) voted[data.id] = [];
        
        for (var i = 0; i < voted[data.id].length; i++) {
            if (voted[data.id][i] == ip) {
                console.log(ip + " already voted.");
                return;
            }
        }
        
        polls[data.id].answers[data.vote].votes++;
        
        voted[data.id].push(ip);
            
        io.emit('pollinfoupdate', polls[data.id]);
        
        console.log(polls[data.id].answers[data.vote].votes);
    });
});

// replace with your own port, this was developed on c9.
var port = 3000;

server.listen(port);
console.log("Poller running on port: " + port);
