const twilio = require("twilio");
const querystring = require("querystring");

exports.handler = async (event, context) => {
  const { MessagingResponse } = twilio.twiml;
  const twiml = new MessagingResponse();

  let message = "";
  let parsedBody = {};

  try {
    // Log the raw body for debugging
    console.log("Raw body:", event.body);

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
    const profileName = parsedBody.ProfileName || "usuário";
    twiml.message(`Olá, ${profileName}! Como posso ajudar você hoje?`);
  } else if (message.includes("ajuda")) {
    const listMessage = {
      to: parsedBody.From,
      from: parsedBody.To,
      type: "interactive",
      interactive: {
        type: "list",
        body: {
          text: "O que deseja fazer primeiro?",
        },
        action: {
          button: "Escolher",
          sections: [
            {
              title: "Opções",
              rows: [
                {
                  id: "1",
                  title: "Informações sobre nós",
                },
                {
                  id: "2",
                  title: "Suporte técnico",
                },
                {
                  id: "3",
                  title: "Fale com um representante",
                },
                {
                  id: "4",
                  title: "Ver nossos produtos",
                },
              ],
            },
          ],
        },
      },
    };
    try {
      await client.messages.create(listMessage);
    } catch (error) {
      console.error("Error sending list message:", error);
    }
    return {
      statusCode: 200,
      body: "",
    };
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
      "Fale com um representante: Conectando você a um representante..."
    );

    // Enviar notificação ao representante
    const representativeNumber = "whatsapp:+<REPRESENTATIVE_PHONE_NUMBER>"; // Coloque o número do representante aqui
    const notificationMessage = `O usuário ${profileName} (${userPhone}) deseja falar com um representante.`;

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
      "Ver nossos produtos: Aqui está a lista de nossos produtos..."
    );
  } else {
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
