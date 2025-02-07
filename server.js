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
        try {
            const data = fs.readFileSync(chatFile, "utf8");
            return data.trim() ? JSON.parse(data) : [];
        } catch (error) {
            console.error("❌ Erreur lors de la lecture du fichier chats.json :", error);
            return [];
        }
    }
    return [];
}

function save(chats) {
    fs.writeFile(chatFile, JSON.stringify(chats, null, 2), "utf8", (err) => {
        if (err) {
            console.error("Erreur lors de la sauvegarde du chat :", err);
        }
    });
}


let chats = load();
const maxChats = 6;

io.on("connection", (socket) => {

    socket.emit("chat", chats)

    socket.on("chat", (chat) => {
        if (chats.length >= maxChats) {
            chats.shift();
        }

        console.log(chat)

        chats.push(chat);
        save(chats)

        io.emit("chat", chats);
    });
});
