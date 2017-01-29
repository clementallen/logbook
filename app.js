import path from 'path';
import morgan from 'morgan';
import express from 'express';
import bluebird from 'bluebird';
import mongoose from 'mongoose';
import passport from 'passport';
import flash from 'connect-flash';
import favicon from 'serve-favicon';
import session from 'express-session';
import exphbs from 'express-handlebars';
import cookieParser from 'cookie-parser';
import connectMongo from 'connect-mongo/es5';
import { json, urlencoded } from 'body-parser';

import config from './config/config';
import initPassport from './modules/passport';

// Authentication routes
import signinRoute from './routes/signin';
import signoutRoute from './routes/signout';
import registerRoute from './routes/register';

// General routes
import api from './routes/api';
import account from './routes/account';
import indexRoute from './routes/index';
import uploadRoute from './routes/upload';

// Init the express app
const app = express();

initPassport(passport);

const MongoStore = connectMongo(session);

mongoose.Promise = bluebird;
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

app.use(morgan('common'));
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')));
app.use(json({
    limit: '10mb'
}));
app.use(urlencoded({
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
        maxAge: 2629746000 // one month in millis
    },
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// General routes
app.use('/api', api);
app.use('/account', account);
indexRoute(app);
uploadRoute(app);

// Authentication routes
signinRoute(app, passport);
signoutRoute(app, passport);
if (config.flagpole.registerEnabled) {
    registerRoute(app, passport);
}

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
