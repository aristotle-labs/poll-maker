$(function() {
    var socket = io();

    var href = window.location.href;
    var id = href.split("/").pop().replace("#", "");
    
    $('.loading').html("Loading.");
    
    window.vote = function (answer) {
        socket.emit('pollvote', {
           "id": id,
           "vote": answer
        });
    };
    
    socket.emit('getpollinfo', {"id": id});
    
    socket.on('pollinfoupdate', function (data) {
        if (!data || !data.poll || !data.answers || !data.id || data.id != id) return;
        
        $('.lead').html(data.poll);
        
        $('.answers').html("");
        
        // color and a darker version of that color
        var rainbow = [
            ["#c72d2d", "#b02929"], // red
            ["#007694", "#056781"], // blue
            ["#6cc214", "#5ea516"], // green
            ["#e36700", "#ce6106"], // orange
            ["#8020e5", "#701cc9"]  // purple
        ];
        
        var color = 0;
        for (var i = 0; i < data.answers.length; i++) {
            if (!(data.answers[i].answer == '' || /^\s+$/.test(data.answers[i].answer))) {
                if (color == rainbow.length) color = 0;
                
                $('.answers').append(
                    '<tr onclick = "vote(' + i + ')" style="background-color:' + rainbow[color][0] + '">' + 
                        '<td>' + data.answers[i].answer + '</td>' +
                        '<td style="background-color:' + rainbow[color][1] + '">' + data.answers[i].votes + ' votes.</td>'+
                    '</tr>'
                );
                
                color++;
            }
        }
        
        console.log(data);
        
        $('.loading').html('');
        $('.spinner').hide();
        
        $('#sharelink')
            .click(function () {
                $(this).select();
            })
            .keydown(function () {
                return false
            });
        $('#sharelink').val(window.location.href);
    });
});