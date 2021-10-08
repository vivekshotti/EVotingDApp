var express = require('express');
var app = express();

//JSON file for deployed contract and network information
const mainContractJSON = require('../build/contracts/MainContract.json')
const electionJSON = require('../build/contracts/Election.json')
const PORT=process.env.PORT || 3000;

require("dotenv").config();

app.use(express.static("./"));

app.get('/', (req, res) => {
    res.sendFile('index.html');
});

//Sending MainContract JSON file for its interaction using Truffle
app.get('/mainContractJSON', (req, res) => {
    res.send(mainContractJSON);
});

//Sending ABI object directly for Election contract, since only ABI will be used
app.get('/electionJSON', (req, res) => {
    res.send(electionJSON.abi);
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
