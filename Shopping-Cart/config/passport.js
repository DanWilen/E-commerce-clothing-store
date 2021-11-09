const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.serializeUser(function(user,done)
{
    done(null,user.id); //define how to store user in session - storing user's id

});

passport.deserializeUser(function (id,done)
{
    User.findById(id,function(err,user)
    {
        done(err,user); //clear the session by user's id
    });
});

passport.use('local.signup',new LocalStrategy({  //signup\login strategy
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function (req,email,password,done)
{
    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty().isLength({min:4});//check password length
    const errors = req.validationErrors();
    if(errors)
    {
        let messages=[];
        errors.forEach(function(error)
        {
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error',messages));
    }
    User.findOne({'email':email}, function(err, user) //Search user in DB
    {
        if (err) 
        {
            console.log(err);
            return done(err); 
        }
        if (user) 
        {
            return done(null,false,{message:'Email is already in use.'}); 
        }
        let newUser=new User(); //Create a new user if not exists.
        newUser.email=email;
        newUser.password=newUser.encryptPassword(password);
        newUser.save(function(err,result)
        {
            if(err) return done(err);        
            return done(null,newUser);
        });
    });
}));


passport.use('local.signin',new LocalStrategy({  //Login
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
    function(req,email,password,done)
    {
        req.checkBody('email','Invalid email').notEmpty().isEmail();
        req.checkBody('password','Invalid password').notEmpty();//check password length
        const errors = req.validationErrors();
        if(errors)
        {
            let messages=[];
            errors.forEach(function(error)
            {
                messages.push(error.msg);
            });
            return done(null, false, req.flash('error',messages));
        }
        User.findOne({'email':email}, function(err, user) //Search user in DB
        {
            if (err) 
            {
                console.log(err);
                return done(err); 
            }
            if (!user) 
            {
                return done(null,false,{message:'No user found.'}); 
            }
            if(!user.validPassword(password))
            {
                return done(null,false,{message:'Wrong password!'}); 
            }
            return done(null,user)
        });
    }
));