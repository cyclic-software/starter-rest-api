const router = require("express").Router();
const controller = require("../controllers/collections");

// Create or Update a collection
router.route("/api/:col/:key").post(controller.setCollection);

// Delete a collection
router.route("/api/:col/:key").delete(controller.deleteCollection);

// Get a single collection
router.route("/api/:col/:key").get(controller.getCollection);

// Get a full listing of collections
router.route("/api/:col").get(controller.getCollections);

module.exports = router;
