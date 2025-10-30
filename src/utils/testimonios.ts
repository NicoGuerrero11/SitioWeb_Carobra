interface Testimonio {
  nombre: string;
  cargo: string;
  testimonio: string;
  fecha: string;
}

interface TestimoniosPorTipo {
  asesores: Testimonio[];
  trabajadores: Testimonio[];
}

const CSV_URL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQL0gyxzcqveMX3Vo1j0P1ja0LaQ0sucMl1I2s5SdbJxQyxEecPzDLsm6IBwc9fDrcDuY7SccpICVZ8/pub?output=csv';

/**
 * Normaliza el formato del texto de testimonios
 * - Convierte todo a minúsculas excepto la primera letra de cada oración
 * - Respeta siglas y nombres propios comunes
 */
function normalizarTexto(texto: string): string {
  if (!texto) return '';
  
  // Limpiar espacios extra
  texto = texto.trim().replace(/\s+/g, ' ');
  
  // Convertir todo a minúsculas primero
  let textoNormalizado = texto.toLowerCase();
  
  // Capitalizar primera letra del texto
  textoNormalizado = textoNormalizado.charAt(0).toUpperCase() + textoNormalizado.slice(1);
  
  // Capitalizar después de puntos, signos de exclamación e interrogación
  textoNormalizado = textoNormalizado.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  // Capitalizar después de saltos de línea
  textoNormalizado = textoNormalizado.replace(/(\n)([a-z])/g, (match, p1, p2) => {
    return p1 + p2.toUpperCase();
  });
  
  // Preservar siglas y nombres comunes en mayúsculas
  const palabrasMayusculas = [
    'AFORE', 'CONSAR', 'IMSS', 'ISSSTE', 'SAR', 'INFONAVIT',
    'Carobra', 'SISCA', 'México', 'Aguascalientes', 'Guadalajara',
    'CDMX', 'Cancún', 'COVID', 'MBA', 'CEO', 'CFO'
  ];
  
  palabrasMayusculas.forEach(palabra => {
    const regex = new RegExp(`\\b${palabra}\\b`, 'gi');
    textoNormalizado = textoNormalizado.replace(regex, palabra);
  });
  
  return textoNormalizado;
}

/**
 * Normaliza el formato de nombres propios
 * - Primera letra de cada palabra en mayúscula
 * - Resto en minúsculas
 */
function normalizarNombre(nombre: string): string {
  if (!nombre) return '';
  
  return nombre
    .toLowerCase()
    .split(' ')
    .map(palabra => {
      // Preservar conectores comunes en minúsculas
      if (['de', 'del', 'la', 'los', 'las', 'y', 'e'].includes(palabra)) {
        return palabra;
      }
      return palabra.charAt(0).toUpperCase() + palabra.slice(1);
    })
    .join(' ');
}

/**
 * Parsea el CSV completo manejando campos con comillas que contienen comas y saltos de línea
 */
