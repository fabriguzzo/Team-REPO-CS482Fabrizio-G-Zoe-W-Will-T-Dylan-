const express = require('express'); //import express server
const morgan = require('morgan'); //import morgan for logging
const session = require('express-session'); // generic session handling for express
const cors = require('cors'); // to avoid cors errors with react
const memorystore = require('memorystore')(session);

const app = express(); //creates a new Express Application
app.use(morgan('dev')); //For better logging, we use morgan
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cors());

app.use(session({
    secret: 'Pineapple - Guava - Orange',
    cookie: {maxAge: 86400000 }, // = 1000*60*60*24 = 24Hours
    store: new memorystore({ checkPeriod:86400000 }),
    resave: false,
    saveUninitialized: true
}));

//app.use(express.static('view/build'));// Static server for react components
app.use(express.static('public_html'));// Static server use the folder 'public_html'

// User Actions
const UserCont = require("./controller/UserController");
app.post('/user',UserCont.postCreateOrUpdate); // register new user
app.get('/user',UserCont.getAll);
app.post('/loginuser',UserCont.login); // login user
app.get('/loggeduser',UserCont.loggedUser); //fetches logged user (or null)
app.get('/logout',UserCont.logout); 
app.get('/deluser/:id',UserCont.deleteOne); //deletes user 

// Contact Actions
const ContactCont = require("./controller/ContactController");
app.get('/contact', ContactCont.getAllContacts);
app.post('/newcontact', ContactCont.createNewContact);


// Example Actions
//app.get('/example', exCont.getAll);

exports.app = app;