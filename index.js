const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

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
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

// Index Route
app.get('/chats', async (req, res) => {
  try {
    let chats = await Chat.find();
    //console.log(chats);
    res.render("index", { chats })
  } catch (err) {
    next(err);
  }
});



// New Route
app.get('/chats/new', (req, res) => {
  // throw new ExpressError(404, "Page not found")
  res.render('new')
})

// Create Route
app.post("/chats", async (req, res, next) => {
  try {
    let { from, to, msg } = req.body; // data
    let newChat = new Chat({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
    });

    await newChat.save();
    res.redirect('/chats');
  } catch (err){
    next(err)
  }
});

// WrapAsync Function
function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch((err) => next(err));
  };
}

// New - Show Route for Asychronous error handle ex
app.get("/chats/:id", asyncWrap ( async (req, res, next) => {
    let {id} = req.params;
    let chat = await Chat.findById(id);
    if(!chat) { // id not match error handling
      next(new ExpressError(500, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
}));




// Edit Route
app.get("/chats/:id/edit", async (req, res, next) => {
  try {
    let {id} =  req.params;
    let chat = await Chat.findById(id);
    res.render("edit", {chat});
  } catch (err){
    next(err);
  }
});

// Update Route
app.put("/chats/:id", async (req, res) => {
  try {
    let { id } =  req.params;
    let { msg: newMsg } = req.body;
    let updatedChat = await Chat.findByIdAndUpdate(
      id,
      { msg: newMsg },
      { runValidators: true, new: true }
    );
  
    res.redirect("/chats")
  } catch (err) {
    next(err);
  }

})

// Destroy Route
app.delete("/chats/:id", async (req, res, next)=> {
  try {
    let {id} = req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    //console.log(deletedChat);
    res.redirect("/chats")
  } catch (err){
    next(err);
  }
});


app.get("/", (req, res) => {
  res.send("Root Working");
});


// Validation error function
const handleValidationError = (err) => {
  console.log("This was a Validation Error, Follow Schema rules");
  console.dir(err.message);
  return err;
}

// Mongoose Error handler
app.use((err, req, res, next) => {
  if(err.name === "ValidationError") {
   err = handleValidationError(err)
  };
  next(err);
})


// Error Handling Middleware Error Handler of next()**
app.use((err, req, res, next)=> {
  let {status = 500, message = "some error occur"} = err;
  res.status(status).send(message);
})


app.listen(8080, () => {
  console.log("Server Listening", 8080);
});