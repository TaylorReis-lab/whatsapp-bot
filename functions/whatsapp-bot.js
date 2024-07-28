const twilio = require("twilio");
const querystring = require("querystring");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";

  try {
    // Log the raw body for debugging
    console.log("Raw body:", event.body);

    let parsedBody = {};
    if (event.headers["content-type"] === "application/json") {
      parsedBody = JSON.parse(event.body);
    } else {
      parsedBody = querystring.parse(event.body);
    }

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
