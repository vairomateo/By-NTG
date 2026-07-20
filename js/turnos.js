// ==========================================
//   BY NTG — turnos.js (Catálogo Actualizado)
// ==========================================

const SERVICIOS = [
    // 🚗 POLARIZADOS (Lámina Premium)
    { nombre: "Polarizado Premium - Auto ($85.000)", cat: "Polarizado" },
    { nombre: "Polarizado Premium - SUV ($95.000)", cat: "Polarizado" },
    { nombre: "Polarizado Premium - Camioneta ($95.000 a $115.000)", cat: "Polarizado" },

    // ✨ ABRILLANTADOS (Descontaminación incluida)
    { nombre: "Abrillantado Común (1 Paso) - Auto ($70.000)", cat: "Estética" },
    { nombre: "Abrillantado Común (1 Paso) - SUV ($85.000)", cat: "Estética" },
    { nombre: "Abrillantado Común (1 Paso) - Camioneta ($100.000)", cat: "Estética" },
    { nombre: "Abrillantado Profundo (2 Pasos) - Auto ($90.000)", cat: "Estética" },
    { nombre: "Abrillantado Profundo (2 Pasos) - SUV ($100.000)", cat: "Estética" },
    { nombre: "Abrillantado Profundo (2 Pasos) - Camioneta ($130.000)", cat: "Estética" },

    // 🧽 LIMPIEZA DE TAPIZADOS
    { nombre: "Limpieza de Tapizados - Auto ($70.000)", cat: "Estética" },
    { nombre: "Limpieza de Tapizados - SUV ($85.000)", cat: "Estética" },
    { nombre: "Limpieza de Tapizados - Camioneta ($100.000)", cat: "Estética" },

    // ⚙️ LIMPIEZA DE MOTOR
    { nombre: "Limpieza de Motor Básica - Auto ($25.000)", cat: "Estética" },
    { nombre: "Limpieza de Motor Básica - SUV ($30.000)", cat: "Estética" },
    { nombre: "Limpieza de Motor Básica - Camioneta ($35.000)", cat: "Estética" },
    { nombre: "Limpieza de Motor Premium - Auto ($45.000)", cat: "Estética" },
    { nombre: "Limpieza de Motor Premium - SUV ($50.000)", cat: "Estética" },
    { nombre: "Limpieza de Motor Premium - Camioneta ($60.000)", cat: "Estética" },

    // 💡 PULIDO DE ÓPTICAS
    { nombre: "Pulido de Ópticas (1 Óptica - $25.000)", cat: "Estética" },
    { nombre: "Pulido de Ópticas (2 Ópticas - $40.000)", cat: "Estética" },

    // 🏍️ LAVADO DE MOTOS (Estético)
    { nombre: "Lavado Estético Moto 110cc ($15.000)", cat: "Lavado" },
    { nombre: "Lavado Estético Moto 150cc ($25.000)", cat: "Lavado" },
    { nombre: "Lavado Estético Moto 250cc ($30.000)", cat: "Lavado" },
    { nombre: "Lavado Estético Moto 400cc ($35.000)", cat: "Lavado" },
    { nombre: "Lavado Estético Moto 600cc ($45.000)", cat: "Lavado" },

    // 🏍️ LAVADO DE MOTOS (Profundo)
    { nombre: "Lavado Profundo Moto 110cc ($25.000)", cat: "Lavado" },
    { nombre: "Lavado Profundo Moto 150cc ($50.000)", cat: "Lavado" },
    { nombre: "Lavado Profundo Moto 250cc ($65.000)", cat: "Lavado" },
    { nombre: "Lavado Profundo Moto 400cc ($75.000)", cat: "Lavado" },
    { nombre: "Lavado Profundo Moto 600cc ($85.000)", cat: "Lavado" },

    // 💎 OTROS SERVICIOS Y DETAILING
    { nombre: "Limpieza y Nutrición de Plásticos Interiores", cat: "Detailing" },
    { nombre: "Limpieza y Nutrición de Plásticos Exteriores", cat: "Detailing" },
    { nombre: "Limpieza de Chasis", cat: "Detailing" },
    { nombre: "Detailing Completo de Moto", cat: "Detailing" }
];

// 📅 CONTROL DE DIAS Y HORARIOS OCUPADOS (Agregado manual por los dueños)
const HORARIOS_OCUPADOS = {
    "2026-07-10": ["14:00", "16:00", "18:00"],
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

if (inputFecha) {
  inputFecha.min = new Date().toISOString().split("T")[0];
}

// ── Render chips de servicios (DISEÑO CLEAN ORIGINAL INTACTO) ──────────────
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
  estado.horaSeleccionada = null; 
  
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

if (inputFecha) {
  inputFecha.addEventListener("change", (e) => {
    estado.fechaSeleccionada = e.target.value;
    document.getElementById("error_fecha").classList.remove("visible");
    renderHorarios(e.target.value);
  });
}


// ── MOTOR DE CALENDARIO CUSTOM INTEGRADO ──
let fechaActualCal = new Date(); 

function renderCalendario() {
  const contenedorDias = document.getElementById("calendarDays");
  const tituloMesAnio    = document.getElementById("calendarMonthYear");
  
  if (!contenedorDias || !tituloMesAnio) return;
  
  contenedorDias.innerHTML = "";
  
  const anio = fechaActualCal.getFullYear();
  const mes  = fechaActualCal.getMonth();
  
  const meses = [
    "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
    "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
  ];
  tituloMesAnio.textContent = `${meses[mes]} ${anio}`;
  
  const primerDiaIndex = new Date(anio, mes, 1).getDay();
  const totalDias      = new Date(anio, mes + 1, 0).getDate();
  
  const hoy = new Date();
  hoy.setHours(0,0,0,0);
  
  for (let i = 0; i < primerDiaIndex; i++) {
    const espacio = document.createElement("div");
    espacio.className = "day-chip vacio";
    contenedorDias.appendChild(espacio);
  }
  
  for (let dia = 1; dia <= totalDias; dia++) {
    const chipDay = document.createElement("div");
    chipDay.className = "day-chip";
    chipDay.textContent = dia;
    
    const mesFormateado = String(mes + 1).padStart(2, '0');
    const diaFormateado = String(dia).padStart(2, '0');
    const stringFechaChip = `${anio}-${mesFormateado}-${diaFormateado}`;
    
    const fechaChipObj = new Date(anio, mes, dia);
    
    if (fechaChipObj < hoy) {
      chipDay.classList.add("pasado");
    } else {
      if (estado.fechaSeleccionada === stringFechaChip) {
        chipDay.classList.add("seleccionado");
      }
      
      chipDay.addEventListener("click", () => {
        document.querySelectorAll(".day-chip").forEach(d => d.classList.remove("seleccionado"));
        chipDay.classList.add("seleccionado");
        
        estado.fechaSeleccionada = stringFechaChip;
        const errFecha = document.getElementById("error_fecha");
        if (errFecha) errFecha.classList.remove("visible");
        
        renderHorarios(stringFechaChip);
      });
    }
    
    contenedorDias.appendChild(chipDay);
  }
}

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

// ── Validar Paso 2 ──
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

  const mail = document.getElementById("mail");
  const errorMail = document.getElementById("error_mail");
  if (mail && mail.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value)) {
    mail.classList.add("error");
    if (errorMail) { errorMail.textContent = "Ingresá un mail válido."; errorMail.classList.add("visible"); }
    valido = false;
  }

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

  const numero = "1135706315"; 
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

["nombre","telefono","mail","zona","direccion","marcaVehiculo","modeloVehiculo","anioVehiculo"].forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener("input", () => limpiarError(id));
});

// ── Init ──────────────────────────────────
renderChips();
renderCalendario(); 
actualizarSteps();
autocompletarServicio();