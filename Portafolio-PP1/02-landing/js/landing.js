/* ===========================================================
   TP2 - Ejercicio 2: lógica del formulario dentro del modal
   El modal, el carrusel y el menú hamburguesa los maneja
   Bootstrap mediante atributos data-bs-*; este script solo
   valida la reserva y muestra la confirmación.
   =========================================================== */

(function () {
    'use strict';

    const formulario = document.getElementById('formReserva');
    const mensaje    = document.getElementById('mensajeReserva');
    const modalEl    = document.getElementById('modalReserva');

    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.classList.add('was-validated');
            return;
        }

        const nombre = document.getElementById('rNombre').value.trim();
        const tour   = document.getElementById('rTour').value;
        const gente  = document.getElementById('rPersonas').value;

        mensaje.textContent = `¡Gracias, ${nombre}! Anotamos ${gente} lugar(es) para "${tour}". Te escribimos para confirmar.`;
        mensaje.classList.remove('d-none');
    });

    // Cada vez que el modal se cierra, el formulario vuelve a su estado inicial
    modalEl.addEventListener('hidden.bs.modal', function () {
        formulario.reset();
        formulario.classList.remove('was-validated');
        mensaje.classList.add('d-none');
    });
})();
