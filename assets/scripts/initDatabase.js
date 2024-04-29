const fs = require('fs');

const data = fs.readFileSync('./assets/data/data.json', 'utf8');

const jsonData = JSON.parse(data);

let sql = `

DROP TABLE IF EXISTS [Cards];

CREATE TABLE IF NOT EXISTS [Cards]
    ([Id] INTEGER PRIMARY KEY, [Collection] VARCHAR, [Category] VARCHAR, [Title] VARCHAR, [Url] VARCHAR, [Description] VARCHAR, [Detail] TEXT);

INSERT INTO [Cards]
    ([Id], [Collection], [Category], [Title], [Url], [Description], [Detail])
VALUES
`;

const generateCards = (data) => {
    let id = 0;
    return Object.entries(data).map(([collection, items]) => {
        return items.map(item => {
            return `\t(${id++}, "${collection}", "${item.category}", "${item.title}", "${item.url}", "${item.description}", "${item.detail}")`;
        }).join(',\n');
    }).join(',\n');
}

sql += generateCards(jsonData) + ';\n';

sql += `

DROP TABLE IF EXISTS [Links];

CREATE TABLE IF NOT EXISTS [Links]
    ([Id] INTEGER PRIMARY KEY, [CardId] INTEGER, [Title] VARCHAR, [Url] VARCHAR);

INSERT INTO [Links]
    ([Id], [CardId], [Title], [Url])
VALUES
`;

const generateLinks = (data) => {
    let id = 0;
    let cardId = -1;
    return Object.entries(data).map(([_, items]) => {
        return items.map(item => {
            cardId++;
            let links = item.links || [];
            return links.map(link => {
                return `\t(${id++}, ${cardId}, '${link.title}', '${link.url}')`;
            }).filter(Boolean).join(',\n');
        }).filter(Boolean).join(',\n');
    }).filter(Boolean).join(',\n');
}

sql += generateLinks(jsonData) + ';\n';

fs.writeFileSync('./assets/sql/schema.sql', sql);