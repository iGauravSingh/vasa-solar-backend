const express = require("express");
const nodemailer = require("nodemailer");

const router = express.Router();

// you’ll need to:

// 1. Create a transporter object
// 2. Configure the mailoptions object
// 3. Deliver a message with sendMail()

// Additional steps

// So the bottom code will probably stop working with Gmail. The solution is to enable 2-Step Verification and generate Application password, then you can use the generated password to send emails using nodemailer.To do so you need to do the following:

// Go to your Google account at https://myaccount.google.com/
// Go to Security
// Choose 2-Step Verification - here you have to verify yourself, in my case it was with phone number and a confirmation code send as text message. After that you will be able to enabled 2-Step Verification
// Visit https://myaccount.google.com/apppasswords to create your app.
// Put a name e.g. nodemailer to your app and create it.
// A modal dialog will appear with the password. Get that password and use it in your code.

router.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  if (!name || !email || !phone || !message) {
    return res.status(400).json({ message: "All Feilds Required!" });
  }
  //   console.log(name,email,phone,message)

  try {
    // 1. Create a transporter object
    // Create a transporter object
    const transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false, // use SSL
      auth: {
        user: "api",
        pass: "16d1d4b343cdf505a6ef95005ca515a6",
      },
    });

    // 2. Configure the mailoptions object
    const mailOptions = {
      from: 'info@vasaenterprises.in',
      to: "vasaenquiry@gmail.com",
      subject: `Query From ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    };

    // 3. Send the email
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Error:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Failed to send email", error });
  }
});

module.exports = router;
