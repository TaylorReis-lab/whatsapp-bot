const twilio = require("twilio");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";

  try {
    // Parse the body of the request safely
    const parsedBody = event.body ? JSON.parse(event.body) : {};

    // Check if Body property exists
    message = parsedBody.Body ? parsedBody.Body.toLowerCase() : "";
  } catch (error) {
    console.error("Error parsing the request body:", error);
  }

  // Add logs for debugging
  console.log("Mensagem recebida:", message);

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
