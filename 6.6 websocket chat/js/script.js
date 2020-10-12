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
        let { msg, displaySide, isGeoLink } = JSON.parse(evt.data);
        if (isGeoLink) {
            msg = `<a href="${msg}" target="_blank">Ваша геолокация</a>`;
        }
        displayMsg(msg, msgsWindow, displaySide);
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
    displayMsg(msgText, msgsWindow, "right");
    sendMsgToServer(msgText, displaySide = "left", isGeoLink = false);
})

function displayMsg(msg, msgSection, displaySide) {
    let msgNode = document.createElement("span");
    msgNode.setAttribute("class", "msg");
    msgNode.classList.add(displaySide);
    msgNode.innerHTML = msg;
    msgSection.appendChild(msgNode);
}

function sendMsgToServer(msg, displaySide, isGeoLink) {    
    const msgData = {
        msg: msg,
        displaySide: displaySide,
        isGeoLink: isGeoLink
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
            sendMsgToServer(geoUrl, displaySide = "right", isGeoLink = true);
        }, (error) => {
            if (error.code == error.PERMISSION_DENIED)
                displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "right");
        })
    } else {
        displayMsg("Геолокация недоступна &#x26D4", msgsWindow, "right");
    }
})


