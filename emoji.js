import fs from 'fs';

const db = JSON.parse(fs.readFileSync('./emoji.json'));

export default {
    unicodeForAlias(alias) {
        return db.find(emoji => emoji.aliases.some(a => a === alias)).emoji;
    }
};
