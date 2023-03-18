import { v4 as uuidv4 } from "uuid";
import { Record, String, Number, Date } from "runtypes";
import { authenticateUser } from "../auth/auth.js";
import DynamoDb from "cyclic-dynamodb";
import { Router } from "express";

// Initialize Express router
export const router = Router();

// Initialize AWS DynamoDB
const db = DynamoDb(process.env.CYCLIC_DB);
const participantsCollection = db.collection("participants");

// ------------------------------------
// GET ROUTES
// ------------------------------------

// Get all participants
router.get("/", async (req, res) => {
    const { results: participantsMetadata } = await participantsCollection.list();

    const participants = await Promise.all(
        participantsMetadata.map(async ({ key }) => (await participantsCollection.get(key)).props)
    );

    res.send(participants);
});

// Get participant by id
router.get("/:id", async (req, res) => {
    const participantId = req.params.id;

    try {
        const { props: participant } = await participantsCollection.get(participantId);
        res.send(participant);
    } catch (e) {
        console.log(e.message, `Participant with id ${participantId} does not exist.`);
        res.sendStatus(404);
    }
});

// ------------------------------------
// POST ROUTES
// ------------------------------------

// Type for new participant
const ParticipantData = Record({
    user: String,
    game: String,
    weightGoal: Number,
    vacationStart: Date,
    status: String,
    // weights: PlayerWeight[]
    // payments: Payment[]
});

// Post new participant
router.post("/", authenticateUser, async (req, res) => {
    const participantData = req.body;

    try {
        // Make sure participant data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure participant data contains all required fields
        const participantObject = ParticipantData.check(participantData);

        // Generate ID
        const participantId = uuidv4();

        // Create full participant object
        const participant = {
            ...participantObject,
            id: participantId
        };

        // Save participant object
        await participantsCollection.set(participantId, participant);

        res.send(participant);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(400);
    }
});

// ------------------------------------
// PUT ROUTES
// ------------------------------------

// Update entire participant
router.put("/:id", authenticateUser, async (req, res) => {
    const participantId = req.params.id;
    const participantData = req.body;

    try {
        // Make sure participant data exists
        if (!req.body) {
            throw new Error();
        }

        // Make sure participant has id
        if (!participantData.id) {
            throw new Error();
        }

        // Make sure the participant data has the same id as given in the path parameter
        if (participantId !== participantData.id) {
            throw new Error();
        }

        // Make sure participant data contains all required fields
        const participantObject = ParticipantData.check(participantData);

        // Delete existing participant object
        await participantsCollection.delete(participantId);

        // Save new participant object
        await participantsCollection.set(participantId, participantObject);

        res.send(participantObject);
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});

// ------------------------------------
// DELETE ROUTES
// ------------------------------------

// Delete participant if it exists
router.delete("/:id", authenticateUser, async (req, res) => {
    const participantId = req.params.id;

    try {
        await participantsCollection.delete(participantId);

        res.send({id: participantId});
    } catch (e) {
        console.log(e.message);
        res.sendStatus(404);
    }
});
