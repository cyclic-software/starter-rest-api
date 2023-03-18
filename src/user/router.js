import { Record, String } from "runtypes";
import { authenticateUser } from "../auth/auth.js";
import DynamoDb from "cyclic-dynamodb";
import { Router } from "express";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = DynamoDb(process.env.CYCLIC_DB);
const usersCollection = db.collection("users");

// ------------------------------------
// GET ROUTES
// ------------------------------------

// Get all users
router.get("/", async (req, res) => {
    const { results: usersMetadata } = await usersCollection.list();

    const users = await Promise.all(
        usersMetadata.map(async ({ key }) => (await usersCollection.get(key)).props)
    );

    res.send(users);
});

// Get user by email
router.get("/:email", async (req, res) => {
    const email = req.params.email;

    try {
        const { props: user } = await usersCollection.get(email);
        res.send(user);
    } catch (e) {
        console.log(e.message, `User with email ${email} does not exist.`);
        res.sendStatus(404);
    }
});

// ------------------------------------
// POST ROUTES
// ------------------------------------

// Type for new user
const GameUserData = Record({
    email: String,
    preferredName: String,
});

// Post new user
router.post("/", authenticateUser, async (req, res) => {
    const userData = req.body;

    try {
        // Make sure user data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure user data contains all required fields
        const userObject = GameUserData.check(userData);

        // Save user object
        await usersCollection.set(email, userObject);

        res.send(user);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(400);
    }
});

// ------------------------------------
// PUT ROUTES
// ------------------------------------

// Update entire user
router.put("/:email", authenticateUser, async (req, res) => {
    const userEmail = req.params.email;
    const userData = req.body;

    try {
        // Make sure user data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure user has email
        if (!userData.email) {
            throw new Error();
        }

        // Make sure the user data has the same email as given in the path parameter
        if (userEmail !== userData.email) {
            throw new Error();
        }

        // Make sure user data contains all required fields
        const userObject = GameUserData.check(userData);

        // Delete existing user object
        await usersCollection.delete(userEmail);

        // Save new user object
        await usersCollection.set(userEmail, userObject);

        res.send(userObject);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});

// ------------------------------------
// DELETE ROUTES
// ------------------------------------

// Delete user if she or he exists
router.delete("/:email", authenticateUser, async (req, res) => {
    const userEmail = req.params.email;

    try {
        await usersCollection.delete(userEmail);

        res.send({email: userEmail});
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});
