import { MongoClient } from "mongodb";

export const connectToDatabase = async () => {
  return await MongoClient.connect(process.env.MONGODB_URI);
};
