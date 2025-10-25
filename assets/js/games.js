document.addEventListener("DOMContentLoaded", renderGames);

function renderGames() {
  const container = document.getElementById("games-list");
  if (!container || typeof GAMES === "undefined") return;

  container.innerHTML = GAMES.map(game => `
    <div class="game-card">
      <img src="${game.img}" alt="${game.title}">
      <div class="game-body">
        <h3>${game.title}</h3>
        <p>${game.desc}</p>
        <div class="platform-icons">
          ${game.platforms.map(p => `<i class="fab fa-${p}"></i>`).join("")}
        </div>
        <a href="${game.link}" class="game-button" target="_blank">Play</a>
      </div>
    </div>
  `).join("");
}
