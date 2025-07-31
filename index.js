const functions = require('@google-cloud/functions-framework');
const { google } = require('googleapis');

// Función para guardar un lead en Google Sheets
async function saveLead(lead) {
  const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GCP_CREDENTIALS),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const sheets = google.sheets({ version: 'v4', auth });
  await sheets.spreadsheets.values.append({
    spreadsheetId: process.env.SHEET_ID,
    range: 'Leads!A:D',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        lead.nombre  || '',
        lead.email   || '',
        lead.telefono|| '',
        new Date().toLocaleString()
      ]]
    },
  });
}

functions.http('webhook', async (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  const params = req.body.sessionInfo?.parameters || {};

  // Prepara el objeto lead
  const lead = {
    nombre:    params.nombre    || '—',
    email:     params.email     || '',
    telefono:  params.telefono  || '',
  };

  // Guarda el lead en Sheets
  await saveLead(lead);

  // Responde según tag
  let respuesta = 'Hola desde el webhook!';
  if (tag === 'cotizador') {
    respuesta = 'Estoy calculando tu retiro...';
  } else if (tag === 'DejarEmail' || tag === 'DejarTelefono') {
    respuesta = '¡Gracias! Ya guardé tus datos y te contactaremos pronto.';
  }

  res.json({ fulfillmentText: respuesta });
});

