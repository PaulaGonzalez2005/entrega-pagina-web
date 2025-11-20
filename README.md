# Dimensión Inversa Loca — Retro 90s (HTML/CSS/JS)

Versión estática (sin React) del proyecto "Dimensión Inversa Loca".
Esta página tiene estilo retro (años 90) y **todos los controles hacen lo opuesto** a lo que dicen.

## Archivos
- `index.html` — estructura HTML.
- `style.css` — estilos y animaciones retro.
- `script.js` — lógica: colores psicodélicos, elementos que huyen, controles invertidos, toasts.
- `README.md` — este archivo.


3 Interacciones:
   - `ABRIR Panel` → en realidad **CERRARÁ** el panel.
   - `CERRAR Panel` → en realidad **ABRIRÁ** el panel.
   - `+ Aumentar` → en realidad **resta** 1.
   - `- Disminuir` → en realidad **suma** 1.
   - Slider de volumen → el valor real es **100 - slider.value** (inverso).
   - `Silenciar` → en realidad **sube** el volumen al máximo.
   - `Modo Oscuro` → comportamiento invertido (el botón y el efecto son deliberadamente confusos).
   - Botones `SÍ/NO/HOLA/ADIÓS` → responden al revés.
   - Acerca el cursor a las tarjetas y verás que **huyen**.
   - Presiona `r` para resetear posiciones de huida.


