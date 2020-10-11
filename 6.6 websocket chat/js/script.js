const msgsWindow = document.querySelector(".chat-window");
const echoServerUrl = "wss://echo.websocket.org/";

const websocket = new WebSocket(echoServerUrl);

websocket.onopen = function() {
    console.log("Websoket: connected");
}

websocket.onmessage = function(evt) {
    console.log("Websocket: message recieved");
    displayMsg(evt.data, msgsWindow, "server");
}

websocket.onerror = function(evt) {
    console.log("Websocket: error occured", evt.data);
}

const sendBtn = document.querySelector(".send-msg-btn");

sendBtn.addEventListener("click", () => {
    const msgText = document.querySelector(".msg-input").value;
    if (!msgText) {
        return;
    }
    displayMsg(msgText, msgsWindow, "client");
    sendMsgToServer(msgText);
})

function displayMsg(msg, msgSection, sender) {
    let msgNode = document.createElement("span");
    msgNode.setAttribute("class", "msg");
    if (sender === "client") {
        msgNode.classList.add("client");
    } else if (sender === "server") {
        msgNode.classList.add("server");
    }
    msgNode.innerHTML = msg;
    msgSection.appendChild(msgNode);
}

function sendMsgToServer(msg) {    
    websocket.send(msg);
}

const geoBtn = document.querySelector(".geo-location-btn");

geoBtn.addEventListener("click", () => {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition((position) => {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            geoUrl = `https://www.openstreetmap.org/#map=18/${latitude}/${longitude}`;
            geoHTML = `<a href="${geoUrl}" target="_blank">Ваша геолокация</a>`;
            displayMsg(geoHTML, msgsWindow, "client");
            sendMsgToServer(geoUrl);
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED)
                displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "client");
        })
    } else {
        displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "client");
    }
})


