const socket = io();

function addChat() {
    const chatInput = document.getElementById("chatinput").value;

    const input = document.getElementById("name");
    const name = input.value;

    console.log("name : "+[chatInput, name]);
    
    socket.emit("chat", [chatInput, name]);

    document.getElementById("chatinput").value = "";
}

function login() {
    const loginContainer = document.querySelector(".login");
    const chatContainer = document.querySelector(".chatContainer");
    const newChatContainer = document.querySelector(".newChat");

    const input = document.getElementById("name");
    const name = input.value;

    if (name) {
        chatContainer.style.display = "flex";
        newChatContainer.style.display = "flex";
        loginContainer.style.display = "none";
    }
    
}

socket.on("chat", (chats) => {
    const chatContainer = document.querySelector(".chatContainer");
    chatContainer.innerHTML = "";

    const input = document.getElementById("name");
    const name = input.textContent;

    chats.forEach((chats) => {
        console.log(chats)

        const chatElement = document.createElement("p");
        chatElement.textContent = chats[1]+":"+chats[0];
        chatContainer.appendChild(chatElement);
    });
});