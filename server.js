const express = require("express");
const app = express();

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
    return response.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(3000, () => {
    console.log("port connected to 3000");
});

let chats = [];
const maxChats = 6;

io.on("connection", (socket) => {

    socket.emit("chat", chats)

    socket.on("chat", (chat) => {
        if (chats.length >= maxChats) {
            chats.shift();
        }

        console.log(chat)

        chats.push(chat);

        io.emit("chat", chats);
    });
});