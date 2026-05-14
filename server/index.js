const express = require('express');
const {createServer} = require("node:http");
const {Server} = require("socket.io")
const cors = require("cors")

//express pero no solo sirve para montar el servidor http, sino que tambien para crear rutas, endpoints, etc
const app = express();

//Montamos el servidor http con express
const server = createServer(app);

//Montamos webSocket
const io = new Server(server, {
    cors: {
        origin: "*",
    }
})

const mensajes = []
io.on("connection", (socket) => {
    console.log("Usuario conectado: ")

    socket.emit("message", mensajes)

    socket.on("message", (msg) => {
        mensajes.push(msg)
        socket.emit("confirmation", "Mensaje enviado correctamente")
        io.emit("message", mensajes)

        //io.emit("message", "Enviaron esto: " + mensaje) -> Envia el mensaje a todos los clientes conectados, incluido el que lo envio
        //socket.emit -> Envia el mensaje solo al cliente que lo envio
        //socket.broadcast.emit -> Envia el mensaje a todos los clientes conectados, excepto al que lo envio
    })
})

//Endpoint
app.get("/", (req, res) => {
    res.send("Hola mundo")
})

//Puerto 3000 , funcion (anonima - lambda) que se ejecuta cuando el servidor esta listo
server.listen(3000, () => {
    console.log('Estoy corriendo');
});
