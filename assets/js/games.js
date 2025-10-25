function renderGames() {
  const container = document.getElementById("games-list");
  if (!container || typeof GAMES === "undefined") return setTimeout(renderGames, 100);

  container.innerHTML = GAMES.map((game, i) => `
    <div class="game-card" style="animation-delay:${i * 0.15}s">
      <img src="${game.img}" alt="${game.title}">
      <div class="game-body">
        <h3>${game.title}</h3>
        <p>${game.desc}</p>
        <div class="platform-icons">
          ${game.platforms.map(p => `<i class="fab fa-${p}"></i>`).join("")}
        </div>
        <button class="game-button" data-link="${game.link}">Play</button>
      </div>
    </div>
  `).join("");

  document.querySelectorAll(".game-button").forEach(btn => {
    btn.addEventListener("click", () => openModal(btn.dataset.link));
  });
}
renderGames();
