const path = require('path');
const morgan = require('morgan');
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const flash = require('connect-flash');
const favicon = require('serve-favicon');
const bodyParser = require('body-parser');
const session = require('express-session');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo/es5')(session);

const index = require('./routes/index');
const account = require('./routes/account');
const upload = require('./routes/upload');
const api = require('./routes/api');

require('./config/passport')(passport);
const config = require('./config/config');

// Init the express app
const app = express();

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/logbook');

app.locals = {
    flagpole: config.flagpole
};

// view engine setup
const hbs = exphbs.create({
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
        maxAge: 2629746000 // one hour in millis
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
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
        layout: null,
        message: err.message,
        error: err
    });
});

module.exports = app;
