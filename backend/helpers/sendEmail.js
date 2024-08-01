const nodemailer = require("nodemailer");

const ejs = require('ejs');

const sendEmail = async ({viewFilename,data,from,to}) => {
    const transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "0ee01281a0f632",
          pass: "af3dbb8ae192cd"
        }
      });

      const dataString = await ejs.renderFile('./views/'+viewFilename+'.ejs',data);
      try {
            const info = await transport.sendMail({
                from,
                to,
                subject: "Hello ✔", // Subject line
                text: "Hello world?", // plain text body
                html: dataString, // html body
              });
            console.log("Message sent: %s", info.messageId);
      } catch (error) {
        throw new Error(error)
      }
}

module.exports = sendEmail;