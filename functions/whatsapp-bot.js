const twilio = require("twilio");
const querystring = require("querystring");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";
  let parsedBody = {};

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
    twiml.message(`Olá ${profileName},  Como posso ajudar você hoje?`);
  } else if (message.includes("ajuda")) {
    twiml.message(
      "Aqui estão algumas opções para melhor te ajudar: \n1. Informações sobre nós\n2. Suporte técnico\n3. Fale com um representante\n4. Ver nossos planos\n5. Nosso site"
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

    twiml.message(
      "Conectando você a um representante..."
    );

    const representativeNumber = "whatsapp:+556499833928";
    const notificationMessage = `O usuário - ${profileName}, com o numero - (https://api.whatsapp.com/send?phone=${userPhone}), deseja falar com um representante.`;

    try {
      await client.messages.create({
        body: notificationMessage,
        from: parsedBody.To,
        to: representativeNumber,
      });
    } catch (error) {
      console.error("Error sending notification to representative:", error);
    }
  } else if (message.includes("4")) {
    twiml.message(
      "\Planos mensal: 90 Reis\Plano anul: 70 reias * 12 meses\Aula esperimental: Agende já sua aula: <link para agendamento de aula experimental"
    );
  } else if (message.includes("5")) {
    twiml.message("Acesse nosso site: (https://gran-fitness-site.netlify.app)");
  }
  else {
    twiml.message(
      "Desculpe, não entendi sua mensagem. Por favor, escolha uma das opções do menu de ajuda."
    );
  }

  return {
    statusCode: 200,
    headers: { "Content-Type": "application/xml" },
    body: twiml.toString(),
  };
};
