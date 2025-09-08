const URL = require("../models/url");
const shortid = require("shortid");

async function handleGenerateUrl(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ error: "URL is required" });
  }
  const shortId = shortid.generate();
  await URL.create({
    shortID: shortId,
    redirectURL: body.url,
    visitHistory: [],
  });

  return res.json({
    id: shortId,
    shortUrl: `${req.protocol}://${req.get("host")}/${shortId}`,
  });
}

module.exports = {
  handleGenerateUrl,
};
