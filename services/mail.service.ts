import transporter from "../config/mailer.config";
import { Options } from "nodemailer/lib/mailer";

type ExtendedOptions = Options & { template: string; context: Record<string, any> };

export const sendVerificationEmail = async (email: string, verificationUrl: string) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email address",
      template: "verify-email",
      context: {
        verificationUrl,
      },
    } as ExtendedOptions,
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    }
  );
};

export const sendWelcomeEmail = async (email: string, verificationUrl: string) => {
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Welcome to our platform",
      template: "welcome-email",
      context: {
        verificationUrl,
      },
    } as ExtendedOptions,
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log(`Email sent: ${info.response}`);
      }
    }
  );
};
