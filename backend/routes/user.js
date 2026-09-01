const express = require("express");
const {
  handleUserSignup,
  handleUserLogin,
  handleGetMe,
} = require("../controllers/user");
const { requireAuth } = require("../middlewares/auth");

const router = express.Router();

router.post("/signup", handleUserSignup);
router.post("/login", handleUserLogin);
router.get("/me", requireAuth, handleGetMe);

module.exports = router;
