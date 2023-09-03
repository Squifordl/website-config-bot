const { Client, GatewayIntentBits, Partials } = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
    ],
    partials: [
        Partials.GuildMember,
        Partials.User,
        Partials.Channel,
        Partials.Message
    ],
    allowedMentions: {
        parse: ["users", "roles"],
        repliedUser: true
    },
    presence: {
        status: "online",
        activities: [{ name: "squiford.xyz", type: "WATCHING" }]
    },
    shards: "auto"
});

client.login(process.env.TOKEN);
client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

module.exports = client;