//========== Module Dependencies==============================
var express = require('express');
var router = express.Router();
var userService = require('../services/userService');
var message = require('../handlers/msg_handler');

router

    .get('/users', function (req, res, next) {

        userService.getUsers(req, function (err, result) {

            if (err) {
                next(err, req, res, next);
            } else {
                var response = (result && result.length > 0) ? {
                    error: false,
                    message: message.GET_ALL_RECORDS,
                    description: [],
                    data: result
                } : {error: true, message: message.RECORD_ERROR, description: [message.NO_RECORD], data: []};
            }
            res.json(response);
        });
    })

    .post('/userLogin', function (req, res, next) {
        userService.login(req, function (err, userResult, matchResult) {
            if (err) {
                next(err, req, res, next);
            } else {
                if (!userResult) {
                    res.json({
                        error: true,
                        message: message.RECORD_ERROR,
                        description: [message.NO_RECORD],
                        data: {}
                    });
                } else {
                    if (!matchResult) {
                        res.json({error: true, message: message.WRONG_PASSWORD, description: [], data: {}});
                    } else {
                        res.json({error: false, message: message.CORRECT_PASSWORD, description: [], data: userResult});
                    }
                }
            }
        });

    })

    .post('/forgotPassword',function (req,res,next) {
      userService.forgotPassword(req,function (err,userResult,mailResult) {
         if(err){
             next(err,req,res,next);
         } else{
             if(!userResult){
                 res.json({
                     error: true,
                     message: message.RECORD_ERROR,
                     description: [message.NO_RECORD],
                     data: {}
                 });
             }else{
                 if (mailResult && !userResult.pwdToken.isNullOrUndefined) {
                     res.json({error: false, message: message.SEND_MAIL, description: [], data: userResult});
                 }
                 else {
                     next(err, req, res, next);
                 }
             }
         }
      });
    })

    .post('/addUser', function (req, res, next) {
        userService.addUser(req, function (err, result) {
            if (err) {
                next(err, req, res, next);
            }
            else {
                res.json({
                    error: false,
                    message: message.RECORD_CREATED,
                    description: [],
                    data: result
                });
            }
        });
    });

module.exports = router;
