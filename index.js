const express = require("express");
const app = express();
const {NodeSSH} = require('node-ssh')
const ssh = new NodeSSH ();
const PORT = 4000;

const bodyParser = require('body-parser');

app.use(bodyParser.json());

app.get("/", (req, res) => {
    console.log("hello from get req");
    ssh
        .connect({
            host: "",
            username: "",
            password: "",
            port: 22
        })
        .then(() => {
            console.log("work")

        });
    res.json({ message: "server work fine" })
});


app.listen(process.env.port || PORT, () => {
    console.log(`server working http://localhost:${process.env.port || PORT}`);
})