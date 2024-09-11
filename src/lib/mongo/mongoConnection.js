import { MongoClient } from "mongodb";

const URI = process.env.MONGODB_URI;
const options = {};
let cachedDb;
let client = new MongoClient(URI);

async function connectToDatabase() {
  try {
    const db = await client.connect();
    cachedDb = db;
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
}

async function getClient() {
  if (cachedDb) {
    return cachedDb;
  }
  return await connectToDatabase();
}

async function getDatabase() {
  const client = await getClient();
  return client.db("mmy-event-app");
}

export default getDatabase;
