const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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

// Create or Update an item
app.post('/:col/:key', async (req, res) => {
  console.log(req.body)

  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).set(key, req.body)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Delete an item
app.delete('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} delete key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).delete(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a single item
app.get('/:col/:key', async (req, res) => {
  const col = req.params.col
  const key = req.params.key
  console.log(`from collection: ${col} get key: ${key} with params ${JSON.stringify(req.params)}`)
  const item = await db.collection(col).get(key)
  console.log(JSON.stringify(item, null, 2))
  res.json(item).end()
})

// Get a full listing
app.get('/:col', async (req, res) => {
  const col = req.params.col
  console.log(`list collection: ${col} with params: ${JSON.stringify(req.params)}`)
  const items = await db.collection(col).list()
  console.log(JSON.stringify(items, null, 2))
  res.json(items).end()
})

// Catch all handler for all other request.
app.use('*', (req, res) => {
  res.json({ msg: 'no route handler found' }).end()
})

var contactMail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
    user: 'hamza.nawabi119@gmail.com',
    // pass: 'tvkfkmfywdghpvat'
    pass:"kkmaxsjegmagwrmw"
    }
});
contactMail.verify((error)=>{
    if(error){
        console.log(error)
    }else{
        console.log("your message Send it")
    }
})
app.post("/",(req,res)=>{
    // res.send("post methode") 
    // var emailto =" hamza.nawabi119@gmail.com   "
    const name = req.body.name
    const email = req.body.email
    const subject = req.body.subject
    const message = req.body.message
    var emailto = "h.nawabi007@gmail.com"
    const mail = {
    from:"hamza.nawabi119@gmail.com",
    to:emailto,
    subject:"message Send From The online shop",
    html:`
    User_Name:<b>${name}</b><br/>
    User_Mail:<b>${email}</b><br/>
    Subject:<b>${subject}</b><br/>
    Message:<p>${message}</p><br/>
    `
    }
    contactMail.sendMail(mail,(error)=>{
    if(error){
        res.json(error)
    }else{
        res.json({message:"We Recieved Your Message"})
        // alert("Your Email Send it Successfuly...")
    }
    }); 
    })
// Start the server
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`index.js listening on ${port}`)
})
