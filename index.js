const express = require('express');
const app = express();
const mongoose = require('mongoose')
const port = 6969;
const cors = require('cors')

app.use(express.json());
app.use(cors());
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  } ,
  name: {
    type: String,
    required: true,
  } 

});
mongoose.connect('mongodb+srv://portfolio:portfolio@database.e5iix52.mongodb.net/?retryWrites=true&w=majority&appName=database').then(console.log('connected'))

app.post("/api/messages", async (req, res) => {
  const message = req.body;
  const newMessage = new UserSchema(message);
  await newMessage.save();
  res.json(message);
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
})
