var express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    methodOverride = require('method-override'),
    expressSanitizer = require("express-sanitizer");


// App Config
mongoose.connect("mongodb://localhost/blogApp",
 {
    useNewUrlParser: true,
    useUnifiedTopology : true
},(err)=>{
    if(!err){
        console.log('database connected');
    }
})
app.set("view engine", "ejs")
app.use('/public',express.static(__dirname + "/public"))
app.use(bodyParser.urlencoded({extended:true}))
app.use(expressSanitizer())
app.use(methodOverride("_method"))
mongoose.set('useFindAndModify', false);

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


//New Route
app.get("/blogs/new", function(req, res){
    res.render("New")
})

//Show route

app.get("/blogs/:id", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }else {
            res.render("show", {blog : foundBlog})
        }
    })
})


//Creating route

app.post("/blogs", function(req, res){

    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.create(req.body.blog, function(err, newlyBlog){
        if(err){
            res.render("new")
        }else {
            res.redirect("/blogs")
        }
    })
})
  

//edit route

app.get("/blogs/:id/edit", function(req, res){
    Blog.findById(req.params.id, function(err, foundBlog){
        if(err){
            res.redirect("/blogs")
        }else {
            res.render("edit", {blog : foundBlog})
        }
    })
})

//update route

app.put("/blogs/:id", function(req, res){

    req.body.blog.body = req.sanitize(req.body.blog.body)
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
        if(err){
            res.redirect("/blogs")
        }else {
            res.redirect("/blogs/"+ req.params.id)
        }
    })
})

//Destroy Route

app.delete("/blogs/:id", function(req, res){
    Blog.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/blogs")
        }else{
            res.redirect("/blogs")
        }
    }) 
})


app.listen(5000, function(){
    console.log("Blog App is Running")
})


