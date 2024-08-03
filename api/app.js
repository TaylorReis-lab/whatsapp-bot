const twilio = require("twilio");

module.exports = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";
  let parsedBody = {};

  try {
    parsedBody =
      typeof event.body === "string" ? JSON.parse(event.body) : event.body;
    message = parsedBody.Body ? parsedBody.Body.toLowerCase().trim() : null;

    console.log("Mensagem recebida:", message);
  } catch (error) {
    console.error("Error parsing the request body:", error);
    return {
      statusCode: 400,
      body: "Invalid request body",
    };
  }

  try {
    if (message && message.includes("oi")) {
      const profileName = parsedBody.ProfileName || "usuário";
      twiml.message(`Olá, ${profileName}! Como posso ajudar você hoje?`);
    } else if (message.includes("ajuda")) {
      twiml.message(
        "Aqui estão algumas opções para melhor te ajudar:\n1. Informações sobre nós\n2. Suporte técnico\n3. Fale com um representante\n4. Ver nossos planos\n5. Nosso site"
      );
    } else if (message.includes("1")) {
      twiml.message("Informações sobre nós: Somos uma empresa dedicada a...");
    } else if (message.includes("2")) {
      twiml.message(
        "Suporte técnico: Por favor, descreva seu problema técnico e nossa equipe irá ajudar."
      );
    } else if (message.includes("3")) {
      const profileName = parsedBody.ProfileName || "usuário";
      const userPhone = parsedBody.WaId;

      twiml.message("Conectando você a um representante...");

      const representativeNumber = "whatsapp:+556499833928";
      const notificationMessage = `O usuário - ${profileName}, com o número - (https://api.whatsapp.com/send?phone=${userPhone}), deseja falar com um representante.`;

      // Enviar mensagem ao representante sem bloquear a resposta ao usuário
      console.log("Enviando notificação ao representante...");
      client.messages
        .create({
          body: notificationMessage,
          from: parsedBody.From,
          to: representativeNumber,
        })
        .then(() => {
          console.log("Notificação enviada ao representante.");
        })
        .catch((error) => {
          console.error("Erro ao enviar notificação ao representante:", error);
        });
    } else if (message.includes("4")) {
      twiml.message(
        "Plano mensal: 90 Reais. Plano anual: 70 Reais * 12 meses. Aula experimental: Agende já sua aula: <link para agendamento de aula experimental>"
      );
    } else if (message.includes("5")) {
      twiml.message(
        "Acesse nosso site: (https://gran-fitness-site.netlify.app)"
      );
    } else {
      twiml.message(
        "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu de ajuda."
      );
    }

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
