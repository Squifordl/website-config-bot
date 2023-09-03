const express = require('express');
const router = express.Router();

const commands = [
    {
        name: 'ping',
        category: 'Utilitário',
        description: 'Verifica a latência do bot.',
        usage: '!ping'
    },
    {
        name: 'say',
        category: 'Diversão',
        description: 'Faz o bot repetir sua mensagem.',
        usage: '!say [mensagem]'
    }
]
router.get('/commands', async (req, res) => {
    res.json({ commands });
});

module.exports = router;