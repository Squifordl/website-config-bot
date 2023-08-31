const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GuildSchema = new Schema({
    idS: {
        type: String
    },
    prefix: {
        type: String,
        default: "ss"
    },
    vip: [
        {
            id: {
                type: String,
            }
        }
    ]
})

module.exports = mongoose.model('GuildTeste', GuildSchema);