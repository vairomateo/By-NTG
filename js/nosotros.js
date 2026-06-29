// ==========================================
//  BY NTG — nosotros.js
//  Lightbox para la galería de trabajos
// ==========================================

const items     = [...document.querySelectorAll(".galeria-item")];
const lightbox  = document.getElementById("lightbox");
const lbImg     = document.getElementById("lightboxImg");
const lbLabel   = document.getElementById("lightboxLabel");
const lbClose   = document.getElementById("lightboxClose");
const lbPrev    = document.getElementById("lightboxPrev");
const lbNext    = document.getElementById("lightboxNext");

let indexActual = 0;

function abrirLightbox(index) {
  indexActual = index;
  const item  = items[index];
  lbImg.src   = item.querySelector(".galeria-img").src;
  lbImg.alt   = item.dataset.label;
  lbLabel.textContent = item.dataset.label;
  lightbox.classList.add("abierto");
  document.body.style.overflow = "hidden";
}

function cerrarLightbox() {
  lightbox.classList.remove("abierto");
  document.body.style.overflow = "";
}

function irA(index) {
  indexActual = (index + items.length) % items.length;
  abrirLightbox(indexActual);
}

// Abrir al hacer click en cada item
items.forEach((item, i) => {
  item.addEventListener("click", () => abrirLightbox(i));
});

// Controles
lbClose.addEventListener("click", cerrarLightbox);
lbPrev.addEventListener("click",  () => irA(indexActual - 1));
lbNext.addEventListener("click",  () => irA(indexActual + 1));

// Click fuera de la imagen cierra
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) cerrarLightbox();
});

// Teclado
document.addEventListener("keydown", e => {
  if (!lightbox.classList.contains("abierto")) return;
  if (e.key === "Escape")     cerrarLightbox();
  if (e.key === "ArrowLeft")  irA(indexActual - 1);
  if (e.key === "ArrowRight") irA(indexActual + 1);
});