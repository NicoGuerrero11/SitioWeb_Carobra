# 📸 Cómo Agregar Álbumes a la Galería

## Proceso súper simple (5 minutos por álbum)

### Paso 1: Ve a tu álbum en Flickr
Ejemplo: https://www.flickr.com/photos/carobra/albums/72177720328292093

### Paso 2: Obtén la información del álbum

De la página del álbum, obtén:

1. **ID del álbum**: El número largo en la URL
   - Ejemplo: `72177720328292093`

2. **Título**: El nombre del álbum
   - Aparece en la parte superior

3. **Número de fotos**: Dice "X photos"
   - Ejemplo: "101 photos" → 101

4. **Vistas**: Dice "X views"  
   - Ejemplo: "156 views" → 156

5. **URL de la imagen de portada**:
   - Abre la primera foto del álbum
   - Click derecho → "Copiar dirección de imagen"
   - La URL debe terminar en `_w.jpg` para tamaño mediano

### Paso 3: Edita el archivo JSON

Abre: `src/data/flickr-albums.json`

Agrega tu álbum al array. Formato:

```json
{
  "id": "72177720328292093",
  "title": "CONVENCIÓN TDC RIVIERA NAYARIT 2025 NOCHE DE ESTRELLAS",
  "photos": 101,
  "views": 156,
  "coverImage": "https://live.staticflickr.com/65535/54711375952_3e8a045bc2_w.jpg",
  "url": "https://www.flickr.com/photos/carobra/albums/72177720328292093"
}
```

## Ejemplo completo con múltiples álbumes:

```json
[
  {
    "id": "72177720328292093",
    "title": "CONVENCIÓN TDC RIVIERA NAYARIT 2025 NOCHE DE ESTRELLAS",
    "photos": 101,
    "views": 156,
    "coverImage": "https://live.staticflickr.com/65535/54711375952_3e8a045bc2_w.jpg",
    "url": "https://www.flickr.com/photos/carobra/albums/72177720328292093"
  },
  {
    "id": "OTRO_ID",
    "title": "OTRO ÁLBUM",
    "photos": 479,
    "views": 253,
    "coverImage": "https://live.staticflickr.com/65535/OTRA_IMAGEN_w.jpg",
    "url": "https://www.flickr.com/photos/carobra/albums/OTRO_ID"
  }
]
```

⚠️ **IMPORTANTE**: 
- Separa cada álbum con una coma
- El último álbum NO lleva coma al final
- Respeta las comillas dobles `"`
- No olvides cerrar los corchetes `]`

## Tips para obtener la URL de la imagen correcta

### Método rápido:
1. Ve al álbum
2. Click en la primera foto
3. Click derecho en la imagen → "Copiar dirección de imagen"
4. Pega la URL en el JSON

### Si la URL es muy larga:
Asegúrate de que termine en `_w.jpg` (tamaño medium) o `_z.jpg` (tamaño large).

Si termina en `_b.jpg` o `_h.jpg`, cámbialo a `_w.jpg` para optimizar el tamaño.

## Después de agregar álbumes

1. Guarda el archivo `flickr-albums.json`
2. Reinicia el servidor: `npm run dev`
3. Refresca el navegador
4. ¡Listo! Deberías ver el nuevo álbum

## Orden de los álbumes

Los álbumes aparecen en el mismo orden que están en el JSON.

Para cambiar el orden, simplemente mueve los bloques dentro del array.

## Eliminar un álbum

Borra todo el bloque del álbum (desde `{` hasta `}`), incluyendo la coma si no es el último.

---

## ¿Necesitas ayuda?

Si tienes problemas:
1. Verifica que el JSON sea válido (puedes usar https://jsonlint.com/)
2. Revisa la consola del navegador (F12) para ver errores
3. Asegúrate de que las URLs de las imágenes funcionen

**¡Eso es todo!** Súper simple. 🎉
