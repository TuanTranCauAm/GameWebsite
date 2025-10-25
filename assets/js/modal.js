const modal = document.getElementById("game-modal");
const iframe = document.getElementById("game-frame");
const closeBtn = document.getElementById("modal-close");

function openModal(link) {
  iframe.src = link;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

closeBtn.addEventListener("click", () => {
  iframe.src = "";
  modal.classList.add("hidden");
  document.body.style.overflow = "auto";
});
