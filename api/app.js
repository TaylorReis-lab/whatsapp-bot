const twilio = require("twilio");
const querystring = require("querystring");
const { sendMessage, handleMenuSelection } = require("../functions/functions");

module.exports = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";

  try {
    console.log("Raw body:", event.body);

    if (event.headers["content-type"] === "application/json") {
      parsedBody = JSON.parse(event.body);
    } else {
      parsedBody = querystring.parse(event.body);
    }

    message = parsedBody.Body ? parsedBody.Body.toLowerCase() : "";
  } catch (error) {
    console.error("Error parsing the request body:", error);
    return {
      statusCode: 400,
      body: "Invalid request body",
    };
  }

  console.log("Mensagem recebida:", message);

  const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );

  if (message.includes("oi")) {
    const profileName = parsedBody.ProfileName || "usuário";
    twiml.message(`Olá, ${profileName}! Como posso ajudar você hoje?`);
  } else if (message.includes("ajuda")) {
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
