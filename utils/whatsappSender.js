import axios from "axios";

export async function sendWhatsAppMessage({
  to,
  templateName,
  parameters,
}) {
  const url = `https://${process.env.EXOTEL_API_KEY}:${process.env.EXOTEL_API_TOKEN}${process.env.EXOTEL_SUBDOMAIN}/v2/accounts/${process.env.EXOTEL_ACCOUNT_SID}/messages`;

  const payload = {
    whatsapp: {
      messages: [
        {
          from: process.env.EXOTEL_WHATSAPP_NUMBER,
          to,
          content: {
            type: "template",
            template: {
              name: templateName,
              language: { code: "en" },
              components: [
                {
                  type: "body",
                  parameters: parameters.map((p) => ({
                    type: "text",
                    text: p,
                  })),
                },
              ],
            },
          },
        },
      ],
    },
  };

  return axios.post(url, payload);
}
