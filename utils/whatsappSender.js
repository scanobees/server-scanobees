import axios from "axios";

// export async function sendWhatsAppMessage({
//   to,
//   templateName,
//   parameters,
// }) {
//   const url = `https://${process.env.EXOTEL_API_KEY}:${process.env.EXOTEL_API_TOKEN}${process.env.EXOTEL_SUBDOMAIN}/v2/accounts/${process.env.EXOTEL_ACCOUNT_SID}/messages`;

//   const payload = {
//     whatsapp: {
//       messages: [
//         {
//           from: process.env.EXOTEL_WHATSAPP_NUMBER,
//           to,
//           content: {
//             type: "template",
//             template: {
//               name: templateName,
//               language: { code: "en" },
//               components: [
//                 {
//                   type: "body",
//                   parameters: parameters.map((p) => ({
//                     type: "text",
//                     text: p,
//                   })),
//                 },
//               ],
//             },
//           },
//         },
//       ],
//     },
//   };

//   return axios.post(url, payload);
// }


export async function sendWhatsAppMessage({
  to,
  templateName,
  parameters,
}) {
  const {
    EXOTEL_API_KEY,
    EXOTEL_API_TOKEN,
    EXOTEL_SUBDOMAIN,
    EXOTEL_ACCOUNT_SID,
    EXOTEL_WHATSAPP_NUMBER,
  } = process.env;

  // 🔎 Safety check (VERY IMPORTANT)
  if (
    !EXOTEL_API_KEY ||
    !EXOTEL_API_TOKEN ||
    !EXOTEL_SUBDOMAIN ||
    !EXOTEL_ACCOUNT_SID ||
    !EXOTEL_WHATSAPP_NUMBER
  ) {
    throw new Error("Missing Exotel environment variables");
  }

  // ✅ CORRECT URL
  const url = `https://${EXOTEL_API_KEY}:${EXOTEL_API_TOKEN}@${EXOTEL_SUBDOMAIN}/v2/accounts/${EXOTEL_ACCOUNT_SID}/messages`;

  const payload = {
    whatsapp: {
      messages: [
        {
          from: EXOTEL_WHATSAPP_NUMBER, // must be whatsapp:+91...
          to,                           // +91...
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
                    text: String(p),
                  })),
                },
              ],
            },
          },
        },
      ],
    },
  };

  // 🧪 TEMP DEBUG (remove later)
  console.log("📡 Exotel URL:", url);
  console.log("📦 Exotel payload:", JSON.stringify(payload, null, 2));

  try {
    return await axios.post(url, payload);
  } catch (err) {
    console.error("❌ Exotel API Error");

    if (err.response) {
      console.error("Status:", err.response.status);
      console.error(
        "Data:",
        JSON.stringify(err.response.data, null, 2)
      );
    } else {
      console.error("Message:", err.message);
    }

    throw err;
  }
}