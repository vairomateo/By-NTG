// ==========================================
//   BY NTG — turnos.js (Con Calendario Custom)
// ==========================================

const SERVICIOS = [
    { nombre: "Polarizado Estándar",         cat: "Polarizado" },
    { nombre: "Polarizado Carbono Premium",    cat: "Polarizado" },
    { nombre: "Polarizado Cerámico",           cat: "Polarizado" },
    { nombre: "Polarizado Parabrisas",             cat: "Polarizado" },
    { nombre: "Pulido de Ópticas",                 cat: "Estética"   },
    { nombre: "Lavado de Tapizado",                cat: "Estética"   },
    { nombre: "Restauración de Plásticos",         cat: "Estética"   },
    { nombre: "Detailing Exterior",                cat: "Detailing"  },
    { nombre: "Detailing Completo",                cat: "Detailing"  },
    { nombre: "Nano Cerámica",                     cat: "Detailing"  },
    { nombre: "Lavado Común",                      cat: "Lavado"     },
    { nombre: "Lavado Común SUV / Camioneta",      cat: "Lavado"     },
    { nombre: "Lavado Premium",                    cat: "Lavado"     },
    { nombre: "Lavado Premium SUV / Camioneta",    cat: "Lavado"     },
    { nombre: "Lavado de Moto",                    cat: "Lavado"     },
    { nombre: "Combo Polarizado + Lavado Premium", cat: "Combo"      },
    { nombre: "Combo Detailing + Cerámica",        cat: "Combo"      },
    { nombre: "Combo Estética Completa",           cat: "Combo"      },
];

// 📅 CONTROL DE DIAS Y HORARIOS OCUPADOS (Agregado manual por los dueños)
// Formato: "AAAA-MM-DD": ["HH:MM", "HH:MM"]
const HORARIOS_OCUPADOS = {
    "2026-07-10": ["14:00", "16:00"],
    "2026-07-12": ["18:00", "20:00"],
};

// Horarios estándar del taller
const HORARIOS_BASE = ["14:00", "16:00", "18:00", "20:00"];

// ── Estado del formulario (Actualizado a 4 pasos) ──
const estado = {
    pasoActual: 1,
    totalPasos: 4,
    servicioSeleccionado: null,
    fechaSeleccionada: null,
    horaSeleccionada: null
};

// ── Elementos ─────────────────────────────
const pasos       = document.querySelectorAll(".form-seccion");
const stepItems   = document.querySelectorAll(".step-item");
const stepLines   = document.querySelectorAll(".step-line");
const formWrap    = document.getElementById("turnoFormWrap");
const successBox  = document.getElementById("turnoSuccess");
const inputFecha  = document.getElementById("fechaTurno");
const horasGrid   = document.getElementById("horasGrid");

// Bloquear fechas pasadas en el calendario nativo (si es que aún existe en el HTML)
if (inputFecha) {
  inputFecha.min = new Date().toISOString().split("T")[0];
}

// ── Render chips de servicios (INTACTO, SÚPER CLEAN) ──────────────
function renderChips() {
  const grid = document.getElementById("serviciosGrid");
  if (!grid) return;
  grid.innerHTML = "";

  SERVICIOS.forEach(s => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "servicio-chip";
    chip.dataset.nombre = s.nombre;
    chip.innerHTML = `<span class="chip-cat">${s.cat}</span>${s.nombre}`;

    chip.addEventListener("click", () => {
      document.querySelectorAll(".servicio-chip").forEach(c => c.classList.remove("seleccionado"));
      chip.classList.add("seleccionado");
      estado.servicioSeleccionado = s.nombre;
      document.getElementById("errorServicio").classList.remove("visible");
    });

    grid.appendChild(chip);
  });
}

// ── Render del selector de horas dinámico ──
function renderHorarios(fecha) {
  horasGrid.innerHTML = "";
  estado.horaSeleccionada = null; // Resetear selección previa cada vez que cambia el día
  
  const ocupadosHoy = HORARIOS_OCUPADOS[fecha] || [];

  HORARIOS_BASE.forEach(hora => {
    const chip = document.createElement("div");
    chip.className = "hora-chip";
    chip.textContent = hora + " hs";

    if (ocupadosHoy.includes(hora)) {
      chip.classList.add("deshabilitado");
    } else {
      chip.addEventListener("click", () => {
        document.querySelectorAll(".hora-chip").forEach(c => c.classList.remove("seleccionado"));
        chip.classList.add("seleccionado");
        estado.horaSeleccionada = hora;
        document.getElementById("error_hora").classList.remove("visible");
      });
    }
    horasGrid.appendChild(chip);
  });
}

// Listener para el input nativo (como respaldo si conviven ambos)
if (inputFecha) {
  inputFecha.addEventListener("change", (e) => {
    estado.fechaSeleccionada = e.target.value;
    document.getElementById("error_fecha").classList.remove("visible");
    renderHorarios(e.target.value);
  });
}


// ── MOTOR DE CALENDARIO CUSTOM INTEGRADO ──
let fechaActualCal = new Date(); // Mes en pantalla

