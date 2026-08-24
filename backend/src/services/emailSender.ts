import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: env.SMTP_PORT,
  secure: env.SMTP_PORT === 465,
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASSWORD,
  },
});

export async function sendEmail(
  recipient: string,
  subject: string,
  body: string,
) {
  return transporter.sendMail({
    from: env.SMTP_FROM,
    to: recipient,
    subject,
    text: body,
  });
}

export async function verifyEmailTransport() {
  await transporter.verify();
  console.log("SMTP connection verified");
}