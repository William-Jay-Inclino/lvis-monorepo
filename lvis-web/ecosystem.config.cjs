module.exports = {
    apps: [
        {
            name: 'lvis-web',
            script: process.env.NODE_ENV === 'development'
            ? './scripts/start_app_dev.sh'
            : './scripts/start_app.sh',
            cwd: __dirname,
        },
    ]
};
