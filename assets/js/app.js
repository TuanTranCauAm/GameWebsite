document.addEventListener("DOMContentLoaded", () => {
  loadComponent("header", "components/header.html");
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

  // Router
  window.addEventListener("hashchange", router);
  router(); // initial load
});

function loadComponent(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => document.getElementById(id).innerHTML = html);
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
      loadScript(`assets/js/${page}.js`);
      if (page === "games") loadScript("assets/js/data.js", () => loadScript("assets/js/games.js"));
    })
    .catch(() => {
      document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
    });
}

function loadScript(src, callback) {
  const s = document.createElement("script");
  s.src = src;
  s.onload = callback || (() => {});
  document.body.appendChild(s);
}
