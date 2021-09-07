const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
var Filter = require('bad-words');

const { generateMessage, generateLocationMessage } = require('./utils/messages')
const { addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));

// let count = 0;
// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     socket.emit('countUpdated', count);
//     socket.on('increment', () => {
//         count++
//         //socket.emit('countUpdated', count);
//         io.emit('countUpdadted', count)
//     })
// })

// first time chnages

// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     socket.emit('message', 'Welcome!');
//     socket.on('sendMessage', (message) => {
//         io.emit('message', message)
//     })
// })


// second time changes


// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     socket.emit('message', 'Welcome!');
//     socket.broadcast.emit('message', 'A new user has joined!!')

//     socket.on('sendMessage', (message) => {
//         io.emit('message', message)
//     })

//     socket.on('sendLocation', (coords) => {
//         io.emit('message', `Location: ${coords.latitude}, ${coords.longitude}`)
//     })

//     socket.on('disconnect', () => {
//         io.emit('message', 'A user has left the App!!')
//     })
// })


// third time chnages


// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     socket.emit('message', 'Welcome!');
//     socket.broadcast.emit('message', 'A new user has joined!!')

//     socket.on('sendMessage', (message) => {
//         io.emit('message', message)
//     })

//     socket.on('sendLocation', (coords) => {
//         io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
//     })

//     socket.on('disconnect', () => {
//         io.emit('message', 'A user has left the App!!')
//     })
// })


// forth time changes



// io.on('connection', (socket) => {
//     console.log('New WebSocket connection');

//     socket.emit('message', 'Welcome!');
//     socket.broadcast.emit('message', 'A new user has joined!!')

//     socket.on('sendMessage', (message, callback) => {

//         const filter = new Filter()
//         if (filter.isProfane(message)) {
//             return callback('Profanity is not allowed!');
//         }
//         io.emit('message', message)
//         callback();
//     })

//     socket.on('sendLocation', (coords, callback) => {
//         io.emit('message', `https://google.com/maps?q=${coords.latitude},${coords.longitude}`)
//         callback();
//     })

//     socket.on('disconnect', () => {
//         io.emit('message', 'A user has left the App!')
//     })
// })

// fifth times


io.on('connection', (socket) => {
    console.log('New WebSocket connection');

    // socket.emit('message', generateMessage('Welcome!'));
    // socket.broadcast.emit('message', generateMessage('A new user has joined!!'));
    socket.on('join', ({ username, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, username, room });
        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit('message', generateMessage('Admin', 'Welcome!'));
        socket.broadcast.to(user.room).emit('message', generateMessage('Admin', `${user.username} has joined!`));
        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUserInRoom(user.room)
        });
        callback();
    })

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);

        const filter = new Filter()
        if (filter.isProfane(message)) {
            return callback('Profanity is not allowed!');
        }
        io.to(user.room).emit('message', generateMessage(user.username, message));
        callback();
    })

    socket.on('sendLocation', (coords, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit('locationMessage', generateLocationMessage(user.username, `https://google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', generateMessage('Admin', `${user.username} has left!`));
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUserInRoom(user.room)
            });
        }

    })
})


server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})