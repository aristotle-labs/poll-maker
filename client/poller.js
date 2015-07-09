$(function() {
    var socket = io();

    function startpoll (opts) {
        socket.emit('startpoll', 
            {
                "poll": opts.poll,
                "answers": opts.answers
            }
        );
    }
    
    $('.createpoll').click(function () {
        $('#createPollModal').modal('show');
    });
    
    $('#start-poll').click(function () {
        var answers = $("#poll-answers").val().split("\n");
        
        if ($("#poll-answers").val() == "" || $("#poll-title").val() == "") return;
        
        startpoll({
            "poll": $("#poll-title").val(),
            "answers": answers
        });
    });
    
    socket.on('pollinfo', function (data) {
        window.location.href = "/id/" + data.id;
    });
});