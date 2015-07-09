$(function() {
    var socket = io();

    function startpoll (opts) {
        socket.emit('startpoll', 
            {
                "poll": opts.poll
            }
        );
    }
    
    $('.createpoll').click(function () {
        if ($('#pollinfo').val() == "") {
            return;
        } else {
            startpoll({
                "poll": $('#pollinfo').val()
            });
        }
    });
    
    socket.on('pollinfo', function (data) {
        window.location.href = "/id/" + data.id;
    });
});