import { getSession } from "next-auth/react";
import { MongoClient, ObjectId } from "mongodb";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const { movieName, poster, releaseDate } = req.body;

    const uri = process.env.MONGODB_URI;
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();

    await db.collection("watchlist").insertOne({
      name: session.user.name,
      email: session.user.email,
      movieName,
      poster,
      releaseDate,
      created: new Date(),
    });

    res.status(201).send({ message: "This movie is added successfully" });
  } else if (req.method === "DELETE") {
    const session = await getSession({ req });
    const { id } = req.body;

    const uri = process.env.MONGODB_URI;
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    const db = client.db();

    const result = await db.collection("watchlist").deleteOne({
      _id: ObjectId(id),
      email: session.user.email,
    });

    if (result.deletedCount === 0) {
      res.status(404).send({ message: "Movie not found in watchlist" });
    } else {
      res.status(200).send({ message: "Movie removed from watchlist" });
    }
  } else {
    res.status(405).send({ message: "Method not allowed" });
  }
}
