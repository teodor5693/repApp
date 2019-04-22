var     bodyParser       = require("body-parser"),
        expressSanitizer = require("express-sanitizer"),
        methodOverride   = require("method-override"),
        mongoose         = require("mongoose"),
        express          = require("express"),
        app              = express();
        
mongoose.connect("mongodb://localhost/repApp", {useNewUrlParser: true});
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(expressSanitizer());
app.use(methodOverride("_method"));

// MONGOOSE/MODEL CONFIG
var blogSchema = new mongoose.Schema({
    body:  String,
    created: {type: Date, default: Date.now}
});

var Blog = mongoose.model("Blog", blogSchema);

//ROUTES
app.get("/", function(req, res){
    res.redirect("/home")
})

//HOME ROUTE
app.get("/home", function(req, res){
    Blog.find({}, function(err, blogs){
        if(err){
            console.log("ERROR!");
        } else {
            res.render("index", {blogs: blogs});
        }
    });
});

//DONE ROUTE
app.get("/done", function(req, res){
    res.render("done");
});

//POST ROUTE
app.post("/done", function(req, res){
    //create blog
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.create(req.body.blog, function(err, newBlog){
        if(err){
            res.render("/home");
        }else {
            //redirect to the index page
            res.redirect("/done");
        }
    });
});


app.listen(3000, function(){
    console.log("Server has started!");
});