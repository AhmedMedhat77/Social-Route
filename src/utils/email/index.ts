import nodemailer from "nodemailer";
import config from "../../config";
import AppError from "../error/AppError";
import { MailOptions } from "nodemailer/lib/json-transport";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: config.emailUser,
    pass: config.EMAIL_PASSWORD,
  },
});

export const sendEmail = async (mailOptions: MailOptions) => {
  try {
    const OPTIONS: MailOptions = {
      from: mailOptions.from || `'Ecommerce App' ${config.emailUser}`,
      to: mailOptions.to,
      subject: mailOptions.subject,
      text: mailOptions.text,
      ...mailOptions,
    };
    await transporter.sendMail(OPTIONS);
  } catch (error) {
    if (error instanceof Error) {
      throw new AppError(error.message, 500);
    }
    throw new AppError("Failed to send email", 500);
  }
};
