/* ===========================================================
   TP3 - Catálogo MyTems: lógica (JavaScript puro + Bootstrap 5)
   Secciones:
     1. Estado y utilidades        5. Modal de detalle
     2. Carga del JSON             6. Carrito (cantidades y stock)
     3. Buscador y filtros         7. Eventos y arranque
     4. Dibujo de la cuadrícula
   =========================================================== */

(function () {
    'use strict';

    /* ---------- 1. ESTADO Y UTILIDADES ---------- */
    const URL_PRODUCTOS = 'data/productos.json';
    const CLAVE_CARRITO = 'mytems_carrito_v1';

    let productos = [];     // se llena desde el JSON
    let carrito = {};       // { idProducto: cantidad }  -> un solo renglón por producto (multiplicador)
    let productoModal = null;

    const $ = (selector) => document.querySelector(selector);
    const dinero = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD' });

    // Quita acentos y pasa a minúsculas: "CAÓS" -> "caos". Sirve para buscar sin importar tildes ni mayúsculas
    function normalizar(texto) {
        return String(texto).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
    }

    // Evita que un texto del JSON se interprete como HTML
    function escapar(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }

    function buscarProducto(id) {
        return productos.find((p) => p.id === id);
    }

    function mostrarAviso(texto) {
        $('#toastTexto').textContent = texto;
        bootstrap.Toast.getOrCreateInstance($('#toastAviso'), { delay: 2600 }).show();
    }

    /* ---------- 2. CARGA DEL JSON ---------- */
    async function cargarProductos() {
        try {
            const respuesta = await fetch(URL_PRODUCTOS);
            if (!respuesta.ok) { throw new Error('HTTP ' + respuesta.status); }
            productos = await respuesta.json();
        } catch (error) {
            // Si se abre el archivo con doble clic (file://), el navegador bloquea fetch por seguridad
            const sinServidor = location.protocol === 'file:';
            $('#errorCarga').innerHTML = sinServidor
                ? '<strong>No se pudo leer data/productos.json.</strong> El navegador bloquea la lectura de archivos cuando la página se abre con doble clic. Abrila con <em>Live Server</em> (VS Code), con <code>python -m http.server</code> o desde GitHub Pages.'
                : '<strong>No se pudieron cargar los productos.</strong> Probá de nuevo más tarde.';
            $('#errorCarga').classList.remove('d-none');
            return false;
        }
        return true;
    }

    /* ---------- 3. BUSCADOR Y FILTROS ---------- */

    // Llena los <select> con los valores que existen en el JSON (sin repetir)
    function cargarOpcionesDeFiltros() {
        const juegos = [...new Set(productos.map((p) => p.juego))].sort();
        const tipos  = [...new Set(productos.map((p) => p.tipo))].sort();
        juegos.forEach((j) => $('#filtroJuego').add(new Option(j, j)));
        tipos.forEach((t) => $('#filtroTipo').add(new Option(t, t)));
    }

    // Devuelve la lista filtrada y ordenada según lo que haya en los controles
    function productosVisibles() {
        const texto = normalizar($('#buscador').value);
        const juego = $('#filtroJuego').value;
        const tipo  = $('#filtroTipo').value;
        const minTexto = $('#precioMin').value;
        const maxTexto = $('#precioMax').value;
        const min = minTexto === '' ? 0 : parseFloat(minTexto);
        const max = maxTexto === '' ? Infinity : parseFloat(maxTexto);

        // Validación del rango de precios
        const rangoInvalido = min > max;
        $('#errorPrecio').classList.toggle('d-none', !rangoInvalido);
        if (rangoInvalido) { return []; }

        let lista = productos.filter((p) =>
            // includes() encuentra el texto al comienzo, en el medio o al final del nombre
            normalizar(p.nombre).includes(texto) &&
            (juego === '' || p.juego === juego) &&
            (tipo === '' || p.tipo === tipo) &&
            p.precio >= min && p.precio <= max
        );

        switch ($('#orden').value) {
            case 'precio-asc':  lista.sort((a, b) => a.precio - b.precio); break;
            case 'precio-desc': lista.sort((a, b) => b.precio - a.precio); break;
            case 'nombre':      lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es')); break;
        }
        return lista;
    }

    function limpiarFiltros() {
        $('#buscador').value = '';
        $('#formFiltros').reset();
        dibujarCatalogo();
    }

    /* ---------- 4. DIBUJO DE LA CUADRÍCULA ---------- */
    function textoStock(p) {
        const libres = p.stock - (carrito[p.id] || 0);
        if (libres <= 0) { return '<span class="stock-cero">Sin stock disponible</span>'; }
        if (libres <= 3) { return `<span class="stock-bajo">¡Quedan ${libres}!</span>`; }
        return `<span class="stock-ok">Stock: ${libres}</span>`;
    }

    function dibujarCatalogo() {
        const lista = productosVisibles();
        const grilla = $('#grilla');

        grilla.innerHTML = lista.map((p) => {
            const agotado = (carrito[p.id] || 0) >= p.stock;
            return `
            <div class="col-12 col-sm-6 col-xl-4">
                <article class="producto">
                    <div class="marco-img"><img src="${escapar(p.imagen)}" alt="${escapar(p.nombre)}" loading="lazy"></div>
                    <div class="p-3 d-flex flex-column flex-grow-1">
                        <span class="badge etiqueta align-self-start mb-2">${escapar(p.juego)}</span>
                        <h3>${escapar(p.nombre)}</h3>
                        <p class="text-secondary small mb-2">${escapar(p.descripcion)}</p>
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-baseline mb-2">
                                <span class="h5 precio mb-0">${dinero.format(p.precio)}</span>
                                <span class="small">${textoStock(p)}</span>
                            </div>
                            <div class="d-flex gap-2">
                                <button class="btn btn-outline-secondary btn-sm flex-fill" data-accion="detalle" data-id="${p.id}">Detalles</button>
                                <button class="btn btn-primario btn-sm flex-fill" data-accion="agregar" data-id="${p.id}" ${agotado ? 'disabled' : ''}>Agregar</button>
                            </div>
                        </div>
                    </div>
                </article>
            </div>`;
        }).join('');

        // El mensaje "sin resultados" solo se ve cuando la lista queda vacía
        $('#sinResultados').classList.toggle('d-none', lista.length > 0);
        $('#resultados').textContent = `${lista.length} de ${productos.length} productos`;
    }

    /* ---------- 5. MODAL DE DETALLE ---------- */
    function abrirDetalle(id) {
        const p = buscarProducto(id);
        if (!p) { return; }
        productoModal = p;
        $('#modalTitulo').textContent = p.nombre;
        $('#modalImg').src = p.imagen;
        $('#modalImg').alt = p.nombre;
        $('#modalJuego').textContent = p.juego;
        $('#modalTipo').textContent = p.tipo;
        $('#modalDetalleTexto').textContent = p.detalle;
        $('#modalPrecio').textContent = dinero.format(p.precio);
        actualizarModal();
        bootstrap.Modal.getOrCreateInstance($('#modalDetalle')).show();
    }

    // Refresca el stock disponible y el botón del modal (se usa al abrir y al agregar)
    function actualizarModal() {
        if (!productoModal) { return; }
        const libres = productoModal.stock - (carrito[productoModal.id] || 0);
        $('#modalStock').textContent = libres > 0
            ? `Unidades disponibles: ${libres} (en tu carrito: ${carrito[productoModal.id] || 0})`
            : 'Ya agregaste todo el stock disponible de este producto.';
        $('#modalAgregar').disabled = libres <= 0;
    }

    /* ---------- 6. CARRITO ---------- */

    // Agrega unidades respetando el stock. Devuelve true si pudo agregar.
    function agregarAlCarrito(id, cantidad = 1) {
        const p = buscarProducto(id);
        if (!p) { return false; }
        const actual = carrito[id] || 0;
        if (actual + cantidad > p.stock) {
            mostrarAviso(`Stock máximo alcanzado: solo hay ${p.stock} unidad(es) de "${p.nombre}".`);
            return false;
        }
        carrito[id] = actual + cantidad;
        guardarCarrito();
        refrescarTodo();
        return true;
    }

    function cambiarCantidad(id, delta) {
        const p = buscarProducto(id);
        const nueva = (carrito[id] || 0) + delta;
        if (nueva > p.stock) { mostrarAviso(`Stock máximo alcanzado: solo hay ${p.stock} unidad(es).`); return; }
        if (nueva <= 0) { delete carrito[id]; } else { carrito[id] = nueva; }
        guardarCarrito();
        refrescarTodo();
    }

    function quitarDelCarrito(id) {
        delete carrito[id];
        guardarCarrito();
        refrescarTodo();
    }

    function vaciarCarrito() {
        carrito = {};
        guardarCarrito();
        refrescarTodo();
    }

    function totalCarrito() {
        return Object.entries(carrito).reduce((suma, [id, cant]) => suma + buscarProducto(Number(id)).precio * cant, 0);
    }

    function unidadesCarrito() {
        return Object.values(carrito).reduce((suma, cant) => suma + cant, 0);
    }

    function dibujarCarrito() {
        const ids = Object.keys(carrito).map(Number);
        $('#carritoVacio').classList.toggle('d-none', ids.length > 0);
        $('#resumenCarrito').classList.toggle('d-none', ids.length === 0);
        $('#contadorCarrito').textContent = unidadesCarrito();

        $('#listaCarrito').innerHTML = ids.map((id) => {
            const p = buscarProducto(id);
            const cant = carrito[id];
            const enTope = cant >= p.stock;
            return `
            <li>
                <div class="mini"><img src="${escapar(p.imagen)}" alt=""></div>
                <div>
                    <div class="d-flex justify-content-between gap-2">
                        <strong class="small">${escapar(p.nombre)}</strong>
                        <button class="btn-close btn-sm" aria-label="Quitar ${escapar(p.nombre)}" data-accion="quitar" data-id="${id}"></button>
                    </div>
                    <div class="small text-secondary">${dinero.format(p.precio)} c/u</div>
                    <div class="d-flex justify-content-between align-items-center mt-1">
                        <div class="cantidad">
                            <button class="btn btn-outline-secondary btn-sm" data-accion="menos" data-id="${id}" aria-label="Restar una unidad">&minus;</button>
                            <span>${cant}</span>
                            <button class="btn btn-outline-secondary btn-sm" data-accion="mas" data-id="${id}" aria-label="Sumar una unidad" ${enTope ? 'disabled title="Stock máximo"' : ''}>+</button>
                        </div>
                        <strong class="precio">${dinero.format(p.precio * cant)}</strong>
                    </div>
                </div>
            </li>`;
        }).join('');

        $('#totalCarrito').textContent = dinero.format(totalCarrito());
    }

    // Persistencia: el carrito sobrevive si se recarga la página
    function guardarCarrito() {
        try { localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito)); } catch (e) { /* sin almacenamiento: se sigue en memoria */ }
    }

    function restaurarCarrito() {
        try {
            const guardado = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || '{}');
            Object.entries(guardado).forEach(([id, cant]) => {
                const p = buscarProducto(Number(id));
                // Se descartan productos que ya no existen y se limita la cantidad al stock actual
                if (p && Number.isInteger(cant) && cant > 0) { carrito[p.id] = Math.min(cant, p.stock); }
            });
        } catch (e) { carrito = {}; }
    }

    function finalizarCompra() {
        const total = dinero.format(totalCarrito());
        const unidades = unidadesCarrito();
        vaciarCarrito();
        const mensaje = $('#mensajeCompra');
        mensaje.textContent = `¡Compra simulada! ${unidades} ítem(s) por ${total}. En la tienda real, acá se pasaría a la página de pago.`;
        mensaje.classList.remove('d-none');
        setTimeout(() => mensaje.classList.add('d-none'), 6000);
    }

    // Vuelve a dibujar todo lo que depende del carrito
    function refrescarTodo() {
        dibujarCatalogo();
        dibujarCarrito();
        actualizarModal();
    }

    /* ---------- 7. EVENTOS Y ARRANQUE ---------- */
    function conectarEventos() {
        // Buscador y filtros: cada cambio redibuja el catálogo
        ['#buscador', '#filtroJuego', '#filtroTipo', '#precioMin', '#precioMax', '#orden'].forEach((sel) => {
            $(sel).addEventListener('input', dibujarCatalogo);
        });
        $('#btnLimpiar').addEventListener('click', limpiarFiltros);
        $('#btnLimpiar2').addEventListener('click', limpiarFiltros);
        $('#formFiltros').addEventListener('submit', (e) => e.preventDefault());

        // Delegación de eventos: un solo "click" para todos los botones de las tarjetas y del carrito
        document.addEventListener('click', (e) => {
            const boton = e.target.closest('[data-accion]');
            if (!boton) { return; }
            const id = Number(boton.dataset.id);
            switch (boton.dataset.accion) {
                case 'detalle':  abrirDetalle(id); break;
                case 'agregar':  agregarAlCarrito(id); break;
                case 'mas':      cambiarCantidad(id, +1); break;
                case 'menos':    cambiarCantidad(id, -1); break;
                case 'quitar':   quitarDelCarrito(id); break;
            }
        });

        $('#modalAgregar').addEventListener('click', () => { if (productoModal) { agregarAlCarrito(productoModal.id); } });
        $('#btnVaciar').addEventListener('click', vaciarCarrito);
        $('#btnComprar').addEventListener('click', finalizarCompra);
    }

    async function iniciar() {
        conectarEventos();
        if (await cargarProductos()) {
            cargarOpcionesDeFiltros();
            restaurarCarrito();
            refrescarTodo();
        }
    }

    iniciar();
})();
