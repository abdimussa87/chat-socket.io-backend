import express from 'express';
import http from 'http'
import routes from './src/routes.js'
import { Server } from 'socket.io';
import cors from 'cors'
const app = express();
const server = http.createServer(app)
const PORT = process.env.PORT || 8080
const io = new Server(server);


app.use(routes);
app.use(cors())
io.on('connection', (socket) => {
    console.log('New user connected')
    socket.on('disconnect', () => {
        console.log('User has left')
    })
})


server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})