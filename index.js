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

// databases api 

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


// tables api 
app.post("/databases/expande/table", async (req, res) => {
    const { mysql } = req;
    mysql.query(`DESCRIBE ${req.body.table};`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ table_column: result, status: 1 });
    });
    mysql.end();
});

app.post("/databases/expande/table/shows", async (req, res) => {
    const { mysql } = req;
    mysql.query(`SELECT * from ${req.body.table};`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ tables_recordes: result, status: 1 });
    });
    mysql.end();
});
app.post("/databases/expande/table/delete", async (req, res) => {
    const { mysql } = req;
    mysql.query(`DELETE from ${req.body.table} WHERE id= ${req.body.id};`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "deleted successfully", status: 1 });
    });
    mysql.end();
});
app.post("/databases/expande/table/add", async (req, res) => {
    const { mysql } = req;
    const { table_name, rows } = req.body;

    if (!rows.length) return res.status(301).json({ message: "table must have more than one colmun", status: 0 });;
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS ${table_name} (
            id INT AUTO_INCREMENT PRIMARY KEY,
            ${rows.map(row => {
        if (row.type === 'date') {
            return `${row.name} ${row.type} DEFAULT CURRENT_DATE`;
        }
        return `${row.name} ${row.type}`;
    }).join(', ')}
        );
    `;
    mysql.query(createTableQuery, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "table add successfully", status: 1 });
    });
    mysql.end();
});
app.post("/databases/expande/table/add/record", async (req, res) => {
    const { mysql } = req;
    const { table, records } = req.body;

    if (!records.length) return res.status(301).json({ message: "table must have more than one colmun", status: 0 });;
    const insertQuery = `
    INSERT INTO ${table} (${records.map(record => record.field).join(', ')})
    VALUES (${records.map(record => '?').join(', ')})
  `;
    const values = records.map(record => record.value);

    mysql.query(insertQuery, values, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "record add successfully", status: 1 });
    });
    mysql.end();
});


app.post("/databases/expande/table/drop", async (req, res) => {
    const { mysql } = req;
    const { table_name } = req.body;

    mysql.query(`DROP TABLE IF EXISTS ${table_name}`, function (err, result, fields) {
        if (err) res.status(500).json({ error: 'An error occurred' });
        res.json({ message: "table add successfully", status: 1 });
    });
    mysql.end();
});


app.listen(process.env.port || PORT, () => {
    console.log(`server working http://localhost:${process.env.port || PORT}`);
});
