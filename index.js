const express = require('express')
const app = express()
const db = require('@cyclic.sh/dynamodb')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))



// Get a single item
app.get('/',  (req, res) => {
  res.send({message:"Welcome Bor In This Project"})
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
