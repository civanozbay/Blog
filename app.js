//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const username = process.env.USERNAME;
const password = process.env.PASSWORD;
mongoose.connect(
  "mongodb+srv://" +
    username +
    ":" +
    password +
    "@cluster0.yvrqpeb.mongodb.net/blogDB?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";
const data = [];

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const noteSchema = mongoose.Schema({
  title: String,
  content: String,
});

const Note = new mongoose.model("Note", noteSchema);

const testNote = new Note({
  title: "Test",
  content: "This is just for testingg!!!!!",
});
// testNote.save();

async function getNotes() {
  try {
    const notes = await Note.find({});
    return notes;
  } catch (err) {
    console.log(err);
  }
}

app.get("/", async (req, res) => {
  const notes = await getNotes();

  res.render("home.ejs", {
    homeContent: homeStartingContent,
    posts: notes,
  });
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs", { contactContent: contactContent });
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", (req, res) => {
  const title = req.body.postTitle;
  const content = req.body.postBody;
  const blog = new Note({
    title: title,
    content: content,
  });
  blog.save();
  res.redirect("/");
});

app.get("/posts/:postId", async (req, res) => {
  // const lowerTitle = _.lowerCase(req.params.postId);
  const lowerTitle = req.params.postId;
  console.log(lowerTitle);
  const notes = await getNotes();
  for (var title of notes) {
    const postId = title._id.toString();
    if (lowerTitle === postId) {
      res.render("post.ejs", { title: title.title, body: title.content });
    } else {
      console.log("not matcg");
    }
  }
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
