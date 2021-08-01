const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '../youtube')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, '../youtube/index.html'));
});

app.listen(8080, function() {
	console.log('[server] 📡 listening on 8080');
});