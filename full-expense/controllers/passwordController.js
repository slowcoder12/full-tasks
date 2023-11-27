const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey = process.env.SENDINBLUE_API_KEY;
const bcrypt = require("bcrypt");

const uuid = require("uuid");
const ForgotPasswordRequest = require("../models/forgotPassword");
require("dotenv").config();
const User = require("../models/user");

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  const requestId = uuid.v4();

  try {
    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await ForgotPasswordRequest.create({
      id: requestId,
      userId: user.id,
      isActive: true,
    });

    const resetUrl = `http://43.204.236.189:3000/resetpassword/${requestId}`;
    const tranEmailApi = new Sib.TransactionalEmailsApi();
    const sender = {
      email: "codepractice1@outlook.com",
      name: "Expense Tracker",
    };
    const receivers = [
      {
        email: email,
      },
    ];

    const emailContent = {
      subject: "Forgot Password",
      htmlContent: `
        <p>This email is to reset your password for Expense Tracker.</p>
        <p>Click the following link to reset your password:</p>
        <a href="${resetUrl}">Reset Password</a>
      `,
    };

    tranEmailApi
      .sendTransacEmail({
        sender,
        to: receivers,
        ...emailContent,
      })
      .then((response) => {
        console.log("Password reset email sent successfully");
        res
          .status(200)
          .json({ message: "Password reset email sent successfully" });
      })
      .catch((error) => {
        console.error("Error sending reset password email:", error);
        res.status(500).json({ message: "Internal server error" });
      });
  } catch (error) {
    console.error("Error handling forgot password request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.resetPassword = async (req, res) => {
  const requestId = req.params.requestId;
  console.log("Received requestId:", requestId);

  const htmlForm = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password</title>
      </head>
      <body>
          <h1>Reset Password</h1>
          <form action="/updatePassword/${requestId}" method="POST">
              <label for="newPassword">New Password:</label>
              <input type="password" id="newPassword" name="newPassword" required>
              <br>
              <button type="submit">Reset Password</button>
          </form>
      </body>
      </html>
    `;

  res.send(htmlForm);
};

exports.updatePassword = async (req, res) => {
  const requestId = req.params.requestId;
  const newPassword = req.body.newPassword;

  console.log("updateddd", requestId);
  console.log("passs", newPassword);

  try {
    const request = await ForgotPasswordRequest.findByPk(requestId);
    console.log(request);

    if (!request || !request.isActive) {
      return res.status(404).json({
        message: "Password reset request not found or has already been used.",
      });
    }

    if (!newPassword) {
      return res.status(404).json({ message: "pass should not be empty" });
    }

    const user = await User.findByPk(request.userId);

    if (user) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
      user.password = hashedPassword;

      await user.save();

      request.isActive = false;
      await request.save();

      res.status(200).json({ message: "Password reset successful" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
