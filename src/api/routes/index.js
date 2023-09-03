function register(app) {
    app.use('/oauth', require('./auth/index.js'));
    app.use('/api/bot', require('./bot/index.js'));
    app.use('/api/server', require('./routes/server/index.js'));
    app.use('/api/server', require('./routes/server/info.js'));
    app.use('/api/server', require('./routes/server/roles.js'));
    app.use('/api/server', require('./routes/server/settings.js'));
}

module.exports = { register };