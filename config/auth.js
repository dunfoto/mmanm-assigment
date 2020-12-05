const User = require("../models/User")

module.exports = {
    ensureAuthenticated: function (req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error_msg', 'Please log in to view that resource')
        res.redirect('/users/login')
    },
    forwardAuthenticated: function (req, res, next) {
        if (!req.isAuthenticated()) {
            return next()
        }
        res.redirect('/dashboard')
    },
    authorization: (role) => (req, res, next) => {
        // && Boolean(req.user.roles.find(item => item.code === role))
        if (req.isAuthenticated()) {
            return next()
        }
        res.status(401).json({ data: null, errors: "Unauthorization!" })
    }
}
