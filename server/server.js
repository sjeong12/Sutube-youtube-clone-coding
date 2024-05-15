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


app.get('/recommendedAd', (req, res) => {
    const readLogStream = fs.createReadStream(path.join(__dirname, `../data/log/${getDate()}.txt`), { encoding: 'utf-8' });
    const readAdStream = fs.createReadStream(path.join(__dirname, `../data/ad.txt`), { encoding: 'utf-8' });
    let logList = [];
    let adList = [];
    let leastViewedAd = null;

    readLogStream.on('data', (chunk) => {
        const chunkLines = chunk.split('\n');

        for (let i = chunkLines.length - 1; i >= 0; i--) {
            if (chunkLines.length - i <= 100) {
                logList.unshift(JSON.parse(chunkLines[i]));
            } else {
                break;
            }
        }
        readLogStream.close();
    });

    readLogStream.on('close', () => {
        readAdStream.on('data', (chunk) => {
            const chunkLines = chunk.split('\n');

            for (let i = chunkLines.length - 1; i >= 0; i--) {
                if (chunkLines.length - i <= 100) {
                    adList.unshift(JSON.parse(chunkLines[i]));
                } else {
                    break;
                }
            }

            readAdStream.close();
        });
    });

    readAdStream.on('close', () => {
        leastViewedAd = computeRecommendedAd(adList, logList, req.query.lastAdSeq);
        res.json(leastViewedAd);
    });

    readLogStream.on('error', (err) => {
        console.error('[readLogStream] Error reading file:', err);
        res.status(500).send('Error reading file');
    });
    readAdStream.on('error', (err) => {
        console.error('[readAdStream] Error reading file:', err);
        res.status(500).send('Error reading file');
    });
});

app.post('/printLog', (req, res) => {
    const data = req.body;
    const date = getDate();

    fs.readFile(path.join(__dirname, `../data/log/${date}.txt`), (err, fileData) => {
        const newData = ((err || !fileData) ? '' : fileData + '\n') + JSON.stringify(data);

        fs.writeFile(path.join(__dirname, `../data/log/${date}.txt`), newData, (err) => {
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

function getDate() {
	const now = new Date();
	const year = now.getFullYear();
	const month = String(now.getMonth() + 1).padStart(2, '0');
	const day = String(now.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}

function computeRecommendedAd(adList, logList, lastAdSeq) {
    adList = adList.filter(ad => ad.seq != lastAdSeq)
    if (logList.length == 0) {
        res.json(adList[0]);
        return;
    }
    adList.map(ad => ad.views = 0);
    for (const log of logList) {
        const ad = adList.find(ad => ad.seq === log.target);
        if (ad) ad.views++;
    }

    let minViews = Infinity;
    for (const ad of adList) {
        if (ad.views == 0) {
            leastViewedAd = ad;
            break;
        }
        if (ad.views < minViews) {
            minViews = ad.views;
            leastViewedAd = ad;
        }
    }
    return leastViewedAd;
}