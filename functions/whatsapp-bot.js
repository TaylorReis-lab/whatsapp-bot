const twilio = require("twilio");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  const message = event.queryStringParameters.Body.toLowerCase();

  if (message.includes("Olá")) {
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