function renderCalendario() {
  const contenedorDias = document.getElementById("calendarDays");
  const tituloMesAnio    = document.getElementById("calendarMonthYear");
  
  if (!contenedorDias || !tituloMesAnio) return;
  
  contenedorDias.innerHTML = "";
  
  const anio = fechaActualCal.getFullYear();
  const mes  = fechaActualCal.getMonth();
  
  // Nombres de meses para el título
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  tituloMesAnio.textContent = `${meses[mes]} ${anio}`;
  
  // Primer día del mes y total de días
  const primerDiaIndex = new Date(anio, mes, 1).getDay();
  const totalDias      = new Date(anio, mes + 1, 0).getDate();
  
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  
  // Crear espacios vacíos para los días del mes anterior
  for (let i = 0; i < primerDiaIndex; i++) {
    const espacio = document.createElement("div");
    espacio.className = "day-chip vacio";
    contenedorDias.appendChild(espacio);
  }
  
  // Renderizar los números del mes
  for (let dia = 1; dia <= totalDias; dia++) {
    const chipDay = document.createElement("div");
    chipDay.className = "day-chip";
    chipDay.textContent = dia;
    
    // Formato de fecha de este chip: AAAA-MM-DD
    const mesFormateado = String(mes + 1).padStart(2, '0');
    const diaFormateado = String(dia).padStart(2, '0');
    const stringFechaChip = `${anio}-${mesFormateado}-${diaFormateado}`;
    
    const fechaChipObj = new Date(anio, mes, dia);
    
    // Controlar si el día ya pasó
    if (fechaChipObj < hoy) {
      chipDay.classList.add("pasado");
    } else {
      // Si es el día que el usuario ya seleccionó previamente
      if (estado.fechaSeleccionada === stringFechaChip) {
        chipDay.classList.add("seleccionado");
      }
      
      chipDay.addEventListener("click", () => {
        document.querySelectorAll(".day-chip").forEach(d => d.classList.remove("seleccionado"));
        chipDay.classList.add("seleccionado");
        
        estado.fechaSeleccionada = stringFechaChip;
        const errFecha = document.getElementById("error_fecha");
        if (errFecha) errFecha.classList.remove("visible");
        
        // Ejecuta el renderizado de horas dinámico
        renderHorarios(stringFechaChip);
      });
    }
    
    contenedorDias.appendChild(chipDay);
  }
}

// Triggers para las flechas de navegación del mes
const prevMonthBtn = document.getElementById("prevMonth");
if (prevMonthBtn) {
  prevMonthBtn.addEventListener("click", () => {
    fechaActualCal.setMonth(fechaActualCal.getMonth() - 1);
    renderCalendario();
  });
}

const nextMonthBtn = document.getElementById("nextMonth");
if (nextMonthBtn) {
  nextMonthBtn.addEventListener("click", () => {
    fechaActualCal.setMonth(fechaActualCal.getMonth() + 1);
    renderCalendario();
  });
}


// ── Autocompletar desde URL (?servicio=...) ─
function autocompletarServicio() {
  const params  = new URLSearchParams(window.location.search);
  const nombre  = params.get("servicio");
  if (!nombre) return;

  const chip = [...document.querySelectorAll(".servicio-chip")]
    .find(c => c.dataset.nombre === nombre);

  if (chip) {
    chip.classList.add("seleccionado");
    chip.scrollIntoView({ block: "nearest" });
    estado.servicioSeleccionado = nombre;
  }
}

// ── Actualizar barra de pasos ──────────────
function actualizarSteps() {
  stepItems.forEach((item, i) => {
    const num = i + 1;
    item.classList.remove("activo", "completado");
    if (num === estado.pasoActual)  item.classList.add("activo");
    if (num < estado.pasoActual)    item.classList.add("completado");
  });
  stepLines.forEach((line, i) => {
    line.classList.toggle("completado", i + 1 < estado.pasoActual);
  });
}

// ── Mostrar paso ──────────────────────────
function mostrarPaso(num) {
  pasos.forEach(p => p.classList.remove("activa"));
  const pasoTarget = document.getElementById(`paso${num}`);
  if (pasoTarget) pasoTarget.classList.add("activa");
  estado.pasoActual = num;
  actualizarSteps();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ── Validaciones por paso ──────────────────
function validarPaso1() {
  if (!estado.servicioSeleccionado) {
    document.getElementById("errorServicio").classList.add("visible");
    return false;
  }
  return true;
}

function validarPaso2() {
  const campos = ["nombre", "telefono", "mail", "zona", "direccion", "marcaVehiculo", "modeloVehiculo", "anioVehiculo"];
  let valido = true;

  campos.forEach(id => {
    const input = document.getElementById(id);
    if (!input) return;
    const error = document.getElementById(`error_${id}`);
    const vacio = !input.value.trim();

    input.classList.toggle("error", vacio);
    if (error) error.classList.toggle("visible", vacio);
    if (vacio) valido = false;
  });

  // Validar mail
  const mail = document.getElementById("mail");
  const errorMail = document.getElementById("error_mail");
  if (mail && mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value)) {
    mail.classList.add("error");
    if (errorMail) { errorMail.textContent = "Ingresá un mail válido."; errorMail.classList.add("visible"); }
    valido = false;
  }

  // Validar año
  const anio = document.getElementById("anioVehiculo");
  const errorAnio = document.getElementById("error_anioVehiculo");
  if (anio && anio.value.trim()) {
    const anioVal = parseInt(anio.value);
    if (anioVal < 1960 || anioVal > new Date().getFullYear() + 1) {
      anio.classList.add("error");
      if (errorAnio) { errorAnio.textContent = "Ingresá un año válido."; errorAnio.classList.add("visible"); }
      valido = false;
    }
  }

  return valido;
}

