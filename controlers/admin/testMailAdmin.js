import { sendMail } from "../../utils/sendMail.js";

export const sendTestMail = async (req, res) => {
  try {
    const { email } = req.query;

    await sendMail({
      to: email,
      subject: "Scanobees API Mail Working",
      text: "Your Brevo API email is working",
      html: "<h2>Brevo API working perfectly ✅</h2>"
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err.response?.body || err);
    res.status(500).json({ success: false });
  }
};