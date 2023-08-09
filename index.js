const express = require("express");
const app = express();
const PORT = 4000;
const bodyParser = require('body-parser');

const mySQLConnectionMiddleware = require("./middleware/mySQLConnectionMiddleware");

// global middleware
app.use(express.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(mySQLConnectionMiddleware);

app.get("/isConnected", (req, res) => res.json({ status: "ok" }));
app.post("/databases", async (req, res) => {
    const { mysql } = req;
    try {
        mysql.query("SELECT schema_name FROM information_schema.schemata;", function (err, result, fields) {
            if (err) throw res.status(500).json({ error: 'An error occurred' });
            res.json({ databases: result });
        });

    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(process.env.port || PORT, () => {
    console.log(`server working http://localhost:${process.env.port || PORT}`);
});
