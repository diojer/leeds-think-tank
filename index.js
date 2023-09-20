const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://leedsthinktank.org.uk",
      "https://funny-travesseiro-f2f2fc.netlify.app",
      "https://leeds-think-tank-server.onrender.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userID",
    secret: "CHANGETHISDUMBFUCK", //CHANGE THIS TO AN .ENV DUMBFUCK
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 0,
    },
  })
);

const db = require("./models");

//Routes
app.use("/articles", require("./routes/Articles"));
app.use("/mailinglist", require("./routes/MailingList"));
app.use("/sponsors", require("./routes/Sponsors"));
app.use("/reports", require("./routes/Reports"));
app.use("/users", require("./routes/Users"));

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server running");
  });
});
