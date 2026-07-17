// ==========================================
//   BY NTG — nosotros.js (Unificado)
// ==========================================

document.addEventListener("DOMContentLoaded", () => {

  // ── 1. FILTROS DE LA GALERÍA ─────────────────
  const botonesFiltro = document.querySelectorAll(".btn-filtro");
  const tarjetas = document.querySelectorAll(".tarjeta-trabajo");

  botonesFiltro.forEach(boton => {
    boton.addEventListener("click", () => {
      // Cambiar clase activa en los botones
      botonesFiltro.forEach(btn => btn.classList.remove("active"));
      boton.classList.add("active");

      const filtroSeleccionado = boton.getAttribute("data-filter");

      // Ocultar o mostrar tarjetas con transición suave
      tarjetas.forEach(tarjeta => {
        const categoriaTarjeta = tarjeta.getAttribute("data-category");

        if (filtroSeleccionado === "todos" || categoriaTarjeta === filtroSeleccionado) {
          tarjeta.classList.remove("oculto");
        } else {
          tarjeta.classList.add("oculto");
        }
      });
      
      // Por seguridad, si el lightbox estaba abierto al filtrar, se cierra
      cerrarLightbox();
    });
  });


  // ── 2. LIGHTBOX CON SOPORTE ANTES/DESPUÉS ────
  const lightbox   = document.getElementById("lightbox");
  const lbImg      = document.getElementById("lightboxImg");
  const lbLabel    = document.getElementById("lightboxLabel");
  const lbClose    = document.getElementById("lightboxClose");
  const lbPrev     = document.getElementById("lightboxPrev");
  const lbNext     = document.getElementById("lightboxNext");

  let indexActual = 0;

  // Devuelve un array solo con las imágenes visibles en pantalla según el filtro activo
  function obtenerImagenesVisibles() {
    const imagenes = [];
    tarjetas.forEach(tarjeta => {
      if (!tarjeta.classList.contains("oculto")) {
        const imgsTarjeta = tarjeta.querySelectorAll("img");
        imgsTarjeta.forEach(img => imagenes.push(img));
      }
    });
    return imagenes;
  }

  function abrirLightbox(index, listaImgs) {
    if (listaImgs.length === 0) return;
    
    // Controlar ciclo infinito de índices (positivo y negativo)
    indexActual = (index + listaImgs.length) % listaImgs.length;
    
    const imgSeleccionada = listaImgs[indexActual];
    const tarjetaPadre = imgSeleccionada.closest(".tarjeta-trabajo");
    
    // Obtener el título (H3) y la etiqueta específica (Antes / Después / Resultado Final)
    const tituloTrabajo = tarjetaPadre.querySelector("h3").textContent;
    const contenedorFoto = imgSeleccionada.parentElement;
    const tagFoto = contenedorFoto.querySelector(".tag-foto");
    const textoTag = tagFoto ? ` — ${tagFoto.textContent}` : "";

    // Cargar datos en el DOM del Lightbox
    lbImg.src = imgSeleccionada.src;
    lbImg.alt = imgSeleccionada.alt || tituloTrabajo;
    lbLabel.textContent = `${tituloTrabajo}${textoTag}`;
    
    lightbox.classList.add("abierto");
    document.body.style.overflow = "hidden";
  }

  function cerrarLightbox() {
    if (lightbox) {
      lightbox.classList.remove("abierto");
      document.body.style.overflow = "";
    }
  }

  // Event Delegation: Escucha los clicks en cualquier imagen de la grilla
  const grilla = document.querySelector(".grilla-trabajos");
  if (grilla) {
    grilla.addEventListener("click", e => {
      const imgClickeada = e.target.closest("img");
      if (!imgClickeada) return;

      const imgsVisibles = obtenerImagenesVisibles();
      const index = imgsVisibles.indexOf(imgClickeada);
      
      if (index !== -1) {
        abrirLightbox(index, imgsVisibles);
      }
    });
  }

  // Asignación de controles del Lightbox
  lbClose?.addEventListener("click", cerrarLightbox);
  lbPrev?.addEventListener("click", () => abrirLightbox(indexActual - 1, obtenerImagenesVisibles()));
  lbNext?.addEventListener("click", () => abrirLightbox(indexActual + 1, obtenerImagenesVisibles()));

  // Cierre al hacer click en el fondo oscuro
  lightbox?.addEventListener("click", e => {
    if (e.target === lightbox) cerrarLightbox();
  });

  // Controles por Teclado
  document.addEventListener("keydown", e => {
    if (!lightbox || !lightbox.classList.contains("abierto")) return;
    
    if (e.key === "Escape")    cerrarLightbox();
    if (e.key === "ArrowLeft")  abrirLightbox(indexActual - 1, obtenerImagenesVisibles());
    if (e.key === "ArrowRight") abrirLightbox(indexActual + 1, obtenerImagenesVisibles());
  });


  // ── 3. ANIMACIÓN DE APARICIÓN GRADUAL ────────
  const secciones = document.querySelectorAll(".reveal-scroll");

  const seccionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Se ejecuta una sola vez por sección
      }
    });
  }, {
    root: null,
    threshold: 0.15
  });

  secciones.forEach(seccion => {
    seccionObserver.observe(seccion);
  });

});