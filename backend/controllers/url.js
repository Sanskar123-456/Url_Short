const URL = require("../models/url");
const shortid = require("shortid");

function getBaseUrl(req) {
  const host = req.get("host");
  const protocol = req.protocol === "https" || req.get("x-forwarded-proto") === "https" ? "https" : "http";
  if (host) {
    return `${protocol}://${host}`;
  }
  return process.env.BASE_URL || `http://localhost:${process.env.PORT || 8001}`;
}

async function handleGenerateUrl(req, res) {
  try {
    const { url } = req.body;
    if (!url || !url.trim()) {
      return res.status(400).json({ error: "URL is required" });
    }

    let targetUrl = url.trim();
    // Prepend https:// if no protocol is present
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = `https://${targetUrl}`;
    }

    const shortId = shortid.generate();
    const createdBy = req.user ? req.user.id : null;

    const newUrl = await URL.create({
      shortID: shortId,
      redirectURL: targetUrl,
      visitHistory: [],
      createdBy: createdBy,
    });

    const baseUrl = getBaseUrl(req);

    return res.json({
      id: shortId,
      shortUrl: `${baseUrl}/${shortId}`,
      redirectURL: targetUrl,
      totalClicks: 0,
      createdAt: newUrl.createdAt,
    });
  } catch (error) {
    console.error("Error generating short URL:", error);
    return res.status(500).json({ error: "Failed to generate short URL" });
  }
}

async function handleGetUserUrls(req, res) {
  try {
    const userId = req.user.id;
    const urls = await URL.find({ createdBy: userId }).sort({ createdAt: -1 });

    const baseUrl = getBaseUrl(req);

    const formattedUrls = urls.map((entry) => ({
      _id: entry._id,
      shortID: entry.shortID,
      shortUrl: `${baseUrl}/${entry.shortID}`,
      redirectURL: entry.redirectURL,
      totalClicks: entry.visitHistory ? entry.visitHistory.length : 0,
      createdAt: entry.createdAt,
    }));

    return res.json({ urls: formattedUrls });
  } catch (error) {
    console.error("Error fetching user URLs:", error);
    return res.status(500).json({ error: "Failed to fetch URLs" });
  }
}

async function handleGetAnalytics(req, res) {
  try {
    const shortId = req.params.shortId;
    const result = await URL.findOne({ shortID: shortId });
    if (!result) {
      return res.status(404).json({ error: "Short URL not found" });
    }
    return res.json({
      totalClicks: result.visitHistory.length,
      analytics: result.visitHistory,
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return res.status(500).json({ error: "Failed to fetch analytics" });
  }
}

async function handleDeleteUrl(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Allow deleting either by MongoDB _id or by shortID
    const urlDoc = await URL.findOne({
      $and: [
        { $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { shortID: id }] },
        { createdBy: userId },
      ],
    });

    if (!urlDoc) {
      return res.status(404).json({ error: "URL not found or unauthorized to delete." });
    }

    await URL.findByIdAndDelete(urlDoc._id);

    return res.json({ message: "URL deleted successfully." });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ error: "Failed to delete URL." });
  }
}

module.exports = {
  handleGenerateUrl,
  handleGetUserUrls,
  handleGetAnalytics,
  handleDeleteUrl,
};
