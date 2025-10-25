# 🗺️ UBIQATE

**Versión:** 0.2  
**Autor:** [@Gonzalo-CR](https://github.com/Gonzalo-CR)  
**Licencia:** MIT  
**Estado:** Funcional (prototipo)

---

## 📌 ¿Qué es UBIQATE?

UBIQATE es una herramienta web simple y funcional para convertir coordenadas geográficas entre distintos formatos (DD, DMS, UTM, dirección) y visualizarlas en un mapa interactivo. Ideal para tareas de georreferenciación rápida, validación de ubicaciones y exploración de puntos en el mapa.

---

## 🎯 Funcionalidades

- Conversión entre:
  - 📍 Grados Decimales (DD)
  - 🧭 Grados, Minutos y Segundos (DMS)
  - 🗺️ Coordenadas UTM
  - 🏠 Direcciones físicas
- Visualización en mapa con [Leaflet.js](https://leafletjs.com/)
- Búsqueda de dirección inicial
- Clic en el mapa para obtener coordenadas y dirección
- Soporte para múltiples hemisferios y zonas UTM

---

## 🧩 Tecnologías utilizadas

- HTML5 + CSS3
- JavaScript (vanilla)
- [Leaflet.js](https://leafletjs.com/) para mapas
- [Proj4js](https://proj4js.org/) para conversión de coordenadas

---

## 🖥️ Cómo usar

1. Cloná o descargá este repositorio.
2. Abrí `index.html` en tu navegador.
3. Ingresá una dirección o coordenadas en el formato deseado.
4. Hacé clic en **"Convertir y Mostrar"**.
5. Explorá el resultado en el mapa interactivo.

---

## 📂 Estructura del proyecto
- `index.html`: Interfaz principal con campos de entrada, botones y mapa.
- `styles.css`: Estilos visuales para la estructura y responsividad.
- `script.js`: Lógica de conversión entre formatos, interacción con Leaflet y eventos del usuario.


---

## 🧪 Estado actual

- [x] Conversión básica entre formatos
- [x] Visualización en mapa
- [x] Clic en mapa para obtener coordenadas
- [ ] Validación de entradas
- [ ] Soporte para múltiples idiomas
- [ ] Exportación de resultados

> El código no realiza validación de entradas aún. Se recomienda ingresar coordenadas válidas para evitar errores.


---

## 🤝 Contribuciones

¡Se aceptan mejoras! Ideas posibles:

- Validación de datos de entrada
- Exportar resultados a CSV o GeoJSON
- Agregar historial de conversiones
- Mejorar diseño responsivo

---

## 🌐 Servicios externos utilizados

UBIQATE utiliza los siguientes servicios y librerías externas:

- [OpenStreetMap](https://www.openstreetmap.org/): mapa base y datos geográficos.
- [Leaflet.js](https://leafletjs.com/): visualización interactiva de mapas.
- [Proj4js](https://proj4js.org/): conversión entre sistemas de coordenadas.
- [Nominatim](https://nominatim.org/): geocodificación directa e inversa.
- [OSRM](http://project-osrm.org/): cálculo de rutas entre puntos.

> Este proyecto respeta las condiciones de uso y atribución de cada servicio. Los mapas incluyen créditos visibles según lo requerido por OpenStreetMap.

---

## 🇦🇷 Nota

Desarrollado con orgullo desde Argentina 🇦🇷 por GonzaloCR, con foco en utilidad práctica, trazabilidad y simplicidad.

---

## 📎 Licencia

Este proyecto está bajo la licencia MIT. Ver `LICENSE` para más detalles.