const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const { auth } = require('express-openid-connect');
//const passport = require('./config/passport');
const session = require('express-session');

const app = express();

const port = process.env.PORT || 3000;

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));

//app.use(passport.initialize());
//app.use(passport.session());

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: process.env.SECRET,
    baseURL: process.env.BASE_URL,
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.SECRET,
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    routes: {
        login: false,
        //logout: false
    },
    authorizationParams: {
        response_type: 'code',  // Использование кода авторизации
        scope: 'openid profile email'  // Запрашиваемый scope для получения id_token
    }
}

app.use(auth(config));

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

    console.log(`Request received for: ${req.path}`);

    next();
});
app.use('/', require('./routes'));

mongodb.initDb((err) => {
    if(err) {
        console.log(err);
    }
    else {
        app.listen(port, () => {console.log(`Running on port ${port}`)});
    }
});