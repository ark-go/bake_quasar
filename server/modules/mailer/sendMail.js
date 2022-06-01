"use strict";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();
//function sendMail(toEmail){
// async..await is not allowed in global scope, must use a wrapper

async function sendMail(toEmail, text = "", html, subject) {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  //  let account = await nodemailer.createTestAccount();

  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_host,
    port: process.env.SMTP_port,
    secure: false, // true for 465, false for other ports
    disableUrlAccess: false,
    auth: {
      user: process.env.SMTP_user, // generated ethereal user
      pass: process.env.SMTP_pass, // generated ethereal password
    },
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: process.env.SMTP_from, // sender address
    to: toEmail,
    // ARK!: Кому письмо с подтверждением..
    // to: toEmail, // list of receivers
    bcc: process.env.SMTP_bcc, //! TODO: отключить! для проверки отправлю себе

    subject: subject, //"Hello ✔", // Subject line
    text: text, // plain text body
    html: html, // html body
    // Для встроенных изображений
    //  html: 'Embedded image: <img src="cid:unique@kreata.ee"/>',
    // attachments: [{
    //     filename: 'image.png',
    //     path: '/path/to/file',
    //     cid: 'unique@kreata.ee' //same cid value as in the html img src
    // }]
  };
  // console.log("opt", mailOptions.to);
  // send mail with defined transport object
  try {
    let info = await transporter.sendMail(mailOptions);

    console.log("Письмо отправлено: %s", info.messageId);
    return {
      result: true,
    };
  } catch (e) {
    console.log("Ошибка отправки почты ", e);
    return {
      error: e.messagee,
    };
  }
}
export { sendMail };

//await sendMail("arkadii@yandex.ru", "raz", "<b>dva</>", "test");
