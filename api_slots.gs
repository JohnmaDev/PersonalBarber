// ============================================================
// Google Apps Script - API pública de disponibilidad BarbelCol
// ACTUALIZADO con soporte CORS correcto
//
// Después de pegar este código:
//   1. Guarda (Ctrl+S)
//   2. Implementar → Gestionar implementaciones → Editar → Nueva versión → Implementar
//      (¡Importante! Debe crease una NUEVA VERSIÓN, no solo guardar)
// ============================================================

const SHEET_ID = '1VpwjbqtM-4vpCozVTBKLorB2wTJVjq0A_jvWZJTbh9s';
const SHEET_NAME = 'Hoja 1'; // Cambia si tu hoja se llama "Sheet1"

// --- Columnas esperadas en el Sheet (orden) ---
// A: fecha  | B: hora | C: nombre | D: servicio | E: telefono | F: direccion | G: estado

function doGet(e) {
  const props = PropertiesService.getScriptProperties();
  const secret = (props.getProperty('ADMIN_PIN') || '').trim();
  
  // Intento exhaustivo de capturar el PIN
  let pin = '';
  if (e) {
    if (e.parameter) pin = e.parameter.auth || e.parameter.token || e.parameter.p || '';
    if (!pin && e.parameters) {
      const p = e.parameters.auth || e.parameters.token || e.parameters.p;
      if (p && p.length > 0) pin = p[0];
    }
  }
  pin = pin.trim();

  const isCheck = e && e.parameter && (e.parameter.view === 'public');

  if (!isCheck && pin !== secret) {
    return responderJSON({ ok: false, error: 'No autorizado' });
  }
  
  const data = obtenerReservas();
  
  if (isCheck && data.ok) {
    data.reservas = data.reservas.map(r => ({ fecha: r.fecha, hora: r.hora }));
  }

  return responderJSON(data);
}

// Necesario para que el navegador pueda hacer el preflight CORS
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT);
}

function obtenerReservas() {
  try {
    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    if (!sheet) {
      return { ok: false, error: 'Hoja "' + SHEET_NAME + '" no encontrada. Revisa SHEET_NAME.' };
    }

    const data = sheet.getDataRange().getValues();
    const reservas = [];

    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      if (!row[0]) continue; // Fila vacía, la saltamos

      const estado = String(row[6] || 'pendiente').toLowerCase().trim();
      if (estado === 'cancelada') continue;

      // Convertir fecha usando el método nativo de Apps Script
      let fecha = row[0];
      try {
        fecha = Utilities.formatDate(new Date(fecha), Session.getScriptTimeZone(), 'yyyy-MM-dd');
      } catch(ex) {
        fecha = String(row[0]).trim();
      }

      reservas.push({
        fecha:    fecha,
        hora:     String(row[1] || '').trim(),
        nombre:   String(row[2] || '').trim(),
        servicio: String(row[3] || '').trim(),
        telefono: String(row[4] || '').trim(),
        direccion:String(row[5] || '').trim(),
        estado:   estado
      });
    }

    return { ok: true, total: reservas.length, reservas };

  } catch (e) {
    return { ok: false, error: e.message };
  }
}

function responderJSON(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
