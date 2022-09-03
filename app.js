//ROOT Dir for TODO lIst

//Modules Included
const express = require("express")
const bodyParser = require("body-parser")
const date = require(__dirname + "/date.js");
const mongoose = require('mongoose');
var _ = require('lodash');

//Initialize Express to app
const app = express();

//Body parser for Form Post Decoders
app.use(bodyParser.urlencoded({extended:true}));

//Public folder for reading Asset files
app.use(express.static("public"));

//EJS Engine
app.set("view engine", "ejs");

//Array for Food and Work respective of the pafe dir.
mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

const itemSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  }
});

const Item = mongoose.model("Item",itemSchema);
// const foodArray = [];
// const item1 = Item({
//   item:"Welcome to the todoList"
// });
//
// const item2 = Item({
//   item:"Hit the '+' button to add item"
// });
//
// const item3 = Item({
//   item:"<-- hit this to delete"
// });
//
// const defaultItems = [item1, item2, item3];

const defaultItems = [
  {item:"Welcome to the todoList"},
  {item:"Hit the '+' button to add item"},
  {item:"<-- hit this to delete"},
];

const dynList = mongoose.Schema({
  name:{
  type:String,
  unique:true,
},
  item: [itemSchema]
});
const DynamicList = mongoose.model("dynamic",dynList);

//Post for data inputs
app.post("/", function(req, res){

  const item = req.body.additem;
  const listname = req.body.list;
  console.log("LIST NAME!!!!");
console.log(listname);
  console.log("LIST NAME!!!!");

  const itemNew = Item({
    item: item,
  });
    console.log(item);
  if(listname === "Today"){
    itemNew.save();
    res.redirect("/");

    // DynamicList.findOne({name:listname}, function(err, doc){
    //   doc.item.push(item);
    //   doc.save();
    //   res.redirect("/"+listname);
    // });



  }else{
    console.log("dif");


    DynamicList.findOne({name:listname}, function(err, doc){
      if (doc.length !== 0){
        console.log(doc);
        doc.item.push({item:item});
        doc.save();
        res.redirect("/" + listname);



      }

      // doc.item.push(item);
      // doc.save();
      //res.redirect("/" + listname);
    })

  }



  //res.redirect("/");
  // if(req.body.list === "Work"){
  //   workArray.push(item);
  //   res.redirect("/work");
  // }else{
  //   // foodArray.push(item);
  //
  // }

})

//Root Dir fUNCTION
app.get("/", function(req, res){
  Item.find(function(err, dbItems){
    if(err){
      console.log(err);
    }else if(dbItems.length ===0){
      Item.insertMany(defaultItems, function(err){
        if(err){
          console.log(err);
        }else{
          res.redirect("/");
        }
      });

    }else{
      res.render("list", {
        topTitle:"Today",
        newMeal:dbItems,
      })
    }
  })



})

app.post("/delete", function(req, res){
  const pageTitle = req.body.listTitle;
  const itemToDel = req.body.checkId;
  //console.log(itemToDel);
  console.log(itemToDel);

  if(pageTitle === "Today"){
    Item.findByIdAndRemove(itemToDel, function(err){
      if(err){
        console.log(err);
      }else{
        console.log("Deleted Successfully");
      }
    });
    res.redirect("/");
  }else{
    DynamicList.findOneAndUpdate({name:pageTitle},
      {$pull: {item: {_id: itemToDel }}},

      function(err, result){
        if(err){
          console.log(err);
        }else{
          res.redirect("/"+pageTitle);
        }

    });


  //   DynamicList.updateOne({ name:pageTitle }, {
  //   $pullAll: {
  //       item: [{_id: itemToDel}],
  //
  // }
  // })
  //   res.redirect("/"+itemToDel);
  }



});




//Dynamic Link Dir function
app.get("/:link", function(req, res){
  const newLink = _.capitalize(req.params.link);
  //console.log(req.params.link);

  DynamicList.findOne({name:newLink},function(err, doc){
    if(!err){
      console.log("working");

      if(!doc){
        console.log("Adding new Items");
        const newList = DynamicList({
          name:newLink,
          item:defaultItems,
        });
        newList.save();
        res.redirect("/"+newLink);
      }else{
        //console.log(doc.name);
        res.render("list", {topTitle:newLink,
                              newMeal:doc.item});
      }

    }
  });
//   res.render("list", {
//     topTitle: newLink,
//     newMeal: [],
// });
});




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
