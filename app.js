//jshint esversion:6
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const date = require(__dirname + "/date.js");
const _ = require('lodash');
const app = express();

app.use(bodyParser.urlencoded({
  extended: true

}));

const Port = 3000 || process.env.PORT;
//a folder which is available to public
app.use(express.static("public"));

//set the ejs as view engine to create a template
app.set('view engine', 'ejs');


//connect mongodb
mongoose.connect('mongodb+srv://admin:admin@cluster0.ccnzs.mongodb.net/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});


//schema
const itemsSchema = {
  name: {
    type: String,
    required: [true, " Please check your data entry, no name specified! "]
  }};

//model
const Item = mongoose.model("item", itemsSchema);

const item1 = new Item({
  name: "Welcome to your to-do List"
});

const item2 = new Item({
  name: "Hit the + button to aff a new item "
});

const item3 = new Item({
  name: "<-- Hit this to delete an item"
});

const defaultItems = [item1, item2, item3];

//list schema
const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);



//get request to server
app.get('/', function(req, res) {
  const day = date.getDate();
  //Select query
  Item.find({}, function(err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, err => {
        console.log("there is no errors");
      });
      res.redirect('/');
    } else {
      res.render("list", {
        listTitle: "Today",
        items: foundItems
      });

    }
  });
});


app.get('/:customListName', function(req, res) {
  const customListName = _.capitalize(req.params.customListName);
  console.log(customListName);

  List.findOne({name: customListName  }, function(err, foundList) {
    console.log(foundList);
    if(!err){
      if (!foundList) {
        //create new list
        console.log("I am here");
        const list = new List({
          name: customListName,
          items: defaultItems
        });
        list.save();
        console.log("here");
        res.redirect("/"+customListName);
      } else {
        //show an existing list
        res.render("list", {
          listTitle: foundList.name,
          items: foundList.items
        });
      }
    }
  });
});

//post request to server
app.post('/', function(req, res) {
  const item = req.body.newItem;
  const titleValue = req.body.list;
  console.log(req.body.list);
  const item4 = new Item({
    name: item
  });

  if (titleValue === "Today") {
    item4.save();
    res.redirect("/");
  } else {
    List.findOne({name: titleValue }, function(err, foundList) {
      foundList.items.push(item4);
      foundList.save();
      res.redirect("/" + titleValue);
    });
  }
});



app.get("/about", function(req, res) {
  res.render("about");
});



//post request to server
app.post('/delete', function(req, res) {
  const item = req.body.itemid;
  const listName = req.body.ListName;

  if (listName === "Today") {


    Item.deleteOne({
      _id: item
    }, err => {
      if (err) {
        console.log(err);
      } else {
        console.log(item);
      }
    });
    res.redirect("/");
  } else {

    List.findOneAndUpdate (
      {
        name: listName
      }, {
        $pull: {
          items: {
            _id: item
          }
        }
      },
      function(err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      });

}


});


app.listen(Port, function() {
  console.log("Listening to port 3000");
});
