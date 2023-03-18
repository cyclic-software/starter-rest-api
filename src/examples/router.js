import slugify from "slugify";
import { v4 as uuidv4 } from "uuid";
import { Record, String, Number, Boolean } from "runtypes";

import { authenticateUser } from "./auth.js";

import DynamoDb from "cyclic-dynamodb";
import { Router } from "express";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = DynamoDb(process.env.CYCLIC_DB);
const bikesCollection = db.collection("bikes");

// ------------------------------------
// GET ROUTES
// ------------------------------------

// Get all bikes
router.get("/all", async (req, res) => {
  const { results: bikesMetadata } = await bikesCollection.list();

  const bikes = await Promise.all(
    bikesMetadata.map(async ({ key }) => (await bikesCollection.get(key)).props)
  );

  res.send(bikes);
});

// Get bike by ID
router.get("/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const { props: bike } = await bikesCollection.get(id);
    res.send(bike);
  } catch (e) {
    console.log(e.message, `Item with ID ${id} does not exist.`);
    res.sendStatus(404);
  }
});

// Get bike by handle
router.get("/by-handle/:handle", async (req, res) => {
  const handle = req.params.handle;

  try {
    const { results } = await bikesCollection.filter({ handle });
    if (!results.length) throw new Error();

    const { props: bike } = results[0];
    res.send(bike);
  } catch (e) {
    console.log(e.message, `Item with handle ${handle} does not exist.`);
    res.sendStatus(404);
  }
});

// Search bikes by title
router.get("/search/by-title", async (req, res) => {
  const query = req.query.query || "";

  try {
    const { results } = await bikesCollection.parallel_scan({
      expression: "contains(#title, :title)",
      attr_names: {
        "#title": "title",
      },
      attr_vals: {
        ":title": query,
      },
    });

    const bikes = results.map(({ props }) => props);
    res.send(bikes);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(400);
  }
});

// ------------------------------------
// POST ROUTES
// ------------------------------------

// Type for new bikes
const Money = Record({
  amount: Number,
  currencyCode: String,
});
const PriceRange = Record({
  minPrice: Money,
  maxPrice: Money,
});
const BikeData = Record({
  title: String,
  productType: String,
  createdAt: String,
  description: String,
  vendor: String,
  availableForSale: Boolean,
  totalInventory: Number,
  priceRange: PriceRange,
});

// Post new bike
router.post("/", authenticateUser, async (req, res) => {
    const bikeData = req.body;

    try {
      // Make sure bike data exists
      if (!req.body) {
        throw new Error();
      }
  
      // Make sure bike data contains all required fields
      const bikeObject = BikeData.check(bikeData);
  
      // Generate ID and Handle for bike
      const bikeId = uuidv4();
      const bikeHandle = slugify(bikeObject.title).toLocaleLowerCase();
  
      // Create full bike object
      const bike = {
        ...bikeObject,
        id: bikeId,
        handle: bikeHandle,
      };
  
      // Save bike object
      await bikesCollection.set(bikeId, bike);
  
      res.send(bike);
    } catch (e) {
      res.sendStatus(400);
    }
});

// ------------------------------------
// PATCH ROUTES
// ------------------------------------

// Patch bike if it exists
router.patch("/:id", authenticateUser, async (req, res) => {
  const bikeId = req.params.id;
  const newData = req.body || {};

  try {
    const { props: oldBike } = await bikesCollection.get(bikeId);
    const bike = {
      ...oldBike,
      ...newData,
    };

    // Save new bike object
    await bikesCollection.set(bikeId, newData);

    res.send(bike);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});

// ------------------------------------
// PUT ROUTES
// ------------------------------------

// Update entire bike
router.put("/:id", authenticateUser, async (req, res) => {
  const bikeId = req.params.id;
  const bikeData = req.body;

  try {
    // Make sure bike data exists
    if (!req.body) {
      throw new Error();
    }

    // Make sure bike has ID and handle
    if (!bikeData.id || !bikeData.handle) {
      throw new Error();
    }

    // Make sure bike data contains all required fields
    const bikeObject = BikeData.check(bikeData);

    // Delete existing bike object
    await bikesCollection.delete(bikeId);

    // Save new bike object
    await bikesCollection.set(bikeId, bikeObject);

    res.send(bikeObject);
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});

// ------------------------------------
// DELETE ROUTES
// ------------------------------------

// Delete bike if it exists
router.delete("/:id", authenticateUser, async (req, res) => {
  const bikeId = req.params.id;

  try {
    await bikesCollection.delete(bikeId);

    res.send({
      id: bikeId,
    });
  } catch (e) {
    console.log(e.message);
    res.sendStatus(404);
  }
});
