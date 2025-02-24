const express = require("express");
const app = express();

const path = require("path");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

const fs = require("fs");
const chatFile = path.join(__dirname, "chats.json")

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (request, response) => {
    return response.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(3000, () => {
    console.log("port connected to 3000");
});

function load() {
    if (fs.existsSync(chatFile)) {
        return JSON.parse(fs.readFileSync(chatFile, "utf8"));
    } else {
        fs.writeFileSync(chatFile, "[]", "utf8");
        io.emit("serverError", "Chat file not found, creating new file");
    }
    return [];
}

function save(chats) {
    fs.writeFile(chatFile, JSON.stringify(chats, null, 2), "utf8", (err) => {
        if (err) {
            io.emit("serverError", err)
        }
    });
}


let chats = load();
const maxChats = 4;

io.on("connection", (socket) => {

    console.log("New player connected !");

    socket.emit("chat", chats)

    socket.on("chat", (chat) => {
        if (chats.length >= maxChats) {
            chats.shift();
        }

        console.log(chat)

        chats.push(chat);
        save(chats);

        io.emit("chat", chats);
    });
});
