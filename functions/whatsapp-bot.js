const twilio = require("twilio");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  // Verifique se event.queryStringParameters e event.queryStringParameters.Body existem
  const message =
    event.queryStringParameters && event.queryStringParameters.Body
      ? event.queryStringParameters.Body.toLowerCase()
      : "";

  if (message.includes("oi")) {
    twiml.message("Olá! Como posso ajudar você hoje?");
  } else if (message.includes("ajuda")) {
    twiml.message("Claro! Aqui está como posso ajudar...");
  } else {
    twiml.message("Desculpe, não entendi sua mensagem.");
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/xml" },
    body: twiml.toString(),
  };
};
