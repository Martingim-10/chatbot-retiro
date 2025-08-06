// index.js
import functions from "@google-cloud/functions-framework";
import { GoogleSpreadsheet } from "google-spreadsheet";

// Registra el endpoint HTTP llamado "chatbotWebhook"
functions.http("chatbotWebhook", async (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  let respuesta = "Hola desde el webhook!";

  if (tag === "cotizador") {
    respuesta = "Estoy calculando tu retiro...";
  } else if (tag === "asesorhumano") {
    const params = req.body.sessionInfo?.parameters || {};
    const email    = params.email_usuario   || "";
    const telefono = params.telefono_usuario|| "";

    // Conecta a Google Sheets y agrega la fila
    const doc = new GoogleSpreadsheet(process.env.SHEET_ID);
    await doc.useServiceAccountAuth(JSON.parse(process.env.GOOGLE_CREDENTIALS));
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    await sheet.addRow({
      email_usuario:   email,
      telefono_usuario:telefono,
      timestamp:       new Date().toISOString(),
    });

    respuesta =
      "¡Gracias! Ya tengo tus datos. En breve un asesor se pondrá en contacto contigo.";
  }

  res.json({ fulfillmentText: respuesta });
});
