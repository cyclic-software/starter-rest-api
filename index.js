import { router as usersRouter } from "./src/user/router.js";
import { router as gamesRouter } from "./src/game/router.js";
import { router as participantsRouter } from "./src/participant/router.js";
import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", usersRouter);
app.use("/api/v1/game", gamesRouter);
app.use("/api/v1/participant", participantsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
