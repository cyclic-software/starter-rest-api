const express = require("express");
const app = express();
const helmet = require("helmet");

const db = require("cyclic-dynamodb")

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded())

// #############################################################################
// This configures static hosting for files in /public that have the extensions
// listed in the array.
// var options = {
//   dotfiles: 'ignore',
//   etag: false,
//   extensions: ['htm', 'html','css','js','ico','jpg','jpeg','png','svg'],
//   index: ['index.html'],
//   maxAge: '1m',
//   redirect: false
// }
// app.use(express.static('public', options))
// #############################################################################

app.get('/:col', async (req,res) => {
  console.log(req.params)
  let items = await db.collection(req.params['col']).list()
  console.log(JSON.stringify(items,null,2))
  res.json(items)
})

// Catch all handler for all other request.
app.use('*', (req,res) => {
  res.json({"msg":"no route handler found"}).end()
})

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
