const mongoose = require('mongoose')

const SchemaModel = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    position: {
        type: Number,
        default: 1,
        unique: true,
        required: true
    }
}, {
    timestamps: true
})

module.exports = mongoose.model('Role', SchemaModel)
