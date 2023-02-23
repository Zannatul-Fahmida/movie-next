import { MongoClient } from "mongodb";
import jwt from "jsonwebtoken";
import { getSession } from "next-auth/react";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body.user;
    const { name, email, password, image } = data;

    const uri = process.env.MONGODB_URI;
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const db = client.db();

    const existingUser = await db.collection("users").findOne({
      email: email,
    });

    if (existingUser) {
      res.status(422).json({ message: "User already exists!" });

      await client.close();
      return;
    }

    const user = await db.collection("users").insertOne({
      name: name,
      email: email,
      password: password,
      image: image,
    });

    const session = await getSession(req.body.user);

    const token = jwt.sign(
      { userId: user.insertedId },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await client.close();

    res
      .status(201)
      .json({
        message: "User created!",
        userId: user.insertedId,
        token: token,
        session,
      });
  }

  res.status(404).json({ message: "Not supported!" });
};

export default handler;
