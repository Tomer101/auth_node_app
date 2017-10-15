var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require ('body-parser');
var LocalStrategy = require('passport-local');
var passportLocalMongoose = require('passport-local-mongoose');
var User = require('./models/user');

/*************MONGOOSE SETUP*************/
/*include mongoose in our project and open a 
connection to the 'nodekb' database on our locally running instance of MongoDB.*/
mongoose.connect("mongodb://localhost/auth_app", { useMongoClient: true });
/*let db = mongoose.connection;
//check for DB errors
db.on('error', function(err){
    console.log(err)
});
//check if there is a connection
db.once('open', function() {
  console.log('database connected...');
});*/
/****************************************/


/*********** INITIALIZE APP *************/
var app = express();
app.use(require("express-session")({
    secret: 'tomer tomer',
    resave:false,
    saveUninitialized: false
}));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extends:true}));
/*to use passport*/

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/********** R O U T E S ***********/

app.get('/', function(req, res){
    res.render('home');
});

app.get("/users_only", (req, res)=>{
    res.render("users_only");
});

//Register form
app.get('/register',(req, res)=>{
    res.render('register');
});

//user register form
app.post('/register',(req, res)=>{
    req.body.username
    req.body.password
    User.register(new User({username:req.body.username}), req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render('register');
        }
        passport.authenticate('local')(req,res,function(){
            res.redirect('/users_only');
        });
    });
})

//login route
app.get('/login', (req, res)=>{
    res.render('login');
});

//login POST route
//middleware
app.post('/login', passport.authenticate('local',{
    successRedirect:'/users_only',
    failureRedirect: '/login'
}) ,function(req, res){
});



app.listen(3000, function(){
    console.log('server is running on port 3000...');
});