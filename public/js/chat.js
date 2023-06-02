const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "???";

let user = null;
let socket = null;

// HTML Refs
const txtUid = document.querySelector("#txtUid");
const txtMessage = document.querySelector("#txtMessage");
const ulUsers = document.querySelector("#ulUsers");
const ulMessages = document.querySelector("#ulMessages");
const tbnSalir = document.querySelector("#tbnSalir");

// Validate JWT from localstorage
const validateJWT = async () => {
  const token = localStorage.getItem("token") || "";
  console.log("::token", token);

  if (token.length <= 10) {
    window.location = "index.html";
    throw new Error("There's no token in server");
  }

  const resp = await fetch(url, {
    headers: {
      "x-token": token,
    },
  });

  const { user: userDB, token: tokenDB } = await resp.json();
  console.log(userDB, tokenDB);

  localStorage.setItem("token", tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();
};

// ? Sockets events
const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      "x-token": localStorage.getItem("token"),
    },
  });

  socket.on("connect", () => {
    //TODO
  });

  socket.on("disconnect", () => {
    console.log("Disconnected");
  });

  socket.on("retrive-messages", setMessagesOnHtml);

  socket.on("active-users", setUsersOnHtml);

  socket.on("retrive-private-message", (payload) => {
    console.log("Private", payload);
  });
};

// ? Sockets actions
const setUsersOnHtml = (users = []) => {
  let usersHtml = "";
  users.forEach(({ name, uid }) => {
    usersHtml += `
    <li>
      <p>
        <h5 class="text-success"> ${name}</h5>
        <span class="fs-6 text-muted"> ${uid} </span>
      </p>
    </li>
    `;
  });

  ulUsers.innerHTML = usersHtml;
};

const setMessagesOnHtml = (messages = []) => {
  let messagesHtml = "";
  messages.forEach(({ name, message }) => {
    messagesHtml += `
    <li>
      <p>
        <span class="text-primary"> ${name}: </span>
        <span> ${message} </span>
      </p>
    </li>
    `;
  });

  ulMessages.innerHTML = messagesHtml;
};

// ? HTML event listeners
txtMessage.addEventListener("keyup", ({ keyCode }) => {
  const message = txtMessage.value;
  const uid = txtUid.value;

  if (keyCode !== 13) return;
  if (message.trim().length === 0) return;

  socket.emit("send-message", { uid, message });
  txtMessage.value = "";
});

const main = async () => {
  await validateJWT();
};

main();
