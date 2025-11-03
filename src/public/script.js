async function loadGameTemplates() {
  const response = await fetch("/api/v1/game-templates");
  const templates = await response.json();
  const gameBar = document.querySelector(".game-bar");
  gameBar.innerHTML = "";
  templates.forEach((template) => {
    const div = document.createElement("div");
    div.className = "template";
    const title = document.createElement("h3");
    title.textContent = template.name;
    div.appendChild(title);
    const hostButton = document.createElement("button");
    hostButton.textContent = "Host Game";
    hostButton.className = "host-button glass";
    hostButton.onclick = async () => {
      const res = await fetch("/api/v1/host-game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ templateId: template.id }),
      });
      const data = await res.json();
      window.location.href = `/game?gameId=${data.gameId}&host=true`;
    };
    div.appendChild(hostButton);
    gameBar.appendChild(div);
  });
}

loadGameTemplates();

const codeInput = document.getElementById("code-input");
const joinButton = document.getElementById("code-join-button");

joinButton.onclick = () => {
  const gameId = codeInput.value.trim();
  if (gameId.length === 6 && parseInt(gameId) !== NaN) {
    window.location.href = `/game?gameId=${gameId}&host=false`;
  }
};

const hostRedirect = document.querySelectorAll("#host-redirect");
hostRedirect.forEach(element => {
  element.addEventListener('click', (e) => {
    const shownObjects = document.querySelectorAll(".shown");
    const hiddenObjects = document.querySelectorAll(".hidden");
  
    shownObjects.forEach(element => {
      element.classList.remove("shown");
      element.classList.add("hidden");
    });
    hiddenObjects.forEach(element => {
      element.classList.remove("hidden");
      element.classList.add("shown");
    });
  })
});