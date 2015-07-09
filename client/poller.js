var socket = io();

function startpoll (opts) {
    socket.emit('chat message', $('#m').val());
}