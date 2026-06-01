const fs = require("fs");
const path = require("path");

const STORE_PATH = path.join(__dirname, "orders.json");

async function ensureStore() {
  try {
    await fs.promises.mkdir(path.dirname(STORE_PATH), { recursive: true });
    await fs.promises.access(STORE_PATH, fs.constants.F_OK);
  } catch (err) {
    if (err.code === "ENOENT") {
      await fs.promises.writeFile(STORE_PATH, JSON.stringify([], null, 2), "utf8");
    } else {
      throw err;
    }
  }
}

async function readStore() {
  await ensureStore();
  const json = await fs.promises.readFile(STORE_PATH, "utf8");
  return JSON.parse(json || "[]");
}

async function writeStore(data) {
  await ensureStore();
  await fs.promises.writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf8");
}

module.exports = {
  readStore,
  writeStore,
};
