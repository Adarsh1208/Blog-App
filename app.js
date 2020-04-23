var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    



// App Config
mongoose.connect("mongodb://localhost:27017/blogApp",
 {
    useNewUrlParser: true,
    useUnifiedTopology : true
})
app.set("view engine", "ejs")
app.use('/public',express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended:true}))

//creating schema and Model

var blogSchema = mongoose.Schema({
    title : String,
    image : String,
    body  : String,
    created : 
        {
            type : Date, 
            default : Date.now
        }
})


var Blog = mongoose.model("Blog", blogSchema)

//Routes

app.get("/", function(req, res){
    res.redirect("/blogs")
})

app.get("/blogs", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log(err)
        }else {
            res.render("index", {blogs : blogs})
        }
    }) 
})

  






app.listen(5000, function(){
    console.log("Blog App is Running")
})


