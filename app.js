const express = require('express'),
    expressLayouts = require('express-ejs-layouts'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    session = require('express-session'),
    logger = require("morgan"),
    app = express(),
    fs = require("fs"),
    path = require("path"),
    accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' }),
    LogAccess = require("./models/LogAccess")

require('./config/passport')(passport)

// DB Config
const db = require('./config/keys').mongoURI

// Connect to MongoDB
mongoose.set('debug', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.connect(db, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))


require("./models/User")
require("./models/Role")

app.enable("trust proxy")

// EJS
app.use(expressLayouts)
app.set('view engine', 'ejs')

// Express body parser
app.use(express.urlencoded({ extended: true }))


// Express session
app.use(
    session({
        secret: 'secret',
        resave: true,
        saveUninitialized: true
    })
)

// app.use(logger("dev"))
app.use(logger((tokens, req, res) => {
    const { user } = req,
        data = {
            ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
            method: tokens.method(req, res),
            url: tokens.url(req, res),
            status: tokens.status(req, res),
            responseTime: `${tokens['response-time'](req, res)}ms`,
            totalTime: `${tokens['total-time'](req, res)}ms`,
            userAgent: tokens['user-agent'](req, res),
            httpVersion: tokens['http-version'](req, res),
            remoteAddr: tokens['remote-addr'](req, res),
            remoteUser: tokens['remote-user'](req, res),
            date: tokens.date(req, res),
            user: user?._id
        }
    LogAccess.insertMany([data], (err, result) => {
    })
    const log = [
        data.ip,
        data.date,
        data.method,
        data.url,
        data.status,
        "HTTP/" + data.httpVersion,
        tokens.res(req, res, 'content-length'), '-',
        data.responseTime, 'ms',
        data.remoteAddr,
        data.remoteUser,
        data.userAgent
    ].join(' ')
    return log
}, {
    stream: accessLogStream
}))


// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global variables
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})

// Routes
app.use('/', require('./routes/index.js'))
app.use('/users', require('./routes/users.js'))

const PORT = process.env.PORT || 5000

app.listen(PORT, console.log(`Server started on port ${PORT}`))
