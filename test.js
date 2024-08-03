const twilio = require("twilio");

module.exports = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  try {
    console.log("Iniciando função...");

    twiml.message("Esta é uma resposta de teste. O bot está funcionando.");

    console.log("Respondendo ao usuário...");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/xml" },
      body: twiml.toString(),
    };
  } catch (error) {
    console.error("Erro ao processar a mensagem:", error);
    return {
      statusCode: 500,
      body: "Erro no processamento da mensagem",
    };
  }
};
