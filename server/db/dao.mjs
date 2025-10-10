import sqlite from 'sqlite3';

const db = new sqlite.Database('/db/OfficeQueue.sqlite', (err) => {
    if(err) throw err;
});

export default dao = {

};