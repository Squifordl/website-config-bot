const express = require('express');
const router = express.Router();
const client = require("../../bot/index.js");

router.get("/roles/:serverId", async (req, res) => {
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

router.get("/roles/:serverId/:roleId", async (req, res) => {
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

module.exports = router;