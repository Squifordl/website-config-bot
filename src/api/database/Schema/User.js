const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    idS: {
        type: String,
    },
    idU: {
        type: String,
    },
    acesstoken: {
        type: String,
        default: "null"
    },
    vip: {
        id: {
            type: String,
            default: "null"
        },
        expires: {
            type: Date,
            default: 0
        },
        status: {
            type: Boolean,
            default: false
        },
        user: {
            role: {
                type: String,
                default: "null"
            },
            channel: {
                type: String,
                default: "null"
            },
        }
    }
})

module.exports = mongoose.model('UserTeste', UserSchema);