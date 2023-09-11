const express = require('express');
const cors = require('cors');
const path = require('path');
const cookieParser = require('cookie-parser');
const connectDB = require('./database/index.js');
const { redisMiddleware } = require('./middleware/redisMiddleware');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT;

function configureMiddleware(app) {
    app.use(cors({
        origin: [process.env.DEFAULT_URL]
    }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.resolve(__dirname, '../../build')));
    app.use(cookieParser());
    app.use(redisMiddleware);
}

function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Erro interno');
}

async function startServer() {
    await connectDB();

    configureMiddleware(app);

    routes.register(app);

    app.use(errorHandler);

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(__dirname, "../../build", "index.html"));
    });

    app.listen(PORT, () => console.log(`Servidor iniciado na porta: ${PORT}`));
}

startServer();
