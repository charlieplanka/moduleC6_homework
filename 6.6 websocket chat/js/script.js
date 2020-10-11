const msgsWindow = document.querySelector(".chat-window");
const echoServerUrl = "wss://echo.websocket.org/";

function initWebsocket(url) {
    const websocket = new WebSocket(url);

    websocket.onopen = function () {
        console.log("Websocket: connected");
        const disabledButtons = document.querySelectorAll("button:disabled");
        for (let button of disabledButtons) {
            button.disabled = false;
        }
    }

    websocket.onmessage = function (evt) {
        console.log("Websocket: message recieved");
        let { msg, displayInChat } = JSON.parse(evt.data);
        if (displayInChat) {
            displayMsg(msg, msgsWindow, "server");
        }
    }

    websocket.onerror = function (evt) {
        console.log("Websocket: error occured", evt.data);
    }

    return websocket;
}

const websocket = initWebsocket(echoServerUrl);

const sendBtn = document.querySelector(".send-msg-btn");

sendBtn.addEventListener("click", () => {
    const msgText = document.querySelector(".msg-input").value;
    if (!msgText) {
        return;
    }
    displayMsg(msgText, msgsWindow, "client");
    sendMsgToServer(msgText, displayInChat=true);
})

function displayMsg(msg, msgSection, sender) {
    let msgNode = document.createElement("span");
    msgNode.setAttribute("class", "msg");
    msgNode.classList.add(sender);
    msgNode.innerHTML = msg;
    msgSection.appendChild(msgNode);
}

function sendMsgToServer(msg, displayInChat=true) {    
    const msgData = {
        msg: msg,
        displayInChat: displayInChat
    }
    const msgStr = JSON.stringify(msgData);
    websocket.send(msgStr);
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
            sendMsgToServer(geoUrl, displayInChat=false);
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED)
                displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "client");
        })
    } else {
        displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "client");
    }
})


