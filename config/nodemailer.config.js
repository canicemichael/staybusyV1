var nodemailer = require("nodemailer");

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "canicemichael@gmail.com",
    pass: "puiedlsnkrdmhaxl",
  },
});

module.exports.transporter = transporter;

// module.exports.sendConfirmationEmail = (email, confirmationCode) => {
//   console.log("Check");
//   transport
//     .sendMail({
//       from: user,
//       to: email,
//       subject: "Please confirm your account",
//       html: `<h1>Email Confirmation</h1>
//             <h2>Hello Dear</h2>
//             <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
//             <a href=http://localhost:8081/confirm/${confirmationCode}> Click here</a>
//           </div>`,
//     })
//     .catch((err) => console.log(err));
// };
