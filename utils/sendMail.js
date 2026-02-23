import { emailApi } from "../config/brevo.js";

export const sendMail = async ({ to, subject, html, text }) => {
  const sendSmtpEmail = {
    sender: {
      name: process.env.MAIL_FROM_NAME,
      email: process.env.MAIL_FROM
    },

    to: [{ email: to }],

    subject,
    htmlContent: html,
    textContent: text
  };

  return await emailApi.sendTransacEmail(sendSmtpEmail);
};