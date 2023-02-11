import { connectToDatabase } from "../../../lib/mongodb";

const handler = async (req, res) => {
  if (req.method === "POST") {
    const data = req.body.user;
    const { name, email, password } = data;

    const client = await connectToDatabase();

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
    });

    await client.close();

    res.status(201).json({ message: "User created!", userId: user.insertedId });
  }

  res.status(404).json({ message: "Not supported!" });
};

export default handler;
