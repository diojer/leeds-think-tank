const express = require("express");
const app = express();
const cors = require("cors");
const session = require("express-session");

app.use(express.json());
app.use(cors());
app.use(
  session({
    secret: "66849fbkgfdg",
  })
);

const db = require("./models");

//Routers
app.use("/articles", require("./routes/Articles"));
app.use("/mailinglist", require("./routes/MailingList"));
app.use("/sponsors", require("./routes/Sponsors"));
app.use("/reports", require("./routes/Reports"));

db.sequelize.sync().then(() => {
  app.listen(process.env.PORT || 3001, () => {
    console.log("Server running on Port 3001");
  });
});
