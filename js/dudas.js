// ==========================================
//  BY NTG — dudas.js
// ==========================================

// ── Filtros por categoría ─────────────────
document.getElementById("catsFaq").addEventListener("click", e => {
  const btn = e.target.closest(".cat-btn");
  if (!btn) return;

  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo");

  const cat = btn.dataset.cat;
  document.querySelectorAll(".faq-grupo").forEach(g => {
    g.classList.toggle("oculto", cat !== "todas" && g.dataset.cat !== cat);
  });

  // Limpiar buscador al cambiar categoría
  document.getElementById("buscadorFaq").value = "";
  document.querySelectorAll(".accordion-item").forEach(i => i.style.display = "");
  document.getElementById("sinResultadosFaq").style.display = "none";
});

// ── Buscador ─────────────────────────────
document.getElementById("buscadorFaq").addEventListener("input", function () {
  const q = this.value.toLowerCase().trim();

  // Mostrar todos los grupos al buscar
  document.querySelectorAll(".faq-grupo").forEach(g => g.classList.remove("oculto"));
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("activo"));
  document.querySelector('[data-cat="todas"]').classList.add("activo");

  let hayResultados = false;

  document.querySelectorAll(".accordion-item").forEach(item => {
    const texto =
      (item.dataset.pregunta?.toLowerCase() ?? "") + " " +
      (item.querySelector(".accordion-body")?.textContent.toLowerCase() ?? "");
    const coincide = !q || texto.includes(q);
    item.style.display = coincide ? "" : "none";
    if (coincide) hayResultados = true;
  });

  // Ocultar grupos que quedaron sin resultados visibles
  document.querySelectorAll(".faq-grupo").forEach(g => {
    const hayVisibles = [...g.querySelectorAll(".accordion-item")]
      .some(i => i.style.display !== "none");
    g.classList.toggle("oculto", !hayVisibles);
  });

  document.getElementById("sinResultadosFaq").style.display =
    hayResultados ? "none" : "block";
});