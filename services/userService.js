//=====================Module Dependencies==============================
var User = require('../models/user');
var crypto = require('crypto');
var async = require('async');
var sendGridHandler = require('../app-config/sendGridMail');
var randomString = require('randomstring');
var SendGrid = require('sendgrid-nodejs').SendGrid;

//=====================Controllers Methods===============================
exports.addUser = function (req, cb) {

    var user = new User();
    user.userName = req.body.userName;
    user.password = req.body.password;
    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    // save and check for errors
    user.save(function (err) {
        return cb(err, user);
    });
};

exports.getUsers = function (req, cb) {

    User.find({isActive: true}).exec(function (err, user) {
        return cb(err, user);
    });
};

exports.login = function (req, cb) {

    var userName = req.body.userName;
    var password = req.body.password;

    User.findOne({userName: userName}, function (err, user) {
        if (err || !user) {
            return cb(err, user, null);
        }
        user.comparePassword(password, function (err, isMatch) {
            return cb(err, user, isMatch);
        });
    });

};

exports.forgotPassword = function (req, cb) {

    var userName = req.body.userName;

    User.findOne({userName: userName.toLowerCase(), isActive: true}, function (err, user) {
        if (err || !user) {
            return cb(err, user, null);
        } else {
            async.waterfall([
                function (done) {
                    var token = randomString.generate(20);
                    done(err, token);
                },
                function (token, done) {
                    var sendMail = new SendGrid(sendGridHandler.Get_UserName, sendGridHandler.Get_Password);
                    sendMail.send({
                        to: userName,
                        from: sendGridHandler.From_Address,
                        subject: sendGridHandler.Subject,
                        text: sendGridHandler.Text + '\n\n' + 'http://' + req.headers.host + '/api/changePassword/' + token
                    }, function (sendData) {

                        //res.json({error: false, message: messages.SEND_MAIL, description: '', data: {}});

                    });
                    user.pwdToken = token;
                    user.tokenExpiryDate = Date.now() + 3600000; //1 hour

                    User.create(user, function (err, data) {

                        return cb(err, user, data);
                    });
                }
            ]);
        }

    });
};