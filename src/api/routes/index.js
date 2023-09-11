function register(app) {
    app.use('/oauth', require('./auth/index.js'));
    app.use('/api/bot', require('./bot/index.js'));
    app.use('/api/server', require('./server/index.js'));
    app.use('/api/server', require('./server/info.js'));
    app.use('/api/server', require('./server/roles.js'));
    app.use('/api/server', require('./server/settings.js'));
}

module.exports = { register };