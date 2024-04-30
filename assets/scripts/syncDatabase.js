const request = require('request');
const fs = require('fs');
const path = require('path');

const url = 'http://api.mind.ch3nyang.top/card';
const filePath = path.resolve(__dirname, '../data/data.json');

if (fs.existsSync(filePath)) {
    fs.renameSync(filePath, path.resolve(__dirname, '../data/data.json.backup'));
} else {
    console.log(`File ${filePath} does not exist.`);
}

fs.writeFileSync(filePath, JSON.stringify({}));

request(url, (error, response, body) => {
    if (error) {
        console.error(error);
        return;
    }
    
    const data = JSON.parse(body);
    const Collection = {};
    data.forEach((item) => {
        const collectionName = item.Collection;
        delete item.Collection;
        if (!Collection[collectionName]) {
            Collection[collectionName] = [];
        }
        Collection[collectionName].push(item);
    });

    fs.writeFileSync(filePath, JSON.stringify(Collection, null, 4));
});
