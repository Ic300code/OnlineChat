const socket = io();

function addChat() {
    const chatInput = document.getElementById("chatinput").value;

    const input = document.getElementById("name");
    const name = input.value;
    name = name.charAt(0);

    if (name != "") {
        socket.emit("chat", { name, name });

        document.getElementById("chatinput").value = ""; 
    }
}

function login() {
    const loginContainer = document.querySelector(".login");
    const chatContainer = document.querySelector(".chatContainer");
    const newChatContainer = document.querySelector(".newChat");

    const input = document.getElementById("name");
    const name = input.value;

    chatContainer.style.display = "flex";
    newChatContainer.style.display = "flex";
    loginContainer.style.display = "none";
}

socket.on("chat", (chats) => {
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.innerHTML = "";

        chats.forEach((chat) => {
        console.log(chat);

        const template = document.getElementById("chatPreset");
        const clone = template.content.cloneNode(true);
        clone.querySelector("#username").textContent = chat[0];
        clone.querySelector("#description").textContent = chat[1];
        chatContainer.appendChild(clone);
    });
});

socket.on("serverError", (err) => {
    console.error("Erreur du serveur :", err);
});