function validarPaso3() {
  let valido = true;
  if (!estado.fechaSeleccionada) {
    document.getElementById("error_fecha").classList.add("visible");
    valido = false;
  }
  if (!estado.horaSeleccionada) {
    document.getElementById("error_hora").classList.add("visible");
    valido = false;
  }
  return valido;
}

// ── Limpiar error al escribir ──────────────
function limpiarError(id) {
  const el = document.getElementById(id);
  const err = document.getElementById(`error_${id}`);
  if (el) el.classList.remove("error");
  if (err) err.classList.remove("visible");
}

// ── Cargar resumen paso 4 ──────────────────
function cargarResumen() {
  document.getElementById("resServicio").textContent  = estado.servicioSeleccionado;
  document.getElementById("resNombre").textContent    = document.getElementById("nombre").value;
  document.getElementById("resTelefono").textContent  = document.getElementById("telefono").value;
  document.getElementById("resMail").textContent      = document.getElementById("mail").value;
  document.getElementById("resZona").textContent      = document.getElementById("zona").value;
  document.getElementById("resDireccion").textContent = document.getElementById("direccion").value;
  
  if (estado.fechaSeleccionada) {
    const [anio, mes, dia] = estado.fechaSeleccionada.split("-");
    document.getElementById("resFecha").textContent     = `${dia}/${mes}/${anio}`;
  }
  document.getElementById("resHora").textContent      = `${estado.horaSeleccionada} hs`;

  document.getElementById("resVehiculo").textContent  =
    `${document.getElementById("marcaVehiculo").value} ${document.getElementById("modeloVehiculo").value} (${document.getElementById("anioVehiculo").value})`;
}

// ── Enviar por WhatsApp con la nueva estructura ──
function enviarWhatsApp() {
  const nombre    = document.getElementById("nombre").value;
  const tel       = document.getElementById("telefono").value;
  const mail      = document.getElementById("mail").value;
  const zona      = document.getElementById("zona").value;
  const direccion = document.getElementById("direccion").value;
  const marca     = document.getElementById("marcaVehiculo").value;
  const modelo    = document.getElementById("modeloVehiculo").value;
  const anio      = document.getElementById("anioVehiculo").value;
  const fechaForm = document.getElementById("resFecha").textContent;
  const servicio  = estado.servicioSeleccionado;
  const hora      = estado.horaSeleccionada;

  const msg = `*Solicitud de Turno — By NTG*

🔧 *Servicio:* ${servicio}
📅 *Fecha sugerida:* ${fechaForm}
⏰ *Horario:* ${hora} hs

👤 *Datos Personales*
• Nombre: ${nombre}
• Teléfono: ${tel}
• Mail: ${mail}
• Zona: ${zona}
• Dirección Exacta: ${direccion}

🚗 *Vehículo*
• ${marca} ${modelo} (${anio})`;

  const numero = "1135706071"; 
  const url    = `https://wa.me/${numero}?text=${encodeURIComponent(msg)}`;
  window.open(url, "_blank");

  if (formWrap) formWrap.style.display = "none";
  if (successBox) successBox.classList.add("visible");
}

// ── Botones siguiente / anterior ───────────
document.getElementById("btnSiguiente1").addEventListener("click", () => {
  if (validarPaso1()) mostrarPaso(2);
});

document.getElementById("btnSiguiente2").addEventListener("click", () => {
  if (validarPaso2()) mostrarPaso(3);
});

document.getElementById("btnSiguiente3").addEventListener("click", () => {
  if (validarPaso3()) { cargarResumen(); mostrarPaso(4); }
});

document.getElementById("btnAnterior2").addEventListener("click", () => mostrarPaso(1));
document.getElementById("btnAnterior3").addEventListener("click", () => mostrarPaso(2));
document.getElementById("btnAnterior4").addEventListener("click", () => mostrarPaso(3));

document.getElementById("btnEnviar").addEventListener("click", enviarWhatsApp);

// ── Limpiar errores on input ───────────────
["nombre","telefono","mail","zona","direccion","marcaVehiculo","modeloVehiculo","anioVehiculo"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => limpiarError(id));
});

// ── Init ──────────────────────────────────
renderChips();
renderCalendario(); // ← Integrado con éxito acá adentro
actualizarSteps();
autocompletarServicio();