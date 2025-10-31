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
      if (el) {
        el.innerHTML = html;

        // 🧭 Nếu là navbar thì kích hoạt hiệu ứng active link
        if (id === "navbar") initNavbarActiveEffect();
      }
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
      switch (page) {
        case "games":
          console.log("🎮 Loading Games model + controller...");
          loadScript("assets/js/data.js", () => loadScript("assets/js/games.js"));
          break;
        case "about":
          console.log("📘 Loading About page...");
          safeLoadScript("assets/js/about.js");
          break;
        case "contact":
          console.log("📞 Loading Contact page...");
          safeLoadScript("assets/js/contact.js");
          break;
        default:
          safeLoadScript(`assets/js/${page}.js`);
          break;
      }
    })
    .catch(err => {
      console.error("❌ Error loading view:", err);
      document.getElementById("content").innerHTML = "<h2>404 - Page Not Found</h2>";
    });
}

/* ==========================================================
🧩 Utility: Load JS dynamically (with error-safe)
========================================================== */
function safeLoadScript(src, callback) {
  checkFileExists(src, exists => {
    if (exists) {
      loadScript(src, callback);
    } else {
      console.log(`ℹ️ No script found for ${src}, skipping.`);
    }
  });
}

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

/* ==========================================================
🧭 Navbar Active Highlight
========================================================== */
function initNavbarActiveEffect() {
  const navLinks = document.querySelectorAll(".navbar a");

  // Chỉ smooth scroll nếu có section tương ứng trong trang hiện tại
  navLinks.forEach(link => {
    link.addEventListener("click", e => {
      const href = link.getAttribute("href") || "";
      if (!href.startsWith("#")) return; // link thường => cho đi tự nhiên

      const targetEl = document.querySelector(href);
      if (targetEl) {
        // In-page anchor: scroll mượt, KHÔNG đổi route
        e.preventDefault();
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
      // Nếu KHÔNG có section (route SPA) => KHÔNG preventDefault
      // để hash đổi và router() xử lý
    });
  });

  // Auto highlight theo section hiện tại (nếu có)
  const sections = document.querySelectorAll("section[id]");
  function activateLink() {
    let current = "";
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      const h = section.clientHeight;
      if (scrollY >= top && scrollY < top + h) current = section.id;
    });

    navLinks.forEach(l => {
      const href = l.getAttribute("href");
      l.classList.toggle("active", href === `#${current}`);
    });
  }
  window.addEventListener("scroll", activateLink);

  // Đồng bộ active theo route khi hash thay đổi (SPA)
  window.addEventListener("hashchange", () => {
    navLinks.forEach(l => {
      l.classList.toggle("active", l.getAttribute("href") === location.hash);
    });
  });

  // Gọi lần đầu
  activateLink();
  navLinks.forEach(l => {
    l.classList.toggle("active", l.getAttribute("href") === location.hash);
  });
}
