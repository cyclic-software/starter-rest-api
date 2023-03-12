const express = require("express");
const router = express.Router();
const collectionRoutes = require("./collections");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.send(
    "<p>This is an auxiliary API for Sokker Helper chrome extension requests</p>"
  );
});

router.use("/", collectionRoutes);

module.exports = router;
