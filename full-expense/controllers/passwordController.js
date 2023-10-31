const Sib = require("sib-api-v3-sdk");
const client = Sib.ApiClient.instance;
const apiKey = client.authentications["api-key"];
apiKey.apiKey =
  "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";

exports.forgotPassword = async (req, res) => {
  const email = req.body.email;
  //console.log(email);

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

  tranEmailApi
    .sendTransacEmail({
      sender,
      to: receivers,
      subject: "Forgot Password",
      textContent: `
          This email is to reset your password for expense tracker
          `,
    })
    .then(console.log)
    .catch(console.log);
};
