require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { connectMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const userRoute = require("./routes/user");
const URL = require("./models/url");
const { authenticateUser } = require("./middlewares/auth");

const app = express();
const PORT = process.env.PORT || 8001;

connectMongoDB(process.env.MONGO_URL).then(() =>
  console.log("MongoDB Connected")
);

app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global authentication middleware to decode JWT token if present
app.use(authenticateUser);

// Routes
app.use("/url", urlRoute);
app.use("/user", userRoute);

// Short URL redirection route with non-cached 302 redirect
app.get("/:shortId", async (req, res) => {
  try {
    const shortID = req.params.shortId;
    
    // Increment visit history timestamp
    const entry = await URL.findOneAndUpdate(
      { shortID },
      {
        $push: {
          visitHistory: {
            timestamp: Date.now(),
          },
        },
      },
      { new: true }
    );

    if (!entry) {
      return res.status(404).send("<h2>404 - Short URL Not Found</h2>");
    }

    // Set cache control headers so browsers do not cache the redirect
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    console.log(`[Click Tracked] ShortID: ${shortID} -> Total Clicks: ${entry.visitHistory.length}`);

    return res.redirect(302, entry.redirectURL);
  } catch (err) {
    console.error("Redirect error:", err);
    return res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => console.log(`Server Started at PORT : ${PORT}`));
