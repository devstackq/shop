const User = require('../models/user');
const jwt = require('jsonwebtoken'); // to generate signed tokne
const expressJwt = require('express-jwt'); // for auth check
const { errorHandler } = require("../helpers/dbErrorHandler");



exports.signup = async (req, res) => {
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists)
        return res.status(403).json({
            error: errorHandler(err)
        });
    const user = await new User(req.body);
    await user.save();
    res.status(200).json({ message: 'Signup success! Please login' });
};



//signin method
exports.signin = (req, res) => {
    //find the user  based on email
    const { email, password } = req.body; //bodyParser
    User.findOne({ email }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({
                error: "User with that email does not exist. Please signup"
            });
        }
        //if user is found make sure the email and password match
        //crate auth method in user models
        if (!user.authenticate(password)) {
            return res.status(401).json({
                error: "Email or password dont match"
            });
        }


        //generate a signed token with user id and secret key
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        //persist the token as 't'  in cookie with expire date
        res.cookie('t', token, { expire: new Date() + 9999 });
        //return response with user and token  to frontend clients

        const { _id, name, email, role } = user;
        return res.json({ token, user: { _id, email, name, role } });
    });
};

//signout
exports.signout = (req, res) => {
    res.clearCookie('t');
    res.json({ message: 'signout succes' });
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty: "auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if (!user) {
        return res.status(403).json({
            error: 'Access deniendd'
        });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if (req.profile.role === 0) {
        return res.status(403).json({
            error: 'Admin resource! access deniend'
        });
    }
    next();
};
