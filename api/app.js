const twilio = require("twilio");
const querystring = require("querystring");
const { sendMessage, handleMenuSelection } = require("../functions/functions");

module.exports = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";
  let parsedBody = {};

  try {
    const parsedBody = JSON.parse(JSON.stringify(event.body));

    console.log("Corpo parsedBody, Vindo do meu event:",parsedBody);

    message = parsedBody.Body ? parsedBody.Body.toLowerCase().trim() : null;

    console.log("Mensagem recebida:", message);
  } catch (error) {
    console.error("Error parsing the request body:", error);
    return {
      statusCode: 400,
      body: "Invalid request body",
    };
  }

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (message && message.includes("oi")) {
    const profileName = parsedBody.ProfileName || "usuário";
    twiml.message(`Olá, ${profileName}! Como posso ajudar você hoje?`);
  } else if (message && message.includes("ajuda")) {
    twiml.message(
      "Aqui estão algumas opções para melhor te ajudar:\n1. Informações sobre nós\n2. Suporte técnico\n3. Fale com um representante\n4. Ver nossos planos\n5. Nosso site"
    );
  } else {
    await handleMenuSelection(message, parsedBody, client, twiml);
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/xml" },
    body: twiml.toString(),
  };
};
