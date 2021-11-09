const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const Order =require('../models/order');
const { v4: uuid_v4 } = require('uuid');


/* GET home page. */

//Index Route + Logics
router.get('/', function(req, res, next) {
  let successMsg = req.flash('success')[0]; //fetching from the CartCreate success element
  if(req.query.search){
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    Product.find({title: regex}, function (err, docs)
    {
      let productChunks=[];
      let chunkSize=3; //slicing 3 elements in row for each iteration
      for (let i=0;i<docs.length; i+=chunkSize)
      {
        const json_objs = docs.slice(i,i+chunkSize);
        productChunks.push(json_objs);
      }
      res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages:!successMsg}); //pass products=docs to the view.
    }).lean(); //get all products from MongoDB
  } else {
    Product.find({}, function (err, docs)
    {
      let productChunks=[];
      let chunkSize=3; //slicing 3 elements in row for each iteration
      for (let i=0;i<docs.length; i+=chunkSize)
      {
        const json_objs = docs.slice(i,i+chunkSize);
        productChunks.push(json_objs);
      }
      res.render('shop/index', { title: 'Shopping Cart', products: productChunks, successMsg: successMsg, noMessages:!successMsg}); //pass products=docs to the view.
    }).lean(); //get all products from MongoDB
  }
});

router.get('/', function (req,res) {
  document.getElementById("clean_btn").addEventListener("click", function (){
    res.redirect('/')
  })
});

//Add items to cart
router.get('/addToCart/:id', function (req, res, next)
{
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {items:{}}); //check is cart is exist in session, else send an empty cart -> {}
  Product.findById(productId,function(err,product)
  {
    if(err)
    {
      return res.redirect('/');
    }
    cart.add(product, product.id); //add product to cart
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');
  });
});

//Readme to reduce items from shopcart
router.get('/reduce/:id', function(req, res, next){
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {items:{}}); //check is cart is exist in session, else send an empty cart -> {}
  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});


//Remove items from shop-cart
router.get('/remove/:id', function(req, res, next){
  let productId = req.params.id;
  let cart = new Cart(req.session.cart ? req.session.cart : {items:{}}); //check is cart is exist in session, else send an empty cart -> {}
  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopping-cart');
});

//Shopping-cart Route show the cart
router.get('/shopping-cart', function(req, res, next)
{
  if(!req.session.cart){
    return res.render('shop/shopping-cart',{products:null}); //check if cart exist
  }
  let cart = new Cart (req.session.cart);//If there is a cart
  res.render('shop/shopping-cart', {products:cart.generateArray(),totalPrice:cart.totalPrice}); //pass the products and the total price to view
});


//About Route
router.get('/about', function(req, res, next)
{
  res.render('./about');
});

//Readme Route
router.get('/readme', function(req, res, next)
{
  res.render('./readme');
});

//Checkout the cart items with Visa Card or MasterCard - Get Method
router.get('/checkout',isLoggedIn,function(req, res, next)
{
  if(!req.session.cart){ //check if cart exist
    return res.redirect('/shopping-cart'); //if not redirect to shopping cart
  }
  let cart = new Cart (req.session.cart);//If there is a cart
  let errMsg=req.flash('error')[0];

  res.render('shop/checkout',{total: cart.totalPrice, errMsg:errMsg, noError:!errMsg});//pass the total price of the cart per session
   
});

//Checkout the cart items with Visa Card or MasterCard - Post Method
router.post('/checkout',isLoggedIn,function(req, res, next)
{
  let cart = new Cart(req.session.cart);
  let uuid = uuid_v4().toString();
  //Mark these operations if usering a payment platform
  let order = new Order({//Must be login to some account
    user: req.user, //fetch the user from the request
    cart: cart,
    address: req.body.address,
    name: req.body.name,
    paymentId: uuid
  });
  console.log(order);
  req.session.cart=null;
  order.save(function (err,result){
  //If using stripe mark these 2 lines as comment:
  req.flash('success','Successfully bought product!'); //storing 1 element
  return res.redirect('/');
  });
});

//Add Product - Admin only use
router.post('/addProduct',isLoggedIn,function(req, res, next)
{
  if(req.user.email=='admin@admin.com')
    {//Admin user
      let product = new Product({
        imagePath: req.body.imageUrlPath,
        title: req.body.productName,
        description: req.body.description,
        price: req.body.price
      });
      console.log(product);
      //req.session.product=null;
      product.save(function (err,result){
      //If using stripe mark these 2 lines as comment:
      req.flash('success','Successfully adding product!'); //storing 1 element
      return res.redirect('/');
      });
    }
});

module.exports = router;


function isLoggedIn(req,res,next) //redirect if logged in or not
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.session.oldUrl = req.url;
    res.redirect('/user/signin');
}

function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}