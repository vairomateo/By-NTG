// ==================== LÓGICA PURA (exportada para tests) ====================

export function agregarAlCarrito(carrito, producto) {
    const existe = carrito.find(item => item.id === producto.id);
    if (existe) {
        existe.cantidad++;
    } else {
        carrito.push({ ...producto, cantidad: 1 });
    }
    return carrito;
}

export function eliminarProducto(carrito, id) {
    return carrito.filter(producto => producto.id !== id);
}

export function vaciarCarrito() {
    return [];
}

// ==================== ESTADO GLOBAL Y STORAGE ====================

const WA_NUMBER = '5491135706071';
const STORAGE_KEY = 'carritoQuerandi';

// Migrar ítems viejos que no tengan imagen guardada — les ponemos string vacío
// para que el condicional en renderizarCarrito no falle
let carrito = (JSON.parse(localStorage.getItem(STORAGE_KEY)) || []).map(item => ({
    imagen: '',
    ...item   // si ya tiene imagen, la sobreescribe (conserva el valor)
}));

function guardarEnStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
    actualizarContador();
}

// ==================== ACCIONES DE PRODUCTOS ====================

export function agregarProductoAlCarrito(nombre, precio, id, imagen) {
    const producto = { id, nombre, precio, imagen: imagen || '' };
    carrito = agregarAlCarrito(carrito, producto);
    guardarEnStorage();
    mostrarToast(`"${nombre}" agregado al carrito 🧉`);
    abrirModalCarrito();
}

function quitarProducto(id) {
    carrito = eliminarProducto(carrito, id);
    guardarEnStorage();
    renderizarCarrito();
}

function cambiarCantidad(id, delta) {
    const item = carrito.find(i => i.id === id);
    if (!item) return;
    item.cantidad += delta;
    if (item.cantidad <= 0) {
        quitarProducto(id);
        return;
    }
    guardarEnStorage();
    renderizarCarrito();
}

function limpiarCarrito() {
    carrito = vaciarCarrito();
    guardarEnStorage();
}

function calcularTotal() {
    return carrito.reduce((sum, i) => sum + i.precio * i.cantidad, 0);
}

// ==================== UI - CONTADOR Y MODAL CARRITO ====================

function actualizarContador() {
    const total = carrito.reduce((s, i) => s + i.cantidad, 0);
    const badge = document.getElementById('contadorCarrito');
    if (badge) badge.textContent = total;
}

function abrirModalCarrito() {
    renderizarCarrito();
    const modalEl = document.getElementById('modalCarrito');
    if (modalEl) new bootstrap.Modal(modalEl).show();
}

