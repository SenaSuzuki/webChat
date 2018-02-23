var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res) {
    res.sendFile(__dirname + '/chat.html');
});

var userName = new Array();

io.on('connection', function(socket) {
    socket.broadcast.emit('system message', "一人入室しました")
    var id = socket.id;

    if (userName[id] == undefined) {
        socket.emit('system message', "./setName 名前　でユーザー名を設定できます");
    }

    socket.on('set name', function(name) {
        userName[id] = name;
        socket.emit('system message', "名前を設定しました" + userName[id]);
    });

    socket.on('chat message', function(msg) {
        var now = moment().format('HH:mm');
        var name;
        if (userName[id] == undefined) {
            name = "noName";
        } else
            name = userName[id];
        io.emit('chat message', now + " " + name + " " + msg);
    });

    socket.on('disconnect', function() {
        socket.broadcast.emit('system message', "一人退室しました");
    })
});



http.listen(80, function() {
    console.log('Server running...');
});