/* ===========================================================
   TP3 - Ahorcado: lógica del juego
   Depende de js/palabras.js (NIVELES y ALFABETO).
   Secciones: 1. Estado  2. Utilidades  3. Dibujo  4. Jugar  5. Fin de partida  6. Eventos
   =========================================================== */

(function () {
    'use strict';

    /* ---------- 1. ESTADO ---------- */
    const TOTAL_PARTES = 8;           // base, poste, viga, soga, cabeza, cuerpo, brazos, piernas
    const CLAVE_MARCADOR = 'ahorcado_marcador_v1';

    let nivel = 'normal';
    let palabra = '';                 // palabra actual (con tildes, para mostrarla)
    let pista = '';
    let adivinadas = new Set();       // letras ya probadas (sin tildes)
    let errores = 0;
    let maxErrores = 6;
    let terminada = false;
    let usadas = { facil: [], normal: [], dificil: [] };   // para no repetir palabras seguidas
    let marcador = { ganadas: 0, perdidas: 0, racha: 0 };

    const $ = (selector) => document.querySelector(selector);

    /* ---------- 2. UTILIDADES ---------- */

    // Pasa una letra a su forma base: "Á" -> "A". La Ñ se conserva porque es otra letra del alfabeto.
    function base(letra) {
        if (letra === 'Ñ' || letra === 'ñ') { return 'Ñ'; }
        return letra.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase();
    }

    // Elige una palabra al azar sin repetir hasta agotar la lista del nivel
    function elegirPalabra() {
        const lista = NIVELES[nivel].palabras;
        if (usadas[nivel].length >= lista.length) { usadas[nivel] = []; }
        let indice;
        do { indice = Math.floor(Math.random() * lista.length); } while (usadas[nivel].includes(indice));
        usadas[nivel].push(indice);
        return lista[indice];
    }

    function cargarMarcador() {
        try { Object.assign(marcador, JSON.parse(localStorage.getItem(CLAVE_MARCADOR) || '{}')); } catch (e) { /* se ignora */ }
    }
    function guardarMarcador() {
        try { localStorage.setItem(CLAVE_MARCADOR, JSON.stringify(marcador)); } catch (e) { /* se ignora */ }
    }

    /* ---------- 3. DIBUJO ---------- */
    function dibujarPalabra(revelarTodo = false) {
        $('#palabra').innerHTML = [...palabra].map((letra) => {
            const acertada = adivinadas.has(base(letra));
            const mostrar = acertada || revelarTodo;
            const clase = 'letra' + (!acertada && revelarTodo ? ' revelada-final' : '');
            return `<span class="${clase}" aria-hidden="true">${mostrar ? letra : ''}</span>`;
        }).join('');
        // Texto accesible para lectores de pantalla
        $('#palabra').setAttribute('aria-label',
            'Palabra de ' + palabra.length + ' letras: ' +
            [...palabra].map((l) => (adivinadas.has(base(l)) ? l : 'vacía')).join(', '));
    }

    function dibujarMuñeco() {
        // Se reparte el total de partes según los errores permitidos del nivel
        const visibles = Math.round((errores * TOTAL_PARTES) / maxErrores);
        document.querySelectorAll('.parte').forEach((el, i) => el.classList.toggle('visible', i < visibles));
    }

    function dibujarTeclado() {
        $('#teclado').innerHTML = ALFABETO.map((l) =>
            `<button type="button" class="tecla" data-letra="${l}" aria-label="Letra ${l}">${l}</button>`).join('');
    }

    function dibujarEstado() {
        $('#vidas').innerHTML = `Intentos restantes: <strong>${maxErrores - errores}</strong> de ${maxErrores}`;
        $('#marcadorGanadas').textContent = marcador.ganadas;
        $('#marcadorPerdidas').textContent = marcador.perdidas;
        $('#marcadorRacha').textContent = marcador.racha;
    }

    /* ---------- 4. JUGAR ---------- */
    function nuevaPartida() {
        nivel = document.querySelector('input[name="nivel"]:checked').value;
        const config = NIVELES[nivel];
        const elegida = elegirPalabra();

        palabra = elegida.palabra;
        pista = elegida.pista;
        maxErrores = config.errores;
        adivinadas = new Set();
        errores = 0;
        terminada = false;

        document.body.classList.remove('perdio');
        $('#resultado').hidden = true;
        $('#pista').textContent = config.mostrarPista
            ? 'Pista: ' + pista
            : 'Sin pistas en este nivel. Palabra de ' + palabra.length + ' letras.';
        $('#estado').textContent = 'Elegí una letra.';

        dibujarTeclado();
        dibujarPalabra();
        dibujarMuñeco();
        dibujarEstado();
    }

    function probarLetra(letra) {
        letra = base(letra);
        if (terminada || adivinadas.has(letra) || !ALFABETO.includes(letra)) { return; }

        adivinadas.add(letra);
        const boton = document.querySelector(`.tecla[data-letra="${letra}"]`);
        const acierto = [...palabra].some((l) => base(l) === letra);

        if (boton) {
            boton.disabled = true;
            boton.classList.add(acierto ? 'acierto' : 'error');
        }

        if (acierto) {
            $('#estado').textContent = `¡Bien! La ${letra} está en la palabra.`;
        } else {
            errores++;
            $('#estado').textContent = `La ${letra} no está. Te quedan ${maxErrores - errores} intento(s).`;
        }

        dibujarPalabra();
        dibujarMuñeco();
        dibujarEstado();

        // ¿Ganó? Todas las letras de la palabra ya están adivinadas
        if ([...palabra].every((l) => adivinadas.has(base(l)))) { terminar(true); }
        else if (errores >= maxErrores) { terminar(false); }
    }

    /* ---------- 5. FIN DE PARTIDA ---------- */
    function terminar(gano) {
        terminada = true;
        document.querySelectorAll('.tecla').forEach((t) => { t.disabled = true; });

        if (gano) { marcador.ganadas++; marcador.racha++; }
        else      { marcador.perdidas++; marcador.racha = 0; document.body.classList.add('perdio'); dibujarPalabra(true); }
        guardarMarcador();
        dibujarEstado();

        const caja = $('#resultado');
        caja.classList.toggle('derrota', !gano);
        $('#resultadoTitulo').textContent = gano ? '¡Ganaste!' : 'Perdiste';
        $('#resultadoTexto').textContent = gano
            ? `Adivinaste "${palabra}" con ${errores} error(es).`
            : `La palabra era "${palabra}".`;
        caja.hidden = false;
        $('#btnOtra').focus();
        $('#estado').textContent = gano ? 'Partida ganada.' : 'Partida perdida.';
    }

    /* ---------- 6. EVENTOS ---------- */
    function conectarEventos() {
        // Teclado en pantalla (delegación de eventos)
        $('#teclado').addEventListener('click', (e) => {
            const boton = e.target.closest('.tecla');
            if (boton) { probarLetra(boton.dataset.letra); }
        });

        // Teclado físico
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey || e.altKey) { return; }
            if (e.key.length === 1 && /[a-zñáéíóúü]/i.test(e.key)) { probarLetra(e.key); }
        });

        $('#btnNueva').addEventListener('click', nuevaPartida);
        $('#btnOtra').addEventListener('click', nuevaPartida);
        document.querySelectorAll('input[name="nivel"]').forEach((r) => r.addEventListener('change', nuevaPartida));
    }

    cargarMarcador();
    conectarEventos();
    nuevaPartida();

    // Se expone solo para las pruebas automáticas (no afecta al juego)
    window.__ahorcado = { palabraActual: () => palabra, errores: () => errores };
})();
