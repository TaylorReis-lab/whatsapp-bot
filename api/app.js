const twilio = require("twilio");

module.exports = async (event, context) => {
  try {
    const { MessagingResponse } = twilio.twiml;
    const twiml = new MessagingResponse();
    let parsedBody = {};
    let message = "";

    parsedBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    message = parsedBody.Body ? parsedBody.Body.toLowerCase().trim() : null;

    console.log("Mensagem recebida:", message);

    if (message && message.includes("oi")) {
      const profileName = parsedBody.ProfileName || "usuário";
      twiml.message(`Olá, ${profileName}! Como posso ajudar você hoje?`);
    }

    console.log("Respondendo ao usuário...");
    console.log(twiml.toString());

    return await {
      statusCode: 200,
      headers: {
        "Content-Type": "application/xml",
      },
      body: twiml.toString(),
    };
  } catch (error) {
    console.error("Erro na função:", error);

    return {
      statusCode: 500,
      body: "Ocorreu um erro ao processar sua solicitação.",
    };
  }
};
