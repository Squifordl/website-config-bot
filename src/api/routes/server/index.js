const express = require('express');
const router = express.Router();
const client = require("../../bot/index.js");
const http = require('axios');
const jwt = require('jsonwebtoken');
const { redisClient } = require('../../middleware/redisMiddleware.js');
const UserTeste = require("../../database/Schema/User.js");

router.get('/auth-check/:userId', async (req, res) => {
    const { userId } = req.params;
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        if (decoded.idU === userId) {
            const user = await UserTeste.findOne({ idU: userId });
            if (!user) {
                return res.status(404).json({ message: 'Usuário não encontrado' });
            }
            return res.status(200).json({ message: 'Usuário autenticado' });
        } else {
            return res.status(401).json({ message: 'Usuário não autenticado' });
        }
    } catch (err) {
        console.error(err);
        return res.status(401).json({ message: 'Usuário não autenticado' });
    }
});

router.get("/user/:userId", async (req, res) => {
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

router.get("/id/:serverId", async (req, res) => {

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

module.exports = router;