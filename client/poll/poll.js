$(function() {
    var socket = io();

    var href = window.location.href;
    var id = href.split("/").pop().replace("#", "");
    
    window.vote = function (answer) {
        socket.emit('pollvote', {
           "id": id,
           "vote": answer
        });
    }
    
    socket.emit('getpollinfo', {"id": id});
    
    socket.on('pollinfo', function (data) {
        //if (!data || !data.poll || !data.answers || !data.id || data.id != id) return;
        
        $('.lead').html(data.poll);
        
        $('.answers').html("");
        
        for (var i = 0; i < data.answers.length; i++)
            $('.answers').append('<li><a href="" onclick="vote(' + i + ')" class="btn btn-success">' + data.answers[i].answer + '</a><br><span>' + data.answers[i].votes + '&nbsp;votes.</span></li>');
        
        console.log(data);
    });
});