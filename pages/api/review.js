import { MongoClient, ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    const { movieName, description, rating } = req.body.data;

    if (!movieName || !rating) {
      res.status(400).send({ message: "Movie name and rating are required" });
      return;
    }
    const uri = process.env.MONGODB_URI;
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();

    await db.collection("reviews").insertOne({
      name: session.user.name,
      email: session.user.email,
      movieName,
      description,
      rating: parseInt(rating),
      created: new Date(),
    });

    res.status(201).send({ message: "Review created successfully" });
  } else if (req.method === "DELETE") {
    const session = await getSession({ req });
    const { id } = req.body;

    const uri = process.env.MONGODB_URI;
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();

    const result = await db.collection("reviews").deleteOne({
      _id: ObjectId(id),
      email: session.user.email,
    });

    if (result.deletedCount === 0) {
      res.status(404).send({ message: "Review not found" });
    } else {
      res.status(200).send({ message: "Review removed" });
    }
  } else {
    res.status(405).send({ message: "Method not allowed" });
  }
}
