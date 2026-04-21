/**
 * Sátrapa Café — Gestor automático de stock
 *
 * Se ejecuta en el Google Sheet "Sátrapa DB".
 * Cuando el admin marca un pedido como "confirmado" en la pestaña `pedidos`,
 * este script descuenta el stock correspondiente en la pestaña `productos`
 * y llama al webhook /api/revalidate de Vercel para regenerar el sitio.
 *
 * ───────────────────────────────────────────────────────────────────────
 * INSTALACIÓN (una sola vez, desde el Sheet):
 *   1. Extensiones → Apps Script
 *   2. Pegá este código en Code.gs
 *   3. Project Settings → Script Properties → agregar:
 *        - REVALIDATE_URL  = https://satrapacafe.com/api/revalidate
 *        - REVALIDATE_SECRET = (mismo valor que en Vercel)
 *   4. Guardá y cerrá
 *
 * USO:
 *   En la pestaña `pedidos`, al cambiar la columna "estado" a "confirmado"
 *   el script descuenta el stock automáticamente. El admin no hace más nada.
 *
 * FORMATO ESPERADO DEL CAMPO "items" (columna E):
 *   "sat-001x2, sat-002x1"  →  2 unidades del producto sat-001 y 1 del sat-002
 * ───────────────────────────────────────────────────────────────────────
 */

// ═══════════════════════════════════════════════════════════════════════
// Configuración (ajustar si cambia la estructura del Sheet)
// ═══════════════════════════════════════════════════════════════════════
const CONFIG = {
  SHEET_PRODUCTOS: 'productos',
  SHEET_PEDIDOS: 'pedidos',
  PRODUCTOS_COL_ID: 1,      // columna A
  PRODUCTOS_COL_STOCK: 6,    // columna F
  PEDIDOS_COL_ID_PEDIDO: 1,  // A: id_pedido
  PEDIDOS_COL_ITEMS: 5,      // E: items ("sat-001x2, sat-002x1")
  PEDIDOS_COL_ESTADO: 7,     // G: estado
  PEDIDOS_COL_PROCESADO: 8,  // H: procesado (marca timestamp cuando se descuenta)
  ESTADO_CONFIRMADO: 'confirmado',
};

// ═══════════════════════════════════════════════════════════════════════
// Trigger principal (instalable desde el editor: Triggers → On edit)
// ═══════════════════════════════════════════════════════════════════════
function onEditInstallable(e) {
  if (!e || !e.range) return;
  const sheet = e.range.getSheet();
  if (sheet.getName() !== CONFIG.SHEET_PEDIDOS) return;
  if (e.range.getColumn() !== CONFIG.PEDIDOS_COL_ESTADO) return;

  const nuevoEstado = String(e.value || '').toLowerCase().trim();
  if (nuevoEstado !== CONFIG.ESTADO_CONFIRMADO) return;

  procesarPedido(sheet, e.range.getRow());
}

/**
 * Descuenta el stock de los productos del pedido.
 * Marca la columna "procesado" con un timestamp para evitar doble descuento.
 */
