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

const redisMiddleware = (req, res, next) => {
    const key = `${req.originalUrl}`;
    redisClient.get(key, (err, cachedData) => {
        if (err) {
            console.error(err);
            return next();
        }
        if (cachedData) {
            res.send(JSON.parse(cachedData));
        } else {
            res.locals.cacheKey = key;
            next();
        }
    });
};

module.exports = {
    redisMiddleware,
    redisClient
};
