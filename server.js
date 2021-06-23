const express = require('express');
const app = express();
const http = require('http');
const { ExpressPeerServer } = require('peer');
const { v4: uuidv4 } = require('uuid');
const server = http.Server(app);
const io = require('socket.io')(server);

// peer server estabilished
const peerServer = ExpressPeerServer(server, {
    debug: true
});
app.set('view engine', 'ejs');

app.use(express.static('public'));

// peer server route
app.use('/peerjs', peerServer);

app.get('/', (req, res) => {
    // res.status(200).send('Hello World');
    res.redirect(`/${uuidv4()}`);
});

app.get('/:room', (req, res) => {
    // res.status(200).send('Hello World');
    res.render('room', { roomId: req.params.room });
});

io.on('connection', socket => {
    socket.on('join-room', (room_id, userId) => {
        // console.log('joined room');
        // join room  
        socket.join(room_id)
            // Braoadcast message to the group that user connected
        socket.to(room_id).broadcast.emit("user-connected", userId);

        socket.on('message', message => {
            io.to(room_id).emit("create_message", message)
        })
    })
})

server.listen(process.env.PORT || 3030);