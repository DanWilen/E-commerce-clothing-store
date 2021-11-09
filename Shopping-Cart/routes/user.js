const express = require('express');
const router = express.Router();
const csrf = require('csurf');
const passport = require('passport');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const csrfProtection = csrf(); //protection againt session hijacks
router.use(csrfProtection); //protect the routes

//Profile view route - show the profile per user session
router.get('/profile',isLoggedIn, function(req,res,next)
{

  if(req.user.email=='admin@admin.com')
  {//Admin user
    let errMsg=req.flash('error')[0];
    res.render('user/adminpage',{errMsg:errMsg, noError:!errMsg}); //pass products=docs to the view.
    
  }
  else
  {//Regular User
    //retrive data of user profile
  Order.find({user:req.user},function(err,orders){ // mongo's query to get all orders per user
    if(err){
        return res.write('Error!');
    }
    let cart;
    orders.forEach(function (order)
    {
      cart = new Cart(order.cart);
      order.items = cart.generateArray();
    });
    res.render('user/profile',{orders:orders});
  }).lean(); 
  }
  
});

//logout route - logout and clear session
router.get('/logout',isLoggedIn,function(req,res,next)
{
    req.logout();
    res.redirect('/');
});

//Index view - view without permissions - no need to login
router.use('/',notLoggedIn,function(req,res,next)
{
    next();
});

// Signup route - register user - Get Method
router.get('/signup', function(req, res, next)
{
  let messages = req.flash('error');
  res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0}); //return signup view + csrfToken
});

// Signup route - register user - Post Method
router.post('/signup',passport.authenticate('local.signup',{
  
  failureRedirect: '/user/signup', 
  failureFlash: true //sending the flash message "Email is already in use. (check the user.js model)
}), function(req, res, next){ // If we success to login we are moving to this call-back function
  if(req.session.oldUrl) // move to the oldUrl
  {
    let oldUrl = req.session.oldUrl;
    req.session.oldUrl=null;
    res.redirect(oldUrl);
    
  }
  else // case that there is no oldUrl
  {

    if(req.user.email=='admin@admin.com')
    {
      
      res.redirect('/user/adminpage');
    }
    else
    {
      res.redirect('/user/profile');
    }
  }
});

//Signin - login - Get Method
router.get('/signin',function(req,res,next)
{
  let messages = req.flash('error');
  res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors:messages.length>0}); //return signin view + csrfToken
});
//Signin - login - Post Method
router.post('/signin',passport.authenticate('local.signin',
{ 
  failureRedirect: '/user/signin', 
  failureFlash: true //sending the flash message "Email is already in use. (check the user.js model)
}), function(req, res, next){ // If we success to login we are moving to this call-back function
  if(req.session.oldUrl) // move to the oldUrl
  { 
    let oldUrl = req.session.oldUrl; //tempoprary to make sure we can clear the session oldURL safety.
    req.session.oldUrl=null;
    res.redirect(oldUrl);
  }
  else // case that there is no oldUrl
  {

    if(req.user.email=='admin@admin.com')
    {
      
      res.redirect('/user/adminpage');
    }
    else
    {
      res.redirect('/user/profile');
    }
    
  }
});



module.exports = router;

function isLoggedIn(req,res,next) //redirect if logged in or not
{
    if(req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/');
}


function notLoggedIn(req,res,next) //
{
    if(!req.isAuthenticated())
    {
        return next();
    }
    res.redirect('/');
}