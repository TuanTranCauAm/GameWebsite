document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/header.html");
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

  window.addEventListener("hashchange", router);
  router();
});

function loadComponent(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    })
    .catch(err => console.error(`❌ Error loading component ${url}:`, err));
}

function router() {
  const route = location.hash.replace("#", "") || "home";
  loadView(route);
}

function loadView(page) {
  fetch(`views/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error("View not found");
      return res.text();
    })
    .then(html => {
      document.getElementById("content").innerHTML = html;
      if (page === "games") {
        console.log("🎮 Loading game model + controller...");
        loadScript("assets/js/data.js", () => loadScript("assets/js/games.js"));
      } else {
        loadScript(`assets/js/${page}.js`);
      }
    })
    .catch(err => {
      console.error("❌ Error loading view:", err);
      document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
    });
}

function loadScript(src, callback) {
  const s = document.createElement("script");
  s.src = src;
  s.onload = callback || (() => {});
  s.onerror = () => console.error(`❌ Failed to load script: ${src}`);
  document.body.appendChild(s);
}
