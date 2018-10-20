const { promisify } = require("util");
const fs = require("fs");
const readFileAsync = promisify(fs.readFile);
const existsAsync = promisify(fs.exists);
const writeFileAsync = promisify(fs.writeFile);

const filename = "./db.json";

module.exports = storage = {
  data: {},
  save: async () => {
    await writeFileAsync(filename, JSON.stringify(storage.data));
    return storage;
  },
  load: async () => {
    const exists = await existsAsync(filename);
    if (exists) {
      const content = await readFileAsync(filename);
      storage.data = JSON.parse(content);
    } else {
      await writeFileAsync(filename, JSON.stringify({}));
    }
    return storage;
  },
};
