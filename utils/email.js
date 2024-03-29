const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.from = `Ishu Singh <${process.env.EMAIL_FROM}>`;
    this.url = url;
    this.firstName = user.name.split(' ')[0];
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // SENDGRID
      return nodemailer.createTransport({
        host: process.env.SENDINBLUE_HOST,
        port: process.env.SENDINBLUE_PORT,
        auth: {
          user: process.env.SENDINBLUE_EMAIL_USERNAME,
          pass: process.env.SENDINBLUE_EMAIL_PASSWORD
        }
      });
    }
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });
  }

  //SEnD the actual mail
  async send(template, subject) {
    //1) Render html based on pug template
    const html = pug.renderFile(`${__dirname}/../views/email/${template}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject
    });
    //2)Define email option
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html)
    };
    //3) create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to the Natours Family!');
  }

  async sendPasswordReset() {
    await this.send(
      'passwordReset',
      'Your Password reset token (valid for only 10 minutes).'
    );
  }
};
