function getOS() {
  const ua = navigator.userAgent || navigator.vendor || window.opera;

  if (/android/i.test(ua)) return "android";
  if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) return "ios";
  if (/Mac/i.test(ua)) return "mac";
  if (/Win/i.test(ua)) return "windows";
  return "other";
}

function renderGames() {
  const container = document.getElementById("games-list");
  if (!container || typeof GAMES === "undefined") return setTimeout(renderGames, 100);

  container.innerHTML = GAMES.map((game, i) => `
    <div class="game-showcase ${i % 2 === 0 ? 'left' : 'right'}" style="animation-delay:${i * 0.2}s">
      <div class="game-image">
        <img src="${game.img}" alt="${game.title}">
      </div>
      <div class="game-info">
        <h3>${game.title}</h3>
        <p>${game.desc}</p>
        <div class="platform-icons">
          <i class="fab fa-android" data-link="${game.android}"></i>
          <i class="fab fa-apple" data-link="${game.ios}"></i>
        </div>
        <button class="game-button" data-android="${game.android}" data-ios="${game.ios}" data-link="${game.link}">Play</button>
      </div>
    </div>
  `).join("");

  const os = getOS();

  // 🟢 Nút Play tự mở theo OS
  document.querySelectorAll(".game-button").forEach(btn => {
    btn.addEventListener("click", () => {
      let link = btn.dataset.link; // fallback
      if (os === "android" && btn.dataset.android) link = btn.dataset.android;
      else if (os === "ios" && btn.dataset.ios) link = btn.dataset.ios;

      if (link) window.open(link, "_blank");
      else alert("Không tìm thấy link cho hệ điều hành của bạn 😢");
    });
  });

  // 🟢 Icon Android / iOS bấm mở riêng
  document.querySelectorAll(".platform-icons i").forEach(icon => {
    icon.addEventListener("click", () => {
      const link = icon.dataset.link;
      if (link) window.open(link, "_blank");
    });
  });
}

renderGames();
