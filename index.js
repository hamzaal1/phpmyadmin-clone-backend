const express = require("express");
const app = express();
const PORT = 4000;
const bodyParser = require('body-parser');
const cors = require("cors")

const mySQLConnectionMiddleware = require("./middleware/mySQLConnectionMiddleware");
const corsConfig = require("./config/corsConfig");

// global middleware
app.use(cors(corsConfig));
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(mySQLConnectionMiddleware);


app.get("/isConnected", (req, res) => res.json({ status: "ok" }));

app.post("/databases", async (req, res) => {
    const { mysql } = req;
    mysql.query("SELECT schema_name FROM information_schema.schemata;", function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ databases: result });
    });
    mysql.end();

});

app.post("/databases/add", async (req, res) => {
    const { mysql } = req;
    mysql.query(`CREATE DATABASE ${req.body.name}`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "table created SuccessFully", status: 1 });
    });
    mysql.end();

});

app.post("/databases/delete", async (req, res) => {
    const { mysql } = req;
    mysql.query(`DROP DATABASE IF EXISTS ${req.body.name};`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "table droped SuccessFully", status: 1 });
    });
    mysql.end();
});
app.post("/databases/expande", async (req, res) => {
    const { mysql } = req;
    mysql.query(`SHOW TABLES;`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        let tables = result.map((table) => table[`Tables_in_${req.body.schema_name}`])
        res.json({ tables, status: 1 });
    });
    mysql.end();
});

app.listen(process.env.port || PORT, () => {
    console.log(`server working http://localhost:${process.env.port || PORT}`);
});
