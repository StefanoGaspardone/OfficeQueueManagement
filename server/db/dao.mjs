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

export const createTicket = (serviceId) => {
  return new Promise((resolve, reject) => {
    // Validate that the serviceId exists and retrieve its type (optional)
    db.get("SELECT id, type FROM services WHERE id = ?", [serviceId], (err, row) => {
      if (err) return reject(err);
      if (!row) return reject(new Error('Service not found'));

      const stmt = db.prepare("INSERT INTO tickets (service, date, issuetime, status) VALUES (?, DATE('now'), TIME('now'), 'waiting')");
      stmt.run(serviceId, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve({ ticketId: this.lastID, serviceId: row.id, serviceType: row.type });
        }
      });
      stmt.finalize();
    });
  });
};

