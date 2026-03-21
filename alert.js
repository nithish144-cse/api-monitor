const nodemailer = require('nodemailer')
require('dotenv').config()

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
})

const sendAlert = async (name, url) => {
    const mailOptions = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: `❌ ${name} is DOWN!`,
        text: `Your API ${name} at ${url} is not responding!`
    }

    try {
        await transporter.sendMail(mailOptions)
        console.log(`Alert sent for ${name}`)
    } catch (error) {
        console.log('Email error:', error)
    }
}

module.exports = { sendAlert }