import { connectToDatabase } from "../../lib/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const session = await getSession({ req });

    if (!session) {
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    const { movieName, description, rating } = req.body.data;
    console.log(movieName, description, rating);

    if (!movieName || !rating) {
      res.status(400).send({ message: "Movie name and rating are required" });
      return;
    }
    const client = await connectToDatabase();

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
  } else {
    res.status(405).send({ message: "Method not allowed" });
  }
}
