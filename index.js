import express from 'express';
import http from 'http'
import routes from './src/routes.js'
import { Server } from 'socket.io';
import cors from 'cors'
import { addUser, removeUser, getUser, getUsersInRoom } from './src/users.js'
const app = express();
const server = http.createServer(app)


const PORT = process.env.PORT || 8080

const io = new Server(server, {
    cors: {
        origin: "*",
    },
});


app.use(routes);
app.use(cors())
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,Accept");
    next();
});
io.on('connection', (socket) => {
    console.log('New user connected')
    socket.on('join', ({ name, room }, callback) => {
        const { user, error } = addUser({ id: socket.id, name, room })
        if (error) {
            console.log('in error')
            return callback({ error });
        }
        // message to the sender only
        socket.emit('message', { user: 'admin', message: `${user.name} welcome to room ${user.room}` });
        // broadcasting to everyone in the room except the sender
        socket.broadcast.to(user.room).emit('message', { user: 'admin', message: `${user.name} has joined` })
        socket.join(user.room);
        callback();
    });

    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id);
        if (user) {

            io.to(user.room).emit('message', { user: user.name, message });
        }
        callback();
    })

    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if (user) {
            io.to(user.room).emit('message', { user: 'admin', message: `${user.name} has left` })
        }
        console.log('User has left')

    })
})


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})