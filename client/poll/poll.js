$(function() {
    var socket = io();

    var href = window.location.href;
    var id = href.split("/").pop().replace("#", "");
    
    socket.emit('getpollinfo', {"id": id});
    
    socket.on('pollinfo', function (data) {
        //if (!data || !data.poll || !data.answers || !data.id || data.id != id) return;
        
        $('.lead').html(data.poll);
        
        for (var i = 0; i < data.answers.length; i++)
            $('.answers').append('<li><a href="#" class="btn btn-success">' + data.answers[i] + '</a><span class="vote" id="' + i + '"></span></li>');
        
        console.log(data.votes);
        
        for (var i = 0; i < data.votes.length; i++)
            $("#" + i).html(data.votes[i.toString()]);
    });
    
    $('.vote').each(function (index) {
        var voteid = parseInt(this.attr('id'));
        this.onclick(function () {
            socket.emit('pollvote', {
               "id": id,
               "vote": voteid
            });
        })
    });
});