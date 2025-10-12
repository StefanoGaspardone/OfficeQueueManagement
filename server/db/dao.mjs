import sqlite from "sqlite3";
import dayjs from "dayjs";

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

export const getCounter = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT COUNT(*) AS count FROM CounterServices WHERE counter = ?';
        db.get(query, [id], (err, row) => {
            if(err) reject(err);
            else resolve(row.count > 0);
        })
    });
}

export const getCounters = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT DISTINCT counter FROM CounterServices';
        db.all(query, [], (err, rows) => {
            if (err) reject(err);
            else resolve(rows.map(row => row.counter));
        });
    });
}

export const getTicketServedByCounter = (id) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id FROM Tickets WHERE counter = ? AND status = "processing"';
        db.get(query, [id], (err, row) => {
            if(err) reject(err);
            else resolve(row ? row.id : null);
        });
    });
}

export const setTicketFinished = (counterId, ticketId) => {
    return new Promise((resolve, reject) => {
        const finishedTime = dayjs().format('HH:mm:ss');
        const query = 'UPDATE Tickets SET status = "finished", finishedtime = ? WHERE id = ? AND counter = ?';
        
        db.run(query, [finishedTime, ticketId, counterId], function(err) {
            if(err) reject(err);
            else {
                const query = 'SELECT service, calledtime, finishedtime, date FROM Tickets WHERE id = ?';
                db.get(query, [ticketId], (err, row) => {
                    if(err) reject(err);
                    else {
                        const calledDateTime = dayjs(`${row.date} ${row.calledtime}`);
                        const finishedDateTime = dayjs(`${row.date} ${row.finishedtime}`);
                        const serviceTimeSeconds = finishedDateTime.diff(calledDateTime, 'second');
                        
                        resolve({
                            serviceId: row.service,
                            serviceTime: serviceTimeSeconds
                        });
                    }
                });
            }
        });
    });
}

export const updateServiceTime = (serviceId, serviceTime) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT servicetime, count FROM Services WHERE id = ?';
        db.get(query, [serviceId], (err, row) => {
            if(err) reject(err);
            else {
                const currentAvg = row.servicetime || 0;
                const count = row.count || 0;

                const newAvg = Math.round((currentAvg * count + serviceTime) / (count + 1));

                const query = 'UPDATE Services SET count = ?, servicetime = ? WHERE id = ?';
                db.run(query, [count + 1, newAvg, serviceId], function(err) {
                    if(err) reject(err);
                    else resolve(this.changes);
                });
            }
        });
    });
}

export const getNextCustomer = (counterId) => {
    return new Promise((resolve, reject) => {
        const query = `
            WITH ServiceQueues AS (
                SELECT t.service, s.servicetime, COUNT(*) as queue_length
                FROM Tickets t, Services s, CounterServices cs
                WHERE cs.counter = ? AND t.status = "waiting" AND t.service = s.id AND t.service = cs.service
                GROUP BY t.service, s.servicetime
            ),
            SelectedService AS (
                SELECT service
                FROM ServiceQueues
                ORDER BY queue_length DESC, servicetime ASC, service ASC
                LIMIT 1
            )
            SELECT t.id
            FROM Tickets t, SelectedService ss
            WHERE t.status = "waiting" AND t.service = ss.service
            ORDER BY t.issuetime ASC
            LIMIT 1
        `;
        
        db.get(query, [counterId], (err, row) => {
            if(err) reject(err);
            else if(!row) resolve(null);
            else resolve(row.id);
        });
    });
};

export const setTicketServed = (counterId, ticketId) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE Tickets SET counter = ?, status = "processing", calledtime = ? WHERE id = ?';
        db.run(query, [counterId, dayjs().format('HH:mm:ss'), ticketId], function(err) {
            if(err) reject(err);
            else resolve(this.changes);
        });
    });
}

export const getCounterServices = (counterId) => {
    return new Promise((resolve, reject) => {
        const query = `SELECT service FROM CounterServices WHERE counter = ?`;
        db.all(query, [counterId], (err, rows) => {
            if(err) reject(err);
            else resolve(rows.map(row => row.service));
        });
    });
}

export const getServiceQueue = (serviceId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, issuetime FROM Tickets WHERE service = ? AND status = "waiting" ORDER BY issuetime ASC';
        db.all(query, [serviceId], (err, rows) => {
            if(err) reject(err);
            else resolve(rows);
        });
    });
}

export const getServiceType = (serviceId) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT type FROM Services WHERE id = ?';
        db.get(query, [serviceId], (err, row) => {
            if(err) reject(err);
            else resolve(row.type);
        });
    });
}