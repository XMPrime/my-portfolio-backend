const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const creds = require("./config");

const port = process.env.PORT || 5000;
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const transport = {
  host: "smtp.gmail.com",
  port: 465,
  auth: {
    user: creds.USER,
    pass: creds.PASS,
  },
};

const transporter = nodemailer.createTransport(transport);

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post("/contact", (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const subject = req.body.subject;
  const message = req.body.message;
  const content = `name: ${name} \n email: ${email} \n message: ${message} `;

  const mail = {
    from: name,
    to: "jason.l.chen@gmail.com", // Change to email address that you want to receive messages on
    subject: subject,
    text: content,
  };

  transporter.sendMail(mail, (err, data) => {
    console.log(mail);
    if (err) {
      console.log(err);
      res.json({
        status: "fail",
      });
    } else {
      res.json({
        status: "success",
      });
    }
  });
});

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);
app.listen(port, () => {
  console.log(`'listening on ${port}`);
});
