const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override")

const Chat = require("./models/chat.js")

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// to attach public Folder or use
app.use(express.static(path.join(__dirname, "public")));

// To parse data of req.body like from, to, msg
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));


main()
  .then(() => {
    console.log("Connection Successful");
  })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// Index Route
app.get('/chats', async (req, res) => {
  let chats = await Chat.find();
  //console.log(chats);
  res.render("index", { chats })
})

// New Route
app.get('/chats/new', (req, res) => {
  res.render('new')
})

// Create Route
app.post("/chats", (req, res) => {
  let { from, to, msg } = req.body; // data
  let newChat = new Chat({
    from: from,
    to: to,
    msg: msg,
    created_at: new Date(),
  })

  newChat
    .save()
    .then(res => { console.log("Chat Saved") })
    .catch((err) => {
      console.log(err);
    })

  res.redirect('/chats');
});

// Edit Route
app.get("/chats/:id/edit", async (req, res) => {
  let {id} =  req.params;
  let chat = await Chat.findById(id);
  res.render("edit", {chat});
})

// Update Route
app.put("/chats/:id", async (req, res) => {
  let { id } =  req.params;
  let { msg: newMsg } = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(
    id,
    { msg: newMsg },
    { runValidators: true, new: true }
  );

  res.redirect("/chats")
})

// Destroy Route
app.delete("/chats/:id", async (req, res)=> {
  let {id} = req.params;
  let deletedChat = await Chat.findByIdAndDelete(id);
  //console.log(deletedChat);
  res.redirect("/chats")
})



app.get("/", (req, res) => {
  res.send("Root Working");
});

app.listen(8080, () => {
  console.log("Server Listening", 8080);
});