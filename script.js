const WEBSOCKET_URL =
    "wss://j38udun9za.execute-api.ap-southeast-2.amazonaws.com/dev";

let socket = null;


// ==========================================
// JOIN CHAT
// ==========================================

function joinChat() {

    const username =
        document.getElementById("username").value.trim();

    if (!username) {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("currentUser").textContent =
        username;

    document.getElementById("username").parentElement.style.display =
        "none";

    document.getElementById("chatSection").style.display =
        "block";

    connectWebSocket();
}


// ==========================================
// CONNECT TO API GATEWAY
// ==========================================

function connectWebSocket() {

    if (
        socket &&
        (
            socket.readyState === WebSocket.OPEN ||
            socket.readyState === WebSocket.CONNECTING
        )
    ) {
        return;
    }

    addSystemMessage("Connecting to CloudChat...");

    socket = new WebSocket(WEBSOCKET_URL);


    socket.onopen = function () {

        addSystemMessage("✅ Connected to CloudChat");

    };


    socket.onmessage = function (event) {

        try {

            const data =
                JSON.parse(event.data);

            if (data.type === "message") {

                addMessage(
                    data.username,
                    data.message,
                    data.timestamp
                );

            }

        } catch (error) {

            console.error(
                "Message error:",
                error
            );

        }

    };


    socket.onclose = function () {

        addSystemMessage(
            "🔴 Disconnected from server."
        );

    };


    socket.onerror = function (error) {

        console.error(
            "WebSocket error:",
            error
        );

        addSystemMessage(
            "❌ Connection error."
        );

    };
}


// ==========================================
// SEND MESSAGE
// ==========================================

function sendMessage() {

    const username =
        document.getElementById("currentUser").textContent;

    const input =
        document.getElementById("messageInput");

    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    if (
        !socket ||
        socket.readyState !== WebSocket.OPEN
    ) {

        addSystemMessage(
            "❌ Not connected to server."
        );

        return;
    }


    const messageData = {

        action: "sendmessage",

        username: username,

        message: message

    };


    socket.send(
        JSON.stringify(messageData)
    );


    input.value = "";

    input.focus();
}


// ==========================================
// DISPLAY MESSAGE
// ==========================================

function addMessage(
    username,
    message,
    timestamp
) {

    const messages =
        document.getElementById("messages");

    const welcome =
        messages.querySelector(".welcome");

    if (welcome) {
        welcome.remove();
    }


    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message";


    const nameElement =
        document.createElement("strong");

    nameElement.textContent =
        username;


    const messageElement =
        document.createElement("span");

    messageElement.textContent =
        message;


    messageDiv.appendChild(
        nameElement
    );

    messageDiv.appendChild(
        messageElement
    );


    messages.appendChild(
        messageDiv
    );


    messages.scrollTop =
        messages.scrollHeight;
}


// ==========================================
// SYSTEM MESSAGE
// ==========================================

function addSystemMessage(message) {

    const messages =
        document.getElementById("messages");


    const div =
        document.createElement("div");

    div.className =
        "system-message";

    div.textContent =
        message;


    messages.appendChild(div);


    messages.scrollTop =
        messages.scrollHeight;
}


// ==========================================
// ENTER KEY
// ==========================================

function handleEnter(event) {

    if (event.key === "Enter") {

        sendMessage();

    }

}


// ==========================================
// EXPORT FUNCTIONS TO HTML
// ==========================================

window.joinChat =
    joinChat;

window.sendMessage =
    sendMessage;

window.handleEnter =
    handleEnter;