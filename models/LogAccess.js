const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
    ip: String,
    method: {
        type: String,
        enum: ["POST", "GET", "PUT", "DELETE"]
    },
    url: String,
    status: String,
    responseTime: String,
    totalTime: String,
    userAgent: String,
    httpVersion: String,
    remoteAddr: String,
    remoteUser: String,
    date: String,
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('LogAccess', UserSchema)
