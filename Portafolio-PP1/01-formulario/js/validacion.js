/* ===========================================================
   TP2 - Ejercicio 1: validación y envío del formulario
   - Usa la Constraint Validation API de HTML5 (checkValidity)
   - Muestra los mensajes de Bootstrap (clase .was-validated)
   - El "envío" es simulado en el cliente (maquetado estático):
     arma los datos, genera un número de seguimiento y confirma.
   =========================================================== */

(function () {
    'use strict';

    // Referencias a los elementos del DOM
    const formulario   = document.getElementById('formReporte');
    const campoFecha   = document.getElementById('fecha');
    const descripcion  = document.getElementById('descripcion');
    const contador     = document.getElementById('contador');
    const confirmacion = document.getElementById('confirmacion');
    const spinner      = document.getElementById('spinner');
    const textoBtn     = document.getElementById('textoBtn');
    const btnEnviar    = document.getElementById('btnEnviar');

    // 1) La fecha del incidente no puede ser futura: máximo = hoy
    const hoy = new Date();
    const aaaa = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    campoFecha.max = `${aaaa}-${mm}-${dd}`;

    // 2) Contador de caracteres de la descripción
    descripcion.addEventListener('input', function () {
        contador.textContent = `${descripcion.value.length} / ${descripcion.maxLength}`;
    });

    // 3) Al enviar: validar; si hay errores, no se envía
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();   // nunca recargamos la página

        if (!formulario.checkValidity()) {
            evento.stopPropagation();
            formulario.classList.add('was-validated');   // muestra errores
            // Lleva el foco al primer campo inválido
            const primero = formulario.querySelector(':invalid');
            if (primero) { primero.focus(); }
            return;
        }

        enviarReporte();
    });

    // 4) Al limpiar, se quitan los estados de validación
    formulario.addEventListener('reset', function () {
        formulario.classList.remove('was-validated');
        contador.textContent = '0 / ' + descripcion.maxLength;
    });

    // Envío simulado: espera breve, confirma y limpia el formulario
    function enviarReporte() {
        const datos = Object.fromEntries(new FormData(formulario).entries());

        // Estado "enviando": se deshabilita el botón para evitar doble clic
        btnEnviar.disabled = true;
        spinner.classList.remove('d-none');
        textoBtn.textContent = 'Enviando…';

        setTimeout(function () {
            // En un sistema real, acá iría: fetch('/api/reportes', { method: 'POST', body: JSON.stringify(datos) })
            const numero = String(Math.floor(Math.random() * 9000) + 1000);
            document.getElementById('ticket').textContent = `INC-${aaaa}-${numero}`;
            document.getElementById('resumen').textContent =
                `${datos.tipo} · gravedad ${datos.gravedad.toLowerCase()} · ${datos.area}.`;

            confirmacion.classList.remove('d-none');
            confirmacion.focus();
            confirmacion.scrollIntoView({ behavior: 'smooth', block: 'center' });

            formulario.reset();
            btnEnviar.disabled = false;
            spinner.classList.add('d-none');
            textoBtn.textContent = 'Enviar reporte';
        }, 900);
    }
})();
