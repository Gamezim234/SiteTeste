const fs = require("fs/promises");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");

let writeQueue = Promise.resolve();

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, "[]\n", "utf8");
  }
}

async function readMessages() {
  await ensureDataFile();

  const content = await fs.readFile(DATA_FILE, "utf8");

  try {
    const messages = JSON.parse(content);
    return Array.isArray(messages) ? messages : [];
  } catch {
    throw new Error("O arquivo de mensagens está inválido.");
  }
}

async function saveMessages(messages) {
  await ensureDataFile();

  writeQueue = writeQueue.then(() =>
    fs.writeFile(DATA_FILE, JSON.stringify(messages, null, 2) + "\n", "utf8")
  );

  return writeQueue;
}

async function listMessages() {
  return readMessages();
}

async function getMessageById(id) {
  const messages = await readMessages();
  return messages.find((message) => message.id === id) || null;
}

async function getLatestMessage(origem = null) {
  const messages = await readMessages();

  if (!origem) {
    return messages.at(-1) || null;
  }

  for (let index = messages.length - 1; index >= 0; index -= 1) {
    if (messages[index].origem === origem) {
      return messages[index];
    }
  }

  return null;
}

async function createMessage(texto, origem = "usuario") {
  const messages = await readMessages();

  const nextId =
    messages.length === 0
      ? 1
      : Math.max(...messages.map((message) => Number(message.id) || 0)) + 1;

  const message = {
    id: nextId,
    texto,
    origem,
    criadoEm: new Date().toISOString()
  };

  messages.push(message);
  await saveMessages(messages);

  return message;
}

module.exports = {
  listMessages,
  getMessageById,
  getLatestMessage,
  createMessage
};
