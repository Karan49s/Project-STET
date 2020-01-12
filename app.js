var express       = require("express");
    app           = express();
    mongoose      = require("mongoose");
    passport      = require("passport");
    LocalStrategy = require("passport-local");
    bodyParser    = require("body-parser");
    User = require("./models/user");

mongoose.connect("mongodb://localhost:27017/stet",{useNewUrlParser:true});

app.use(bodyParser.urlencoded({extended:true}));

app.set("view engine","ejs");
app.use(require("express-session")({
    secret: "devansh",
    resave: false,
    saveUninitialized: false
}));

passport.use(new LocalStrategy(User.authenticate()));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//used to add to all routes
app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    next();
});
app.get("/",function(req,res){
    res.render("landing");
});

app.get("/index",function(req,res){
    res.render("index");
});
app.get("/register",function(req,res){
    res.render("register");
});

app.get("/apply",isLoggedIn,function(req,res){
    res.render("apply");
});

app.post("/register",function(req,res){
    // req.body.username
    // req.body.password
    var newUser=new User({username:req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function() {
            res.redirect("/index");
        });
    });
});
//log in routes
app.get("/login",function(req,res){
    res.render("login");
});
app.post("/login",passport.authenticate("local",{
        successRedirect:"/index",
        failureRedirect:"/login"
}),function(req, res){

});

function isLoggedIn(req,res,next){
    if(req.isAuthenticated())
    return next();
    else
    res.redirect("/login");
    }

    //logout
app.get("/logout",function(req,res){
    req.logOut();
    res.redirect("/index");
});


app.listen(5500,function(){
    console.log("STET Started");
});