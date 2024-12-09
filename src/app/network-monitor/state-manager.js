import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const BLOCK_DATA_FILE = path.join(__dirname, "data.json");

async function loadState({ fallbackLastCheckedBlock = 376908 } = {}) {
  const data = fs.readFile(BLOCK_DATA_FILE, { encoding: "utf8" });
  console.log("Content of block_data.json:", data);
  return data.then((data) => {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.error("Error parsing data:", err);

      return getDefaultData({ fallbackLastCheckedBlock });
    }
  })
  .catch((err) => {
      if (err.code === "ENOENT") {
        return getDefaultData({ fallbackLastCheckedBlock });
      }

      throw err;
  });
}

function getDefaultData({ fallbackLastCheckedBlock }) {
  return { lastCheckedBlock: fallbackLastCheckedBlock };
}

async function saveState(state) {
  return fs.writeFile(BLOCK_DATA_FILE, JSON.stringify(state, null, 2), "utf-8");
}

export { loadState, saveState };
