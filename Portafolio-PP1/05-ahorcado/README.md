# Ahorcado (TP3 - minijuego web)

Se abre con doble clic sobre `index.html` (no necesita servidor).

## Cómo se juega
Elegí una dificultad y adiviná la palabra de informática probando letras con el teclado en pantalla o con el teclado físico. Cada error dibuja una parte del muñeco; si se completa, perdés.

| Dificultad | Intentos permitidos | Ayuda |
|---|---|---|
| Fácil | 8 | Pista escrita y palabras cortas |
| Normal | 6 | Pista sobre el tema de la palabra |
| Difícil | 4 | Sin pista, palabras largas |

## Detalles
- Las palabras pueden tener tilde o Ñ: se prueban escribiendo la letra sin tilde (la Ñ con `ñ`).
- No repite palabras hasta agotar la lista del nivel.
- Marcador de ganadas, perdidas y racha (se guarda en el navegador).
- **CSS en archivo aparte:** `css/estilos.css`, que importa `css/variables.css` con `@import`.

## Archivos
`index.html` · `css/estilos.css` · `css/variables.css` · `js/palabras.js` (banco de palabras y niveles) · `js/ahorcado.js` (lógica)

## Historia de usuario
**Como** estudiante de informática, **quiero** un ahorcado con distintos niveles, **para** repasar vocabulario del área mientras juego.

## Roles
Facundo Saenz: analista, documentador, diseñador y programador (trabajo individual).
