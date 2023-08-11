const mysql = require('mysql');

const mySQLConnectionMiddleware = (req, res, next) => {
    try {
        let mysqlConfig = {
            host: req.body.host,
            user: req.body.username,
            password: req.body.password,
        };

        if (req.body.schema_name) {
            mysqlConfig.database = req.body.schema_name;
        }

        console.log(mysqlConfig);
        const con = mysql.createConnection(mysqlConfig);

        con.connect(err => {
            if (err) {
                console.error('Failed to connect to MySQL:', err);
                return res.status(500).json({ error: 'Failed to connect' });
            }

            req.mysql = con;
            next();
        });
    } catch (error) {
        console.error('Failed to establish MySQL connection:', error);
        res.status(500).json({ error: 'Failed to establish MySQL connection' });
    }
};

module.exports = mySQLConnectionMiddleware;
