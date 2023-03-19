import { v4 as uuidv4 } from "uuid";
import { Record, String, Number, Boolean } from "runtypes";
// import { authenticateUser } from "../auth/auth.js";
import DynamoDb from "cyclic-dynamodb";
import { Router } from "express";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = DynamoDb(process.env.CYCLIC_DB);
const gamesCollection = db.collection("games");

// ------------------------------------
// GET ROUTES
// ------------------------------------

// Get all games
router.get("/", async (req, res) => {
    const { results: gamesMetadata } = await gamesCollection.list();

    const games = await Promise.all(
        gamesMetadata.map(async ({ key }) => (await gamesCollection.get(key)).props)
    );

    res.send(games);
});

// Get game by id
router.get("/:id", async (req, res) => {
    const gameId = req.params.id;

    try {
        const { props: game } = await gamesCollection.get(gameId);
        res.send(game);
    } catch (e) {
        console.log(e.message, `Game with id ${gameId} does not exist.`);
        res.sendStatus(404);
    }
});

// ------------------------------------
// POST ROUTES
// ------------------------------------

// Type for new game
const GameData = Record({
    name: String,
    info: String,
    startDate: String,
    numberOfWeights: Number,
    weightFrequency: String,
    minWeightLoss: Number,
    weightUnit: String,
    fee: Number,
    currency: String,
    vacationLength: Number,
    isLastWeightPaid: Boolean,
    // participants: Participant[]
});

// Post new game
router.post("/", async (req, res) => {
    const gameData = req.body;

    try {
        // Make sure game data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure game data contains all required fields
        const gameObject = GameData.check(gameData);

        // Generate ID
        const gameId = uuidv4();

        // Create full game object
        const game = {
            ...gameObject,
            id: gameId
        };

        // Save game object
        await gamesCollection.set(gameId, game);

        res.send(game);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(400);
    }
});

// ------------------------------------
// PUT ROUTES
// ------------------------------------

// Update entire game
router.put("/:id", async (req, res) => {
    const gameId = req.params.id;
    const gameData = req.body;

    try {
        // Make sure game data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure game has id
        if (!gameData.id) {
            throw new Error();
        }

        // Make sure the game data has the same id as given in the path parameter
        if (gameId !== gameData.id) {
            throw new Error();
        }

        // Make sure game data contains all required fields
        const gameObject = GameData.check(gameData);

        // Delete existing game object
        await gamesCollection.delete(gameId);

        // Save new game object
        await gamesCollection.set(gameId, gameObject);

        res.send(gameObject);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});

// ------------------------------------
// DELETE ROUTES
// ------------------------------------

// Delete game if it exists
router.delete("/:id", async (req, res) => {
    const gameId = req.params.id;

    try {
        await gamesCollection.delete(gameId);

        res.send({id: gameId});
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});
