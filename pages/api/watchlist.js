import { connectToDatabase } from "../../lib/mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const session = await getSession({ req });
    
        const { movieName, poster, releaseDate} = req.body;
        console.log(movieName, poster, releaseDate);

        const client = await connectToDatabase();
    
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
      } else {
        res.status(405).send({ message: "Method not allowed" });
      }
  }
  