// ==========================================
//  BY NTG — app.js
//  Carga servicios desde servicios.json,
//  renderiza cards y maneja filtros.
// ==========================================

let servicios = [];

// ── Cargar datos ──────────────────────────
async function cargarServicios() {
  try {
    const res  = await fetch("./servicios.json");
    const data = await res.json();
    return data.servicios;
  } catch (err) {
    console.error("Error cargando servicios:", err);
    return [];
  }
}

// ── Render de cards ───────────────────────
function renderServicios(lista) {
  const container = document.getElementById("serviciosContainer");
  const sinRes    = document.getElementById("sinResultados");
  container.innerHTML = "";

  if (lista.length === 0) {
    sinRes.style.display = "block";
    return;
  }
  sinRes.style.display = "none";

  lista.forEach(s => {
    const col = document.createElement("div");
    col.className = "col-12 col-sm-6 col-lg-4";

    const vehiculosTags = s.vehiculos
      .map(v => `<span class="tag-vehiculo"><i class="bi bi-car-front me-1"></i>${v}</span>`)
      .join("");

    col.innerHTML = `
      <div class="servicio-card">
        <div class="card-body-byntg">
          <span class="card-badge ${s.badge}">${s.badgeLabel}</span>
          <p class="card-nombre">${s.nombre}</p>
          <p class="card-desc">${s.descripcion}</p>
          <div class="card-vehiculos">${vehiculosTags}</div>
          <div class="card-precio">
            $${s.precio.toLocaleString("es-AR")}
            <small>${s.precioNota}</small>
          </div>
          <a href="turnos.html?servicio=${encodeURIComponent(s.nombre)}" class="btn-sacar-turno">
            <i class="bi bi-calendar-check me-1"></i>Sacar turno
          </a>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// ── Filtros ───────────────────────────────
let categoriaActiva = "todos";

function aplicarFiltros() {
  const resultado = categoriaActiva === "todos"
    ? servicios
    : servicios.filter(s => s.categoria === categoriaActiva);
  renderServicios(resultado);
}

document.getElementById("filtrosPill").addEventListener("click", e => {
  const btn = e.target.closest(".btn-filtro");
  if (!btn) return;

  document.querySelectorAll(".btn-filtro").forEach(b => b.classList.remove("activo"));
  btn.classList.add("activo");

  categoriaActiva = btn.dataset.cat;
  aplicarFiltros();
});

// ── Init ──────────────────────────────────
async function init() {
  servicios = await cargarServicios();
  aplicarFiltros();
}

init();