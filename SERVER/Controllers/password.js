const { Password } = require(`../Models/passwordReset`);
const { User } = require(`../Models/users`);
const { v4: uuidv4 } = require('uuid');
const bcrypt = require(`bcrypt`);
const nodemailer = require("nodemailer");


exports.forgotPassword = async (req, res) =>{
    try {
        const { emailId } = req.body;
        
        const reqId = uuidv4();

        const user = await User.findOne({ email : emailId });

        if (!user) {
            console.log(user)
            return res.status(404).json({
              success: false,
              message: "User not found",
            });
          }

          console.log(reqId)
        const generatedReq = await Password.create({
          _id: reqId,
          userId: user._id,
        });
        const resetLink = `http://${process.env.API_BASE_URL}/password/reset-password-link?token=${reqId}`; //chnaged

        const transporter = nodemailer.createTransport({
            service: process.env.NODE_MAILER_SERVICE,
            auth: {
                user: process.env.NODE_MAILER_USER, // Your Gmail email address
                pass: process.env.NODE_MAILER_PASSWORD, // App Password (NOT your actual Gmail password)
            },
        });

        const mailOptions = {
            from: process.env.NODE_MAILER_USER, // Sender address
            to: emailId, // Recipient address 
            subject: "Password Reset Request", // Subject line
            html: `
                <p>You have requested a password reset.</p>
                <p>Please click the following link to reset your password:</p>
                <a href="${resetLink}">${resetLink}</a>
                <p>If you did not request a password reset, please ignore this email.</p>
            `
        };

          const info = await transporter.sendMail(mailOptions);
          console.log('Email sent:', info.messageId);

        res.status(201).json({
            success: true,
            link : resetLink,
            data: generatedReq
        })

    } catch (error) {
        console.log(error);

        res.status(500).json({ 
            success: false,
            error : error.message
        });
    }
}


exports.resetPasswordGet = async (req, res) => {

    const { token } = req.query; // Extract the token from the query string

    if (!token) {
      return res.status(400).send("Invalid reset link.");
    }

    res.render("reset-password", { 
       token : token,
       PUBLIC_IP : process.env.API_BASE_URL,
       HOME_PAGE_URL :  process.env.HOME_PAGE_URL
    }); 
}


exports.resetPasswordPost = async (req, res) => {
  try {
    const { reqId, password } = req.body;

    // Find the password reset request by _id (string)
    const passwordReset = await Password.findOne({ _id: reqId });

    // Check if the document exists
    if (!passwordReset) {
      return res.status(404).json({
        success: false,
        message: "Reset token not found",
      });
    }

    // Check if the token is active
    if (!passwordReset.isActive) {
      return res.status(400).json({
        success: false,
        message: "Reset link is expired or invalid",
      });
    }

    // Hash the new password and update the user
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.findByIdAndUpdate(passwordReset.userId, { password: hashedPassword });

    // Deactivate the token
    await Password.findOneAndUpdate({ _id: reqId }, { isActive: false });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error: error.message,
    });
  }
};