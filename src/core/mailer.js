import nodemailer from "nodemailer"

const options = {
    host: "smtp.ukr.net",
    port: 465,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
    }
}

class sendEmail {
    transport = null;
    constructor() {
        this.transport = nodemailer.createTransport(options);
    }
    async sendActivationMail(to, link) {
        await this.transport.sendMail({
            from: process.env.SMTP_USER,
            to,
            subject: "Account activation on " + process.env.API_URL,
            test: "",
            html: `
                <div>
                    <h1>For activetion go to the link</h1>
                    <a href="${link}">Activation link</a>
                </div>
            `
        });
    }
}

export default new sendEmail()