function renderizarCarrito() {
    const container = document.getElementById('carritoItems');
    const totalEl   = document.getElementById('carritoTotal');
    const btnChk    = document.getElementById('finalizarCompra');
    if (!container) return;

    if (carrito.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-white-50">
                <i class="bi bi-cart-x fs-1"></i>
                <p class="mt-2">Tu carrito está vacío</p>
            </div>`;
        if (totalEl) totalEl.textContent = '$0';
        if (btnChk)  btnChk.disabled = true;
        return;
    }

    if (btnChk) btnChk.disabled = false;

    container.innerHTML = carrito.map(item => {
        const id = String(item.id);
        return `
        <div class="d-flex align-items-center gap-2 py-2 border-bottom">
            ${item.imagen
                ? `<img src="${item.imagen}" alt="${item.nombre}" width="52" height="52" style="object-fit:cover;border-radius:8px;flex-shrink:0">`
                : ''
            }
            <div class="flex-grow-1 min-width-0">
                <div class="fw-semibold small text-truncate text-white">${item.nombre}</div>
                <div class="small text-white-50">$${item.precio.toLocaleString('es-AR')} c/u</div>
            </div>
            <div class="d-flex align-items-center gap-1">
                <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-accion="restar" data-id="${id}">−</button>
                <span class="fw-bold px-1">${item.cantidad}</span>
                <button class="btn btn-sm btn-outline-secondary px-2 py-0" data-accion="sumar" data-id="${id}">+</button>
            </div>
            <div class="fw-bold small text-end" style="min-width:65px">$${(item.precio * item.cantidad).toLocaleString('es-AR')}</div>
            <button class="btn btn-sm btn-link text-danger p-0" data-accion="eliminar" data-id="${id}">
                <i class="bi bi-trash"></i>
            </button>
        </div>`;
    }).join('');

    if (totalEl) totalEl.textContent = `$${calcularTotal().toLocaleString('es-AR')}`;
}

// ==================== UI - CHECKOUT ====================

function abrirCheckout() {
    const instancia = bootstrap.Modal.getInstance(document.getElementById('modalCarrito'));
    if (instancia) instancia.hide();

    const resumen = document.getElementById('checkoutResumen');
    const totalEl = document.getElementById('checkoutTotal');

    // ACÁ ESTÁ EL BLOQUE NUEVO QUE ME PREGUNTABAS:
    if (resumen) resumen.innerHTML = carrito.map(i => `
        <div class="d-flex align-items-center gap-3 py-3 border-bottom border-secondary">
            ${i.imagen ? `<img src="${i.imagen}" width="48" height="48" style="object-fit:cover; border-radius:8px; border: 1px solid #444;">` : ''}
            <div class="flex-grow-1">
                <div class="text-white fw-bold mb-1">${i.nombre}</div>
                <span class="badge bg-dark border border-secondary text-white-50">Cant: ${i.cantidad}</span>
            </div>
            <div class="fw-bold" style="color: #cfa361; font-size: 1.1rem;">$${(i.precio * i.cantidad).toLocaleString('es-AR')}</div>
        </div>`
    ).join('');

    if (totalEl) totalEl.textContent = `$${calcularTotal().toLocaleString('es-AR')}`;

    setTimeout(() => {
        const checkoutEl = document.getElementById('modalCheckout');
        if (checkoutEl) new bootstrap.Modal(checkoutEl).show();
    }, 400);
}

function enviarPorWhatsApp() {
    const nombre    = document.getElementById('chkNombre')?.value.trim();
    const mail      = document.getElementById('chkMail')?.value.trim();
    const telefono  = document.getElementById('chkTelefono')?.value.trim();
    const cp        = document.getElementById('chkCP')?.value.trim();
    const direccion = document.getElementById('chkDireccion')?.value.trim();
    const pago      = document.getElementById('chkPago')?.value;

    // Validar que no haya campos vacíos
    if (![nombre, mail, telefono, cp, direccion, pago].every(Boolean)) {
        return mostrarToast('Completá todos los campos.', 'danger');
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(mail)) {
        return mostrarToast('El email no tiene un formato válido.', 'danger');
    }

    // Validar que teléfono tenga solo números y al menos 8 dígitos
    const telefonoRegex = /^[0-9+\s\-]{8,}$/;
    if (!telefonoRegex.test(telefono)) {
        return mostrarToast('El teléfono no es válido.', 'danger');
    }

    let msg = `🧉 *NUEVO PEDIDO - Querandí Mates*\n\n📦 *PRODUCTOS:*\n`;
    carrito.forEach(i => msg += `• ${i.nombre} x${i.cantidad} → $${(i.precio * i.cantidad).toLocaleString('es-AR')}\n`);
    msg += `\n💰 *TOTAL: $${calcularTotal().toLocaleString('es-AR')}*\n\n👤 *DATOS DEL CLIENTE:*\n• Nombre: ${nombre}\n• Mail: ${mail}\n• Tel: ${telefono}\n• CP: ${cp}\n• Dirección: ${direccion}\n• Método de pago: ${pago}`;

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, '_blank');

    limpiarCarrito();
    renderizarCarrito();

    // Esperar a que el modal de checkout termine de cerrarse, DESPUÉS abrir confirmación
    const checkoutEl = document.getElementById('modalCheckout');
    const checkoutInstance = bootstrap.Modal.getInstance(checkoutEl);

    if (checkoutInstance) {
        checkoutEl.addEventListener('hidden.bs.modal', () => {
            new bootstrap.Modal(document.getElementById('modalConfirmacion')).show();
        }, { once: true }); // { once: true } = se dispara una sola vez y se auto-elimina
        checkoutInstance.hide();
    } else {
        new bootstrap.Modal(document.getElementById('modalConfirmacion')).show();
    }
}

// ==================== TOAST ====================

function mostrarToast(mensaje, tipo = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const id = 'toast_' + Date.now();
    const color = tipo === 'danger' ? '#dc3545' : '#795548';
    container.insertAdjacentHTML('beforeend',
        `<div id="${id}" class="toast align-items-center text-white border-0 show" style="background-color:${color}">
            <div class="d-flex">
                <div class="toast-body">${mensaje}</div>
                <button type="button" class="btn-close btn-close-white m-auto me-2" onclick="this.closest('.toast').remove()"></button>
            </div>
        </div>`
    );
    setTimeout(() => document.getElementById(id)?.remove(), 3500);
}

// ==================== INIT ====================

document.addEventListener('DOMContentLoaded', () => {
    actualizarContador();

    document.getElementById('btnAbrirCarrito')?.addEventListener('click', abrirModalCarrito);

    // Event delegation — botones + - y tacho dentro del carrito
    document.getElementById('modalCarrito')?.addEventListener('click', e => {
        const btn = e.target.closest('[data-accion]');
        if (!btn) return;
        const id      = btn.dataset.id;
        const accion  = btn.dataset.accion;
        const idFinal = Number(id);
        if (accion === 'sumar')    cambiarCantidad(idFinal, 1);
        if (accion === 'restar')   cambiarCantidad(idFinal, -1);
        if (accion === 'eliminar') quitarProducto(idFinal);
    });

    document.getElementById('finalizarCompra')?.addEventListener('click', abrirCheckout);

    document.getElementById('vaciarCarrito')?.addEventListener('click', () => {
        limpiarCarrito();
        renderizarCarrito();
    });

    document.getElementById('btnEnviarCompra')?.addEventListener('click', enviarPorWhatsApp);
});
