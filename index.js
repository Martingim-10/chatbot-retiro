const express = require('express');
const bodyParser = require('body-parser');

// Creamos la app de Express
const app = express();
app.use(bodyParser.json());

// Tu lógica de webhook
app.post('/', (req, res) => {
  const tag = req.body.fulfillmentInfo?.tag;
  let respuesta = 'Hola desde el webhook!';
  if (tag === 'cotizador') {
    respuesta = 'Estoy calculando tu retiro...';
  }
  res.json({ fulfillmentText: respuesta });
});

// Exportamos la app como la función Cloud Function
exports.chatbotWebhook = app;
