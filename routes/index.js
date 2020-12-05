const express = require('express'),
    router = express.Router(),
    { ensureAuthenticated, forwardAuthenticated, authorization } = require('../config/auth'),
    User = require("../models/User"),
    LogAccess = require("../models/LogAccess"),
    Role = require("../models/Role")

// Welcome Page
router.get('/', forwardAuthenticated, (req, res) => res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated, async (req, res) => {
    const { query } = req, users = await User.find({}).populate("role").sort({ createdAt: -1 }),
        logAccesses = await LogAccess.find({ user: req.user._id }).sort({ createdAt: -1 }),
        allLogAccesses = await LogAccess.find({}).populate("user").sort({ createdAt: -1 }),
        roles = await Role.find({}).sort({ createdAt: -1 })
    res.render('dashboard', {
        url: req.url,
        user: req.user,
        users,
        logAccesses,
        roles,
        allLog: allLogAccesses
    })
})


router.get('/log-all', ensureAuthenticated, async (req, res) => {
    const { query } = req,
        allLogAccesses = await LogAccess.find({}).populate("user").sort({ createdAt: -1 }),
        roles = await Role.find({}).sort({ createdAt: -1 })
    res.render('logAll', {
        url: req.url,
        user: req.user,
        roles,
        allLog: allLogAccesses
    })
})

router.get('/current-log', ensureAuthenticated, async (req, res) => {
    const { query } = req,
        logAccesses = await LogAccess.find({ user: req.user._id }).sort({ createdAt: -1 })
    res.render('currentLog', {
        url: req.url,
        user: req.user,
        logAccesses,
    })
})


router.get("/user/:id", ensureAuthenticated, async (req, res) => {
    const { params: { id } } = req,
        detailUser = await User.findById(id),
        roles = await Role.find({})
    res.render("detailUser", {
        detailUser,
        user: req.user,
        roles
    })
})

router.get("/about", (req, res) =>
    res.render('demo')
)

router.get("/demo/api", (req, res) => {
    console.log(req.headers['x-forwarded-for'] || req.connection.remoteAddress)
    res.status(200).json("Okay fine")
})


router.post("/user/:id", ensureAuthenticated, async (req, res) => {
    const { params: { id }, body } = req
    await User.update({ _id: id }, body)
    res.redirect('/dashboard')
})

module.exports = router
