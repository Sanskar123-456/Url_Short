require("dotenv").config();
const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const cors = require("cors");
const { connectMongoDB } = require("./connect");

const app = express();
const PORT = process.env.PORT || 8001;

connectMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected")
);

app.use(express.json());
// app.use(cors({ origin: "http://localhost:5173" }));
app.use(cors({ origin: "*" }));

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortID = req.params.shortId;
  const entry = await URL.findOneAndUpdate({ shortID });
  res.redirect(entry.redirectURL);
});

app.listen(8001, console.log(`Server Started at PORT : ${PORT}`));
