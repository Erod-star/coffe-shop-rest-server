const loginForm = document.querySelector("form");

const url = window.location.hostname.includes("localhost")
  ? "http://localhost:8080/api/auth/"
  : "???";

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = {};

  for (let element of loginForm.elements) {
    if (element.name.length > 0) {
      formData[element.name] = element.value;
    }
  }

  fetch(url + "login", {
    method: "POST",
    body: JSON.stringify(formData),
    headers: { "Content-Type": "application/json" },
  })
    .then((resp) => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg);
      }
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch((err) => {
      console.log(err);
    });
});

function handleCredentialResponse(response) {
  // Google Token: ID_TOKEN
  // console.log("::ID_TOKEN", response.credential);
  const body = { id_token: response.credential };

  fetch(url + "google", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
    .then((resp) => resp.json())
    .then(({ token, user }) => {
      localStorage.setItem("email", user.email);
      localStorage.setItem("token", token);
      window.location = "chat.html";
    })
    .catch(console.warn);
}

const button = document.getElementById("google-sign-out");
button.onclick = () => {
  google.accounts.id.disableAutoSelect();

  google.accounts.id.revoke(localStorage.getItem("email"), (done) => {
    localStorage.clear();
    location.reload();
  });
};
