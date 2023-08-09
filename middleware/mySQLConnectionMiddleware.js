var mysql = require('mysql');
const mySQLConnectionMiddleware = async (req, res, next) => {
    try {

        const mysqlConfig = {
            host: "localhost",
            user: "root",
            password: "",
        }
        const con = mysql.createConnection(mysqlConfig);
        con.connect(function (err) {
            if (err) res.status(500).json("faild to connect");
            req.mysql = con;
            next();
        });

    } catch (error) {
        res.status(500).json({ error: 'Failed to establish Mysql connection' });
    }
}
module.exports = mySQLConnectionMiddleware