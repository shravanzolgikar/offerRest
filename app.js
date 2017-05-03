//========== Module Dependencies==============================
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var dbConfiguration = require('./app-config/databaseConfig');
var index = require('./routes/index');
var users = require('./routes/users');
var API = require('./routes/offer');
var errorHandlers = require('./handlers/err_handler');

//====================Connection to  Database====================
var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connect(dbConfiguration.GET_URL);

var app = express();

//==================== view engine setup==========================
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//===============configuration of routes============================
app.use('/', index);
app.use('/api', API);
app.use('/api', users);
//===============Error Handlers=====================================
app.use(function (req, res, next) {

    var err = new Error('Not Found');
    err.name = "NotFoundError";
    err.status = 404;
    next(err, req, res, next);

});

app.use(function (err, req, res, next) {

    errorHandlers.processError(err, function (status, response) {

        res.status(status).json(response);

    });
});

module.exports = app;

