const express = require('express');
const cors = require('cors');
const connectDB = require('./database/index.js');
const path = require('path');
const cookieParser = require('cookie-parser');
const { redisMiddleware } = require('./middleware/redisMiddleware');
const app = express();
app.use(cors({
    origin: ['http://localhost:5000']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, '../../build')));
app.use(cookieParser());
app.use(redisMiddleware)
app.use('/oauth', require('./routes/auth.js'));
app.use('/api/server', require('./routes/server/index.js'));
app.use('/api/server', require('./routes/server/info.js'));
app.use('/api/server', require('./routes/server/roles.js'));
app.use('/api/server', require('./routes/server/settings.js'));
app.use('/api/bot', require('./routes/bot.js'));
const PORT = process.env.PORT

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erro interno');
});

app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
});

connectDB();
app.listen(PORT, () => console.log(`Servidor iniciado na porta: ${PORT}`));
