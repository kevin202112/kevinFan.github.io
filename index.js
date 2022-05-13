const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const showdown  = require('showdown'),
    xssFilter = require('showdown-xss-filter'),
    htmlconverter = new showdown.Converter({extensions: [xssFilter]});

io.on('connection', (socket) => {

    console.log(socket.id + "connect");

    socket.on('idGet', () => {
        socket.emit('connection', socket.id)
    });

    socket.on('message', (reciveMessage) => {
        io.emit("message", {msg : reciveMessage, from : socket.id});
    });

    socket.on('playerDataReceived', (playerData) => {
        playerData.socketid = socket.id;
        io.emit("recivePlayerData", playerData);
    });

    socket.on('disconnect', () => {
        console.log(socket.id + "disconnect");
    });
})
















app.get('/', (req, res) => {
    res.sendFile( __dirname + '/views/index.html');
});
app.use('/models', express.static(path.join(__dirname, '/views/models')));
app.use('/models/player', express.static(path.join(__dirname, '/views/models/player')));
app.use('/scripts/3d', express.static(path.join(__dirname, '/views/scripts/3d')));
app.use('/scripts/web', express.static(path.join(__dirname, '/views/scripts/web')));
app.use('/img', express.static(path.join(__dirname, '/views/img')));
app.get('/css/:id', (req, res) => {
    res.sendFile( __dirname + '/views/css/'+req.params.id);
});
app.get('/scripts/:id', (req, res) => {
    res.sendFile( __dirname + '/views/scripts/'+req.params.id);
});
app.get('/font/:id', (req, res) => {
    res.sendFile( __dirname + '/views/font/'+req.params.id);
});
server.listen(3000, () => {
    console.log("Server Started. http://localhost:3000");
});
