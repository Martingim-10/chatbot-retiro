/**
 * Un HTTP Cloud Function que responde a Dialogflow CX.
 */
exports.webhook = (req, res) => {
  // tag que viene de fulfillmentInfo.tag
  const tag = req.body.fulfillmentInfo?.tag;

  let respuesta = 'Hola desde el webhook!';
  if (tag === 'cotizador') {
    respuesta = 'Estoy calculando tu retiro...';
  }

  // devuelve el JSON que espera Dialogflow CX
  res.json({ fulfillmentText: respuesta });
};
