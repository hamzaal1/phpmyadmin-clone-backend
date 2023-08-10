var mysql = require('mysql');
const mySQLConnectionMiddleware = async (req, res, next) => {
    try {

        const mysqlConfig = {
            host: req.body.host,
            user: req.body.username,
            password: req.body.password,
        }
        console.log(mysqlConfig);
        const con = mysql.createConnection(mysqlConfig);

        con.connect(function (err) {
            if (err) {
                console.log(err);
                res.status(500).json({ error: 'Failed to connect' });
            } else {
                req.mysql = con;
                next();
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to establish Mysql connection' });
    }
}
module.exports = mySQLConnectionMiddleware