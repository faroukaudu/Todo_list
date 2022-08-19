//ROOT Dir for TODO lIst

//Modules Included
const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js");

//Initialize Express to app
const app = express();

//Body parser for Form Post Decoders
app.use(bodyParser.urlencoded({extended:true}));

//Public folder for reading Asset files
app.use(express.static("public"));

//EJS Engine
app.set("view engine", "ejs");

//Array for Food and Work respective of the pafe dir.
let foodArray = ["rice", "beans"];
let workArray = [];

//Post for data inputs
app.post("/", function(req, res){
  let item = req.body.additem;

  if(req.body.list === "Work"){
    workArray.push(item);
    res.redirect("/work");
  }else{
    foodArray.push(item);
    res.redirect("/");
  }

})

//Root Dir fUNCTION
app.get("/", function(req, res){

  res.render("list", {
    topTitle:date.getDate(),
    newMeal:foodArray,
  })

})


//Work Dir function
app.get("/work", function(req, res){
  res.render("list", {
    topTitle: "Work list",
    newMeal: workArray,
})
})

app.post("/work", function(req, res){

})


//About page Sample
app.get("/about", function(req, res){
  res.render("about")
})


// Listening from Port 3000
// if you want to run on life server use:
//app.listen(process.env.PORT || 3000, functio......)
app.listen(3000, function(){
  console.log("listening from port 3000...");
})
