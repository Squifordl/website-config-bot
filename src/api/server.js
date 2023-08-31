const express = require('express');
const cors = require('cors');
const connectDB = require('./database/index.js');
const path = require('path');
const { request } = require("undici");
const UserTeste = require("./database/Schema/User.js");
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const rateLimit = require('axios-rate-limit');
const http = rateLimit(axios.create(), { maxRequests: 2, perMilliseconds: 1000, maxRPS: 2 })
const { Client, GatewayIntentBits, Partials } = require("discord.js");
const Guild = require('./database/Schema/Guild.js');
const { createClient } = require('ioredis');

const redisClient = createClient({
    password: process.env.REDIS_PASSWORD,
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.on("connect", function () {
    console.log("Conectado ao Redis");
});

redisClient.on("error", function (error) {
    console.error("Erro ao conectar com Redis: ", error);
});

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
        Partials.Role,
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

const app = express();

app.use(cors({
    origin: ['http://localhost:5000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../../build')));
const SECRET = process.env.JWT_SECRET_KEY;
app.use(cookieParser());

let usert;
app.get("/oauth", async (req, res) => {
    const { code } = req.query;

    if (code) {
        try {
            const tokenResponseData = await request(
                "https://discord.com/api/oauth2/token",
                {
                    method: "POST",
                    body: new URLSearchParams({
                        client_id: process.env.CLIENT_ID,
                        client_secret: process.env.CLIENT_SECRET,
                        code,
                        grant_type: "authorization_code",
                        redirect_uri: `http://localhost:5000/oauth`,
                        scope: "guilds%20identify",
                    }).toString(),
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded",
                    },
                }
            );

            const oauthData = await tokenResponseData.body.json();

            const userResult = await request("https://discord.com/api/users/@me", {
                headers: {
                    authorization: `${oauthData.token_type} ${oauthData.access_token}`,
                },
            });

            usert = await userResult.body.json();

            await UserTeste.findOneAndUpdate({ idU: usert.id }, { acesstoken: oauthData.access_token }, { new: true });

            const token = jwt.sign({ userId: usert.id }, SECRET, { expiresIn: '1h' });

            res.cookie('token', token, {
                httpOnly: true,
                secure: process.env.NODE_ENV !== 'development',
                maxAge: 60 * 60 * 1000,
            });

            res.redirect(
                `http://localhost:5000/callback?code=${code}&userId=${usert.id}&username=${usert.username}&avatar=${usert.avatar}&discriminator=${usert.discriminator}&acesstoken=${oauthData.access_token}`
            );

        } catch (error) {
            console.error(error);
        }
    }
});
app.get('/api/server/auth-check/:userId', async (req, res) => {
    const { userId } = req.params;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ message: 'Nenhum cabeçalho de autorização fornecido' });
    }

    const token = authHeader.split(' ')[1];

    const user = await UserTeste.findOne({ idU: userId });

    if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    const storedToken = user.acesstoken;

    if (!storedToken || storedToken !== token) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    res.status(200).json({ message: 'Usuário autenticado' });
});


app.get("/api/servers/:userId", async (req, res) => {
    const { userId } = req.params;
    redisClient.get(`servers:${userId}`, async (err, cachedData) => {
        if (cachedData) {
            return res.json({ servers: JSON.parse(cachedData) });
        }

        const user = await UserTeste.findOne({ idU: userId });

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }
        const response = await http.get("https://discord.com/api/users/@me/guilds", {
            headers: {
                authorization: `Bearer ${user.acesstoken}`,
            },
        });
        const serversData = response.data;

        const adminPermission = 0x8;

        const hasAdminPermission = (permissions) => (permissions & adminPermission) === adminPermission;

        const adminServers = serversData.filter(server => hasAdminPermission(server.permissions));

        const botServers = client.guilds.cache.map(guild => guild.id);

        const commonServers = adminServers.filter(server => botServers.includes(server.id));

        redisClient.setex(`servers:${userId}`, 15, JSON.stringify(commonServers));
        res.json({ servers: commonServers });
    });
});

app.get("/api/server/:serverId", async (req, res) => {

    const { serverId } = req.params;

    const server = client.guilds.cache.get(serverId);

    if (!server) {

        return res.status(404).json({ msg: 'Server not found' });

    }

    const members = await server.members.fetch();

    const channels = await server.channels.fetch();

    const roles = await server.roles.fetch();

    const emojis = await server.emojis.fetch();

    const serverData = {
        id: server.id,
        name: server.name,
        icon: server.iconURL({ dynamic: true }),
        members: members.size,
        channels: channels.size,
        roles: roles.size,
        emojis: emojis.size,
    };

    res.json({ server: serverData });

});

app.get("/api/server/roles/:serverId", async (req, res) => {
    const { serverId } = req.params;
    const server = client.guilds.cache.get(serverId);

    if (!server) {
        return res.status(404).json({ msg: 'Server not found' });
    }

    const roles = await server.roles.fetch();

    const rolesData = Array.from(roles.values())
        .filter(role => !role.managed && role.name !== '@everyone');

    res.json({ roles: rolesData });
});

app.get("/api/server/roles/:serverId/:roleId", async (req, res) => {
    const { serverId, roleId } = req.params;

    const server = client.guilds.cache.get(serverId);

    if (!server) {
        return res.status(404).json({ msg: 'Server not found' });
    }

    const role = await server.roles.fetch(roleId);

    if (!role) {
        return res.status(404).json({ msg: 'Role not found' });
    }

    res.json({ role: { id: role.id, name: role.name } });
});

app.get("/api/server/info/:serverId", async (req, res) => {
    const { serverId } = req.params;
    let server = await Guild.findOne({ idS: serverId });

    if (!server) {
        server = await Guild.create({
            idS: serverId,
            prefix: 'ss',
            vip: []
        },
            {
                new: true,
                upsert: true
            })
    }

    res.json({ server: server });
});

app.post('/api/server/settings/:serverId', async (req, res) => {
    const { serverId } = req.params;
    const { commandPrefix } = req.body;

    try {
        let botSettings = await Guild.findOne({ idS: serverId });

        if (!botSettings) {

            res.status(404).json({ message: 'Bot não está no servidor' });
        }
        else {
            botSettings.prefix = commandPrefix;

            await botSettings.save();

            res.status(200).json({ message: 'Configurações salvas com sucesso' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro interno' });
    }
});

app.post('/api/server/saveVipRoles/:serverId', async (req, res) => {
    const { serverId } = req.params;
    const { vipRoles } = req.body;

    try {
        let botSettings = await Guild.findOne({ idS: serverId });

        if (!botSettings) {
            return res.status(404).json({ message: 'Bot não está no servidor' });
        }

        botSettings.vip = [];

        vipRoles.forEach(role => {
            botSettings.vip.push({ id: role.id });
        });

        await botSettings.save();
        return res.status(200).json({ message: 'Configurações salvas com sucesso' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro interno' });
    }
});


const PORT = process.env.PORT

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erro interno');
});

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
});

connectDB();

const server = async () => {
    try {
        await client.login(process.env.TOKEN);
    } catch (error) {
        console.error(error);
        setTimeout(server, 5000);
    }
}
app.listen(PORT, () => console.log(`Servidor iniciado na porta: ${PORT}`));
server();