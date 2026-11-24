/* ===========================================================
   Banco de palabras del ahorcado (temática: informática y ciberseguridad)
   Cada nivel tiene su lista; "pista" es la ayuda que se muestra.
   Las palabras pueden llevar tildes y Ñ: el juego las compara sin tildes.
   =========================================================== */
const NIVELES = {
    facil: {
        nombre: 'Fácil',
        errores: 8,              // intentos permitidos
        mostrarPista: true,      // muestra una pista escrita
        palabras: [
            { palabra: 'REDES',   pista: 'Equipos conectados entre sí para compartir datos.' },
            { palabra: 'LINUX',   pista: 'Sistema operativo libre cuyo símbolo es un pingüino.' },
            { palabra: 'VIRUS',   pista: 'Programa dañino que se copia de equipo en equipo.' },
            { palabra: 'CLAVE',   pista: 'Secreto que usás para entrar a una cuenta.' },
            { palabra: 'CORREO',  pista: 'Servicio para enviar mensajes electrónicos.' },
            { palabra: 'ARCHIVO', pista: 'Documento o dato guardado en una computadora.' },
            { palabra: 'PYTHON',  pista: 'Lenguaje de programación con nombre de serpiente.' },
            { palabra: 'NUBE',    pista: 'Lugar de internet donde se guardan archivos.' },
            { palabra: 'TECLADO', pista: 'Periférico con letras que usás para escribir.' }
        ]
    },
    normal: {
        nombre: 'Normal',
        errores: 6,
        mostrarPista: true,      // solo muestra la categoría general
        palabras: [
            { palabra: 'FIREWALL',  pista: 'Seguridad: filtra el tráfico entre redes.' },
            { palabra: 'PHISHING',  pista: 'Seguridad: engaño para robar datos, casi siempre por correo.' },
            { palabra: 'SERVIDOR',  pista: 'Redes: equipo que responde pedidos de otros.' },
            { palabra: 'NAVEGADOR', pista: 'Programa para ver páginas web.' },
            { palabra: 'PROTOCOLO', pista: 'Redes: reglas para que dos equipos se entiendan.' },
            { palabra: 'CIFRADO',   pista: 'Seguridad: transformar un mensaje para que no se lea.' },
            { palabra: 'ALGORITMO', pista: 'Programación: pasos ordenados para resolver un problema.' },
            { palabra: 'ROUTER',    pista: 'Redes: dispositivo que reparte la conexión a internet.' },
            { palabra: 'VARIABLE',  pista: 'Programación: espacio con nombre que guarda un valor.' }
        ]
    },
    dificil: {
        nombre: 'Difícil',
        errores: 4,
        mostrarPista: false,     // sin pista: solo se sabe la cantidad de letras
        palabras: [
            { palabra: 'CONTRASEÑA',     pista: '' },
            { palabra: 'CIBERSEGURIDAD', pista: '' },
            { palabra: 'AUTENTICACIÓN',  pista: '' },
            { palabra: 'VULNERABILIDAD', pista: '' },
            { palabra: 'ENCRIPTACIÓN',   pista: '' },
            { palabra: 'JAVASCRIPT',     pista: '' },
            { palabra: 'REPOSITORIO',    pista: '' },
            { palabra: 'RANSOMWARE',     pista: '' },
            { palabra: 'ADMINISTRACIÓN', pista: '' }
        ]
    }
};

// Letras del teclado en pantalla (alfabeto español, con Ñ)
const ALFABETO = 'ABCDEFGHIJKLMNÑOPQRSTUVWXYZ'.split('');
