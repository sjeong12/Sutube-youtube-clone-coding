const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(express.static(path.join(__dirname, '../youtube')));
app.use('/data', express.static(path.join(__dirname, '../data')));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname, '/index.html'));
});

app.post('/printLog', (req, res) => {
    const data = req.body;
    fs.readFile(path.join(__dirname, `../data/log/${data.fileName}.txt`), (err, fileData) => {
        const logData = (err || !fileData) ? '' : fileData + '\n';
        const newData = logData + data.logMsg;
        fs.writeFile(path.join(__dirname, `../data/log/${data.fileName}.txt`), newData, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error writing to file');
            } else {
                res.send('Data appended to file');
            }
        });
    });
});

app.listen(8080, () => {
	console.log('[server] 📡 listening on 8080');
});