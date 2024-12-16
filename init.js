const mongoose = require("mongoose");
const Chat = require("./models/chat.js");

main()
    .then(() => {
        console.log("Connection Successful");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChats = [
    {
        from: "Pratyush",
        to: "Rohan",
        msg: "Can you provide the lecture notes?",
        created_at: new Date(),
    },
    {
        from: "Saket",
        to: "Aman",
        msg: "Could you share the updated syllabus?",
        created_at: new Date(),
    },
    {
        from: "Ram",
        to: "Shyam",
        msg: "I need the study materials for the exam",
        created_at: new Date(),
    },
    {
        from: "Radhika",
        to: "Sita",
        msg: "Please send me the exam preparation guide",
        created_at: new Date(),
    },
    {
        from: "Tom",
        to: "Jerry",
        msg: "Can you send the assignments for review?",
        created_at: new Date(),
    },
]

Chat.insertMany(allChats);