function procesarPedido(sheetPedidos, row) {
  const idPedido = sheetPedidos.getRange(row, CONFIG.PEDIDOS_COL_ID_PEDIDO).getValue();
  const procesado = sheetPedidos.getRange(row, CONFIG.PEDIDOS_COL_PROCESADO).getValue();

  if (procesado) {
    log_(`Pedido ${idPedido} ya fue procesado, se omite.`);
    return;
  }

  const itemsRaw = String(sheetPedidos.getRange(row, CONFIG.PEDIDOS_COL_ITEMS).getValue() || '');
  const items = parseItems(itemsRaw);

  if (items.length === 0) {
    log_(`Pedido ${idPedido}: sin items válidos en "${itemsRaw}"`);
    return;
  }

  const sheetProductos = SpreadsheetApp
    .getActiveSpreadsheet()
    .getSheetByName(CONFIG.SHEET_PRODUCTOS);

  const ajustados = [];

  items.forEach(({ id, cantidad }) => {
    const productoRow = findProductoRow_(sheetProductos, id);
    if (!productoRow) {
      log_(`Pedido ${idPedido}: producto "${id}" no encontrado.`);
      return;
    }
    const stockCell = sheetProductos.getRange(productoRow, CONFIG.PRODUCTOS_COL_STOCK);
    const stockActual = Number(stockCell.getValue()) || 0;
    const nuevoStock = Math.max(0, stockActual - cantidad);
    stockCell.setValue(nuevoStock);
    ajustados.push(`${id}: ${stockActual} → ${nuevoStock}`);
  });

  sheetPedidos.getRange(row, CONFIG.PEDIDOS_COL_PROCESADO).setValue(new Date());
  log_(`Pedido ${idPedido} procesado: ${ajustados.join(', ')}`);

  revalidateVercel();
}

/**
 * "sat-001x2, sat-002x1" → [{id:"sat-001",cantidad:2},{id:"sat-002",cantidad:1}]
 */
function parseItems(raw) {
  if (!raw) return [];
  return raw
    .split(/[,\n]/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk) => {
      const match = chunk.match(/^([A-Za-z0-9_-]+)\s*[xX*×]\s*(\d+)$/);
      if (!match) return null;
      return { id: match[1], cantidad: Number(match[2]) };
    })
    .filter((item) => item && item.cantidad > 0);
}

function findProductoRow_(sheet, id) {
  const values = sheet.getRange(2, CONFIG.PRODUCTOS_COL_ID, sheet.getLastRow() - 1, 1).getValues();
  for (let i = 0; i < values.length; i++) {
    if (String(values[i][0]).trim() === id) return i + 2; // +2 porque empezamos en fila 2 y el índice es 0
  }
  return null;
}

// ═══════════════════════════════════════════════════════════════════════
// Webhook hacia Vercel (revalida el sitio estático)
// ═══════════════════════════════════════════════════════════════════════
function revalidateVercel() {
  const props = PropertiesService.getScriptProperties();
  const url = props.getProperty('REVALIDATE_URL');
  const secret = props.getProperty('REVALIDATE_SECRET');

  if (!url || !secret) {
    log_('REVALIDATE_URL o REVALIDATE_SECRET no configurados en Script Properties.');
    return;
  }

  try {
    const response = UrlFetchApp.fetch(`${url}?secret=${encodeURIComponent(secret)}`, {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ paths: ['/', '/#tienda'] }),
      muteHttpExceptions: true,
    });
    log_(`Revalidación: HTTP ${response.getResponseCode()} ${response.getContentText()}`);
  } catch (err) {
    log_(`Error al revalidar: ${err}`);
  }
}

// ═══════════════════════════════════════════════════════════════════════
// Menú custom en el Sheet para acciones manuales
// ═══════════════════════════════════════════════════════════════════════
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🐾 Sátrapa')
    .addItem('Revalidar sitio ahora', 'revalidateVercel')
    .addItem('Procesar fila actual', 'procesarFilaActual')
    .addToUi();
}

function procesarFilaActual() {
  const sheet = SpreadsheetApp.getActiveSheet();
  if (sheet.getName() !== CONFIG.SHEET_PEDIDOS) {
    SpreadsheetApp.getUi().alert('Parate en una fila de la pestaña "pedidos" antes de usar esta opción.');
    return;
  }
  const row = sheet.getActiveRange().getRow();
  if (row < 2) {
    SpreadsheetApp.getUi().alert('Seleccioná una fila de pedido (no el header).');
    return;
  }
  procesarPedido(sheet, row);
  SpreadsheetApp.getUi().alert('Pedido procesado. Revisá el log en View → Executions.');
}

function log_(msg) {
  console.log(`[satrapa] ${msg}`);
}
