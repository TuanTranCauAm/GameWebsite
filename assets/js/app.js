document.addEventListener("DOMContentLoaded", () => {
  // Load common layout components
  loadComponent("header", "components/header.html");
  loadComponent("navbar", "components/navbar.html");
  loadComponent("footer", "components/footer.html");

  // Handle router change
  window.addEventListener("hashchange", router);

  // Allow in-page smooth scroll (for #scroll-down or internal anchors)
  document.addEventListener("click", e => {
    const target = e.target.closest("a[href^='#']");
    if (target && target.getAttribute("href") === "#scroll-down") {
      e.preventDefault();
      document.querySelector("#scroll-down").scrollIntoView({ behavior: "smooth" });
    }
  });

  // Initial page load
  router();
});

/* ==========================================================
📦 Load component (header, navbar, footer)
========================================================== */
function loadComponent(id, url) {
  fetch(url)
    .then(res => res.text())
    .then(html => {
      const el = document.getElementById(id);
      if (el) el.innerHTML = html;
    })
    .catch(err => console.error(`❌ Error loading component ${url}:`, err));
}

/* ==========================================================
🧭 Router - Single Page Navigation
========================================================== */
function router() {
  const route = location.hash.replace("#", "") || "home";
  loadView(route);
}

/* ==========================================================
🪄 Load View (HTML + CSS + JS per page)
========================================================== */
function loadView(page) {
  fetch(`views/${page}.html`)
    .then(res => {
      if (!res.ok) throw new Error("View not found");
      return res.text();
    })
    .then(html => {
      const content = document.getElementById("content");
      content.innerHTML = html;

      // Remove old dynamic CSS
      document.querySelectorAll("link[data-dynamic]").forEach(link => link.remove());

      // Load corresponding CSS if exists
      const cssPath = `assets/css/${page}.css`;
      checkFileExists(cssPath, exists => {
        if (exists) {
          const link = document.createElement("link");
          link.rel = "stylesheet";
          link.href = cssPath;
          link.dataset.dynamic = "true";
          document.head.appendChild(link);
        }
      });

      // Load corresponding JS or model/controller if needed
      if (page === "games") {
        console.log("🎮 Loading game model + controller...");
        loadScript("assets/js/data.js", () => loadScript("assets/js/games.js"));
      } else if (page === "about") {
        console.log("📘 Loading About page...");
        loadScript("assets/js/about.js"); // optional
      } else {
        loadScript(`assets/js/${page}.js`);
      }
    })
    .catch(err => {
      console.error("❌ Error loading view:", err);
      document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
    });
}

/* ==========================================================
🧩 Utility: Load JS dynamically
========================================================== */
function loadScript(src, callback) {
  const s = document.createElement("script");
  s.src = src;
  s.onload = callback || (() => {});
  s.onerror = () => console.error(`❌ Failed to load script: ${src}`);
  document.body.appendChild(s);
}

/* ==========================================================
🧩 Utility: Check if file exists before loading
========================================================== */
function checkFileExists(url, callback) {
  fetch(url, { method: "HEAD" })
    .then(res => callback(res.ok))
    .catch(() => callback(false));
}
