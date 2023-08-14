const whitelist = [
    'http://localhost:5173',
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