const path = require("path");
const { Low } = require("lowdb");
const { JSONFile } = require("lowdb/node");

const dbPath = path.join(__dirname, "../../database.json");
const adapter = new JSONFile(dbPath);
const db = new Low(adapter, {
  users: [],
  products: [],
  orders: [],
  counters: {
    users: 0,
    products: 0,
    orders: 0
  }
});

const initDb = async () => {
  await db.read();
  db.data ||= {
    users: [],
    products: [],
    orders: [],
    counters: { users: 0, products: 0, orders: 0 }
  };
  await db.write();
};

const nextId = (key) => {
  db.data.counters[key] += 1;
  return db.data.counters[key];
};

module.exports = { db, initDb, nextId };
