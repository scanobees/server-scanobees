import axios from "axios";


const sendWhatsappMessage = async (req, res) => {
  const { to } = req.body;

  // It is best practice to use process.env for these
  const apiKey = "YOUR_API_KEY";
  const apiToken = "YOUR_API_TOKEN";
  const accountSid = "YOUR_ACCOUNT_SID";
  const subdomain = "@api.in.exotel.com";

  const url = `https://${apiKey}:${apiToken}${subdomain}/v2/accounts/${accountSid}/messages`;

  const data = {
    whatsapp: {
      messages: [{
        from: "YOUR_WHATSAPP_NUMBER",
        to: to,
        type: "template",
        template: {
          name: "order_update",
          language: { code: "en" },
          components: [{
            type: "body",
            parameters: [
              { type: "text", text: "Asif" },
              { type: "text", text: "ORD1234" }
            ]
          }]
        }
      }]
    }
  };

  try {
    const response = await axios.post(url, data);
    res.status(200).json({
      success: true,
      data: response.data
    });
  } catch (error) {
    console.error("Exotel Error:", error.response?.data || error.message);
    res.status(500).json({
      success: false,
      error: error.response?.data || "Internal Server Error"
    });
  }
};

module.exports = { sendWhatsappMessage };