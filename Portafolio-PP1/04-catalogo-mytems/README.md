# Catálogo MyTems con buscador y carrito (TP3)

Tienda online de ítems para videojuegos: continuación del proyecto MyTems del parcial 1.

## Cómo abrirlo
Los productos se leen de `data/productos.json` con `fetch`, y el navegador **bloquea esa lectura si abrís `index.html` con doble clic**. Usá alguna de estas opciones:
- **Live Server** (extensión de VS Code): clic derecho sobre `index.html` > *Open with Live Server*.
- **Terminal** dentro de esta carpeta: `python -m http.server 8000` y abrir `http://localhost:8000`.
- **GitHub Pages**, si el repositorio lo tiene activado.

## Qué incluye
| Requisito | Dónde / cómo |
|---|---|
| Cuadrícula con imagen, nombre y precio | `js/app.js`, función `dibujarCatalogo()` |
| Detalle en cuadro modal | Botón *Detalles* (modal de Bootstrap) |
| Productos desde JSON | `data/productos.json` (9 productos, con categoría, tipo, stock) |
| Buscador por nombre | Insensible a mayúsculas y acentos; encuentra el texto al comienzo, medio o final |
| Filtro avanzado | Videojuego (categoría), tipo de ítem (atributo) y rango de precios; además, orden por precio o nombre |
| Carrito | Un renglón por producto con cantidad (+ / −), subtotal y total |
| Tope de stock | No se puede agregar más unidades que el stock (botones deshabilitados y aviso) |
| Extra | El carrito se conserva al recargar (localStorage) |

## Tecnologías
HTML5, CSS3, JavaScript sin librerías y Bootstrap 5 (grilla, modal, panel lateral y avisos).

## Historia de usuario
**Como** gamer que busca ítems para sus juegos, **quiero** buscar y filtrar el catálogo y armar un carrito con las cantidades que necesito, **para** comprar rápido sin pasarme del stock disponible.

## Roles
Facundo Saenz: analista, documentador, diseñador y programador (trabajo individual).
Los datos de stock y precios son de ejemplo.
