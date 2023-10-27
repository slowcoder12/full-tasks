const express = require("express");
const router = express.Router();
const userAuthenticate = require("../middleware/auth");
const purchaseController = require("../controllers/purchaseController");

router.post(
  "/buyPremium",
  userAuthenticate.authenticate,
  purchaseController.buyPremium
);

router.post(
  "/updateTransactionStatus",
  userAuthenticate.authenticate,
  purchaseController.updateTransactionStatus
);

module.exports = router;
