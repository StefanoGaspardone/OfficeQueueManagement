import sqlite from "sqlite3";

const db = new sqlite.Database("./db/OfficeQueue.sqlite", (err) => {
  if (err) throw err;
});

export const getServices = () => {
  return new Promise((resolve, reject) => {
    db.all("SELECT id, type FROM services", (err, rows) => {
      if (err) {
        reject(err);
      } else {
        const services = rows.map((row) => ({ id: row.id, type: row.type }));
        resolve(services);
      }
    });
  });
};

export const createTicket = (serviceType) => {
    return new Promise((resolve, reject) => {
        const stmt = db.prepare("INSERT INTO tickets (service, date, issuetime, status) VALUES (?, DATE('now'), TIME('now'), 'waiting')");
        stmt.run(serviceType, function(err) {
            if (err) {
                reject(err);
            } else {
                resolve({ ticketId: this.lastID });
            }
        });
        stmt.finalize();
    });
}

