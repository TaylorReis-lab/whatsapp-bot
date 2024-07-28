const twilio = require("twilio");
const bodyParser = require("body-parser");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  // Parse o corpo da requisição
  const parsedBody = event.body ? JSON.parse(event.body) : {};

  // Verifique se parsedBody.Body existe
  const message = parsedBody.Body ? parsedBody.Body.toLowerCase() : "";

  // Adicionando logs para depuração
  console.log("Mensagem recebida:", message);

  if (message.includes("Ola" || "oi")) {
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
