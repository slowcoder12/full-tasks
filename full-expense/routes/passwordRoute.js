const express = require("express");
const router = express.Router();

const passwordController = require("../controllers/passwordController");

router.post("/forgotPassword", passwordController.forgotPassword);

module.exports = router;
