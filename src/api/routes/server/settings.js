const express = require('express');
const router = express.Router();
const Guild = require('../../database/Schema/Guild.js');

router.post('/settings/:serverId', async (req, res) => {
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

router.post('/settings/saveVipRoles/:serverId', async (req, res) => {
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

module.exports = router;