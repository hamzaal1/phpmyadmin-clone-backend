const whitelist = [
    'http://localhost:5173',
    'https://phpmyadmin-clone-with-server-auth.vercel.app',
    // 'http://yourfrontenddomain.com'
];

const corsConfig = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
};

module.exports = corsConfig