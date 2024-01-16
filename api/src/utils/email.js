import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'
import pug from 'pug'
import { htmlToText } from 'html-to-text'
import config from 'config'

export default class Email {
  constructor(user, url) {
    this.to = user.email
    //this.firstName = user.name.split(' ')[0]; // TODO : Bug si pas d'espace dans le nom ?
    this.name = user.name
    this.url = url
    this.from = config.get('emailFrom')
  }

  createNewTransport() {
    // Different transporter if PROD or DEV
    if (process.env.NODE_ENV === 'production') {
      // Use Sendgrid
      return nodemailer.createTransport(
        nodemailerSendgrid({
          apiKey: config.get('emailPasswordProd'),
        }),
      )

      /*return nodemailer.createTransport({
        host: config.get('emailHostProd'),
        port: config.get('emailPortProd'),
        auth: {
          user: config.get('emailUsernameProd'),
          pass: config.get('emailPasswordProd')
        }
      });*/
    }

    // If in DEV env
    return nodemailer.createTransport({
      host: config.get('emailHost'),
      port: config.get('emailPort'),
      auth: {
        user: config.get('emailUsername'),
        pass: config.get('emailPassword'),
      },
    })
  }

  // Send the actual email
  async send(template, subject) {
    // TODO : Revoir lien ? Pourquoi __dirname ne fonctionne pas ?
    // `${__dirname}/../views/emails/${template}.pug`
    // 1) Render HTML based on a pug template
    // PROD :
    //	const html = pug.renderFile(`${process.cwd()}/apps/website/api/src/views/email/${template}.pug`, {
    const html = pug.renderFile(`${process.cwd()}/src/views/email/${template}.pug`, {
      name: this.name,
      url: this.url,
      subject,
    })

    // 2) Define email options
    const emailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      // TODO : text ne fonctionne pas
      //text: htmlToText.fromString(html),
    }

    // 3) Create a transport and send email
    await this.createNewTransport().sendMail(emailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Bienvenue sur mon Portfolio ! Tom Pomarede')
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Portfolio Tom Pomarede - Réinisialiser votre mot de passe')
  }
}