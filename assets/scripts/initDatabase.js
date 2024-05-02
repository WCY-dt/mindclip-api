const fs = require('fs');

const data = fs.readFileSync('./assets/data/data.json', 'utf8');

const jsonData = JSON.parse(data);

cardIds = [];
linkIds = [];

function generateSequentialId(idsArray) {
	let id;
	if (idsArray.length === 0) {
		id = 1;
	} else {
		id = Math.max(...idsArray) + 1;
	}
	idsArray.push(id);
	return id;
}

let sql = `

DROP TABLE IF EXISTS [Cards];

CREATE TABLE IF NOT EXISTS [Cards]
    ([Id] INTEGER PRIMARY KEY, [Collection] VARCHAR, [Category] VARCHAR, [Title] VARCHAR, [Url] VARCHAR, [Description] VARCHAR, [Detail] TEXT);

INSERT INTO [Cards]
    ([Id], [Collection], [Category], [Title], [Url], [Description], [Detail])
VALUES
`;

const generateCards = (data) => {
    return Object.entries(data).map(([collection, items]) => {
        return items.map(item => {
			id = generateSequentialId(cardIds);
            return `\t(${id}, "${collection}", "${item.Category}", "${item.Title}", "${item.Url}", "${item.Description}", "${item.Detail}")`;
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
    let count = -1;
    return Object.entries(data).map(([_, items]) => {
        return items.map(item => {
            count++;
            let links = item.links || [];
            return links.map(link => {
				id = generateSequentialId(linkIds);
                cardId = cardIds[count];
                return `\t(${id}, ${cardId}, '${link.Title}', '${link.Url}')`;
            }).filter(Boolean).join(',\n');
        }).filter(Boolean).join(',\n');
    }).filter(Boolean).join(',\n');
}

sql += generateLinks(jsonData) + ';\n';

fs.writeFileSync('./assets/sql/schema.sql', sql);
