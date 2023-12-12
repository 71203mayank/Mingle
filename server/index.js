const express = require('express');
const cors = require('cors');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
    }
});

app.use(cors());

app.route('/').get((req, res) => {
    res.send({ response: 'Server is up and running.' }).status(200);
});

const PORT = process.env.PORT || 8000;

const roomUsers = new Map();

app.route('/:roomId').get((req, res) => {
    res.send({ users: roomUsers.get(req.params.roomId) });
})


io.on('connection', (socket) => {
    console.log(`${socket.id} connected`);
    // io.to(socket.id).emit('user--connect', { id: socket.id })

    socket.on('room--join', ({ roomId, username }) => {
        console.log(`${username} joined ${roomId}`)
        socket.join(roomId);
        socket.room = roomId;
        socket.usrname = username;
        const users = roomUsers.get(roomId) || [];
        io.to(socket.id).emit('room--info', users);
        users.push({ id: socket.id, username })
        roomUsers.set(roomId, users);
    })

    socket.on('disconnect', () => {
        console.log(`${socket.id} left`);
        if (socket.room) {
            io.to(socket.room).emit('user--disconnect', { id: socket.id });
            if (roomUsers.get(socket.room)?.length === 1)
                roomUsers.delete(socket.room);
            else
                roomUsers.set(socket.room, roomUsers.get(socket.room).filter(({ id }) => id !== socket.id));
        }
    })

    socket.on('user--call', ({ userToCall, signalData, name }) => {
        console.log(`${socket.id} is calling ${userToCall}`);
        io.to(userToCall).emit('user--incoming', { signal: signalData, from: socket.id, name });
    });

    socket.on('room--leave', () => {
        socket.leave(socket.room);
        socket.to(socket.room).emit('user--disconnect', { id: socket.id });
        if (roomUsers.get(socket.room)?.length === 1)
            roomUsers.delete(socket.room);
        else
            roomUsers.set(socket.room, roomUsers.get(socket.room).filter(({ id }) => id !== socket.id));
        socket.room = null;
    })

    socket.on('user--answer', ({ signal, to }) => {
        console.log(`${socket.id} answered ${to}`)
        io.to(to).emit('user--accept', { signal, answerId: socket.id });
    })
})



server.listen(PORT, () => console.log(`Server running on port ${PORT}`));