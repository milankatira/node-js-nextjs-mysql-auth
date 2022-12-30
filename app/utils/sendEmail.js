const nodemailer = require("nodemailer");

const transporter = (email, password) =>
  nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    auth: {
      user: email,
      pass: password,
    },
  });

exports.sendEmail = async (
  to,
  subject,
  text,
  template,
  isAttachment,
  attachments
) => {
  try {
    if (!to) {
      throw new Error("email required");
    }

    const emailer = transporter(
      process.env.SMPT_MAIL,
      process.env.SMPT_PASSWORD
    );
    let mailOptions = {};

    if (isAttachment !== undefined) {
      mailOptions = {
        from: process.env.SMPT_MAIL,
        to,
        subject,
        text,
        html: template,
        attachments,
      };
    } else {
      mailOptions = {
        from: process.env.EMAIL,
        to,
        subject,
        text,
        html: template,
        icalEvent: attachments,
      };
    }
    await emailer.sendMail(mailOptions);
  } catch (error) {
    console.log(error,"error sending mail")
    throw error;
  }
};