function parseCSV(csvText: string): string[][] {
  const rows: string[][] = [];
  const chars = csvText.split('');
  let currentField = '';
  let currentRow: string[] = [];
  let inQuotes = false;
  
  for (let i = 0; i < chars.length; i++) {
    const char = chars[i];
    const nextChar = chars[i + 1];
    
    if (char === '"') {
      // Manejar comillas dobles escapadas
      if (inQuotes && nextChar === '"') {
        currentField += '"';
        i++; // Saltar la siguiente comilla
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // Fin de campo
      currentRow.push(currentField.trim());
      currentField = '';
    } else if (char === '\n' && !inQuotes) {
      // Fin de fila
      currentRow.push(currentField.trim());
      if (currentRow.some(field => field.length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentField = '';
    } else {
      // Agregar carácter al campo actual
      currentField += char;
    }
  }
  
  // Agregar último campo y fila si existen
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(field => field.length > 0)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * Calcula el índice de inicio para la rotación de testimonios
 * Cambia cada 15 días basándose en una fecha de referencia
 */
function calcularIndiceRotacion(totalTestimonios: number, maxTestimonios: number = 6): number {
  if (totalTestimonios <= maxTestimonios) return 0;
  
  // Fecha de referencia: 1 de enero de 2025
  const fechaReferencia = new Date('2025-01-01').getTime();
  const ahora = new Date().getTime();
  
  // Calcular cuántos períodos de 15 días han pasado
  const milisegundosPorDia = 1000 * 60 * 60 * 24;
  const diasTranscurridos = Math.floor((ahora - fechaReferencia) / milisegundosPorDia);
  const periodoActual = Math.floor(diasTranscurridos / 15);
  
  // Calcular cuántos grupos de testimonios tenemos
  const totalGrupos = Math.ceil(totalTestimonios / maxTestimonios);
  
  // Determinar qué grupo mostrar (rotando circularmente)
  const grupoActual = periodoActual % totalGrupos;
  
  return grupoActual * maxTestimonios;
}

/**
 * Selecciona testimonios con rotación automática cada 15 días
 */
function seleccionarTestimoniosRotativos(testimonios: Testimonio[], maxTestimonios: number = 6): Testimonio[] {
  if (testimonios.length === 0) return [];
  if (testimonios.length <= maxTestimonios) return testimonios;
  
  const indiceInicio = calcularIndiceRotacion(testimonios.length, maxTestimonios);
  const testimoniosSeleccionados: Testimonio[] = [];
  
  // Seleccionar testimonios desde el índice calculado
  for (let i = 0; i < maxTestimonios; i++) {
    const indice = (indiceInicio + i) % testimonios.length;
    testimoniosSeleccionados.push(testimonios[indice]);
  }
  
  return testimoniosSeleccionados;
}

/**
 * Obtiene los testimonios desde el CSV de Google Sheets
 */
export async function fetchTestimonios(): Promise<TestimoniosPorTipo> {
  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    // Parsear CSV correctamente manejando saltos de línea dentro de campos
    const rows = parseCSV(csvText);
    
    // Saltar la primera fila (headers)
    const dataRows = rows.slice(1);
    
    const asesores: Testimonio[] = [];
    const trabajadores: Testimonio[] = [];
    
    for (const columns of dataRows) {
      
      // Estructura: Marca temporal, Nombre y Apellido, Cargo, Testimonio, Autorizo
      if (columns.length >= 5 && columns[4].toLowerCase() === 'sí') {
        const fecha = columns[0] || '';
        const nombre = columns[1] || '';
        const cargo = columns[2] || '';
        const testimonio = columns[3] || '';
        
        // Validar que tengamos los datos necesarios
        if (nombre && cargo && testimonio) {
          const testimonioObj: Testimonio = {
            nombre: normalizarNombre(nombre),
            cargo: cargo.trim(),
            testimonio: normalizarTexto(testimonio),
            fecha: fecha.trim()
          };
          
          // Clasificar según el cargo
          const cargoLower = cargo.toLowerCase().trim();
          
          if (cargoLower.includes('asesor')) {
            asesores.push(testimonioObj);
          } else if (cargoLower.includes('trabajador')) {
            trabajadores.push(testimonioObj);
          }
        }
      }
    }
    
    // Aplicar rotación automática: máximo 6 testimonios, cambian cada 15 días
    return {
      asesores: seleccionarTestimoniosRotativos(asesores, 6),
      trabajadores: seleccionarTestimoniosRotativos(trabajadores, 6)
    };
  } catch (error) {
    console.error('Error al obtener testimonios:', error);
    
    // Retornar testimonios por defecto en caso de error
    return {
      asesores: [
        {
          nombre: 'María López',
          cargo: 'Asesor/a',
          testimonio: 'Trabajar en Carobra ha transformado mi carrera. El sistema de comisiones es justo y los pagos son puntuales. Además, la capacitación constante me ha permitido crecer profesionalmente.',
          fecha: ''
        }
      ],
      trabajadores: [
        {
          nombre: 'María González',
          cargo: 'Trabajador/a Carobra',
          testimonio: 'Trabajar aquí es formar parte de una familia que valora el crecimiento y la creatividad.',
          fecha: ''
        }
      ]
    };
  }
}
