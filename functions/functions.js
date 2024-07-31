// api/functions.js
const twilio = require("twilio");

const sendMessage = async (client, from, to, body) => {
  try {
    await client.messages.create({
      body: body,
      from: from,
      to: to,
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

const handleMenuSelection = async (selection, parsedBody, client, twiml) => {
  const profileName = parsedBody.ProfileName || "usuário";
  const userPhone = parsedBody.WaId;

  switch (selection) {
    case "1":
      twiml.message("Informações sobre nós: Somos uma academia focada em desenvolvimento fisico");
      break;
    case "2":
      twiml.message(
        "Suporte técnico: Por favor, descreva seu problema técnico e nossa equipe irá ajudar."
      );
      break;
    case "3":
      twiml.message(
        "Conectando você a um representante..."
      );
      const representativeNumber = "whatsapp:+556499833928";
      const notificationMessage = `O usuário ${profileName} deseja falar com um representante.`;

      await sendMessage(client, parsedBody.To, representativeNumber, notificationMessage);
      break;
    case "4":
      twiml.message(
        "Planos mensal: 90 Reis\nPlano anual: 70 reais * 12 meses\nAula experimental: Agende já sua aula: <link para agendamento de aula experimental>"
      );
      break;
    case "5":
      twiml.message("Acesse nosso site: (https://gran-fitness-site.netlify.app)");
      break;
    default:
      twiml.message(
        "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu de ajuda."
      );
      break;
  }
};

module.exports = {
  sendMessage,
  handleMenuSelection,
};
