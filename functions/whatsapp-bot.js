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
    twiml.message(
      "Claro! Aqui está algumas opções: \n1. Informações sobre nós\n2. Suporte técnico\n3. Fale com um representante\n4. Ver nossos produtos"
    );
  } else if (message.includes('1')) {
    twiml.message('Informações sobre nós: Somos uma empresa dedicada a...');
  } else if (message.includes('2')) {
    twiml.message('Suporte técnico: Por favor, descreva seu problema técnico e nossa equipe irá ajudar.');
  } else if (message.includes('3')) {
    twiml.message('Fale com um representante: Conectando você a um representante...');
  } else if (message.includes('4')) {
    twiml.message('Ver nossos produtos: Aqui está a lista de nossos produtos...');
  } else if (message.includes('')) {
    twiml.message('Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu de ajuda.');
  } else {
    twiml.message("Desculpe, não entendi sua mensagem.");
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/xml" },
    body: twiml.toString(),
  };
};
