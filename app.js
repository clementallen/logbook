var path = require('path');
var morgan = require('morgan');
var express = require('express');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var favicon = require('serve-favicon');
var bodyParser = require('body-parser');
var session = require('express-session');
var exphbs = require('express-handlebars');
var cookieParser = require('cookie-parser');
var MongoStore = require('connect-mongo/es5')(session);

var index = require('./routes/index');
var account = require('./routes/account');
var upload = require('./routes/upload');
var api = require('./routes/api');

require('./config/passport')(passport);
var config = require('./config/config');

// Init the express app
var app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/logbook');

// view engine setup
var hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main'
});
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(morgan('dev'));
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(bodyParser.json({
    limit: '10mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '10mb'
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: config.auth.secret,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge : 2629746000 // one hour in millis
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Use the routes
app.use('/', index);

require('./routes/signin')(app, passport);
require('./routes/register')(app, passport);
require('./routes/signout')(app, passport);

app.use('/account', account);
app.use('/upload', upload);
app.use('/api', api);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        layout: null,
        message: err.message,
        error: err
    });
});

module.exports = app;
