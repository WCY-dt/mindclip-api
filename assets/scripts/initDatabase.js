const safeReplace = (str) => {
    if (str === undefined) {
        return '';
    }
    return str.replace(/'/g, '&#39;');
}

const fs = require('fs');

const data = fs.readFileSync('./assets/data/data.json', 'utf8');

const jsonData = JSON.parse(data);

let sql = `

DROP TABLE IF EXISTS Linkcard;

CREATE TABLE IF NOT EXISTS Linkcard
    (Id INTEGER PRIMARY KEY, Col VARCHAR, Category VARCHAR, Title VARCHAR, Urlpath VARCHAR, Descr VARCHAR, Detail TEXT);

INSERT INTO Linkcard
    (Id, Col, Category, Title, Urlpath, Descr, Detail)
VALUES
`;

const generateLinkcards = (data) => {
    let id = 0;
    return Object.entries(data).map(([collection, items]) => {
        return items.map(item => {
            // 使用safeReplace函数替换每个字段中的单引号
            let safeTitle = safeReplace(item.title);
            let safeUrl = safeReplace(item.url);
            let safeDescription = safeReplace(item.description);
            let safeDetail = safeReplace(item.detail);
            return `\t(${id++}, '${collection}', '${item.category}', '${safeTitle}', '${safeUrl}', '${safeDescription}', '${safeDetail}')`;
        }).join(',\n');
    }).join(',\n');
}

sql += generateLinkcards(jsonData) + ';\n';

sql += `

DROP TABLE IF EXISTS Links;

CREATE TABLE IF NOT EXISTS Links
    (Id INTEGER PRIMARY KEY, LinkcardId INTEGER, Title VARCHAR, Urlpath VARCHAR);

INSERT INTO Links
    (Id, LinkcardId, Title, Urlpath)
VALUES
`;

const generateLinks = (data) => {
    let id = 0;
    let linkcardId = -1;
    return Object.entries(data).map(([_, items]) => {
        return items.map(item => {
            linkcardId++;
            let links = item.links || []; // 如果item.links不存在，使用空数组
            return links.map(link => {
                let safeTitle = safeReplace(link.title);
                let safeUrl = safeReplace(link.url);
                return `\t(${id++}, ${linkcardId}, '${safeTitle}', '${safeUrl}')`;
            }).filter(Boolean).join(',\n'); // 过滤掉空字符串
        }).filter(Boolean).join(',\n'); // 过滤掉空字符串
    }).filter(Boolean).join(',\n'); // 过滤掉空字符串
}

sql += generateLinks(jsonData) + ';\n';

fs.writeFileSync('./assets/sql/schema.sql', sql);