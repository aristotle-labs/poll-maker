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
        var _answers = [];
        
        for (var i = 0; i < answers.length; i++) {
            _answers.push({"answer": answers[i], "votes": 0});
        }
        
        answers = _answers;
        
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