const express = require("express");
const {
  handleGenerateUrl,
  handleGetUserUrls,
  handleGetAnalytics,
  handleDeleteUrl,
} = require("../controllers/url");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/", handleGenerateUrl);
router.get("/my-urls", requireAuth, handleGetUserUrls);
router.get("/analytics/:shortId", handleGetAnalytics);
router.delete("/:id", requireAuth, handleDeleteUrl);

module.exports = router;
