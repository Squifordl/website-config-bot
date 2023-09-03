const express = require('express');
const router = express.Router();
const Guild = require('../../database/Schema/Guild.js');

router.get("/info/:serverId", async (req, res) => {
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

module.exports = router;