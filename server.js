const express = require("express");
const app = express();
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const server = http.createServer(app);
const io = new Server(server);
const axios = require("axios");

const binId = "67d454228960c979a5718d25";
const masterKey = "$2a$10$vZ78La5jYfAseHaXyGeGC.zY9lB5GOyTUJK5zmXnUa2qPhPPc8AOa";

const JSONBIN_BASE_URL = `https://api.jsonbin.io/v3/b/${binId}`;

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

server.listen(3000, () => {
    console.log("port connected to 3000");
});

let chats = [];

// Fonction async qui charge les données depuis JSONBin
async function load() {
    try {
        const res = await axios.get(JSONBIN_BASE_URL, {
            headers: {
                "X-Master-Key": masterKey
            }
        });
        // Assure que 'record' existe et que chats est un tableau
        return res.data.record || [];
    } catch (err) {
        console.error("Erreur de chargement JSONBin :", err.message);
        io.emit("serverError", "Erreur de chargement depuis JSONBin");
        return []; // Renvoie un tableau vide en cas d'erreur
    }
}

// Fonction async qui sauvegarde les chats sur JSONBin
async function save(chats) {
    try {
        await axios.put(JSONBIN_BASE_URL, { record: chats }, {
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": masterKey
            }
        });
    } catch (err) {
        console.error("Erreur de sauvegarde JSONBin :", err.message);
        io.emit("serverError", "Erreur de sauvegarde vers JSONBin");
    }
}

// On charge les chats au démarrage
(async () => {
    chats = await load(); // On attend que 'load' soit terminé avant de continuer
})();

const maxChats = 4;

io.on("connection", (socket) => {
    console.log("New player connected !");
    socket.emit("chat", chats); // On envoie les chats existants au nouveau joueur

    socket.on("chat", async (chat) => {
        // Vérifie que 'chats' est bien un tableau
        if (!Array.isArray(chats)) {
            console.error("Erreur: 'chats' n'est pas un tableau.");
            return;
        }

        if (chats.length >= maxChats) {
            chats.shift(); // Enlève le plus ancien chat si on dépasse la limite
        }

        chats.push(chat); // Ajoute le nouveau chat
        await save(chats); // Sauvegarde les nouveaux chats

        io.emit("chat", chats); // Émet le nouveau chat à tous les joueurs
    });
});
