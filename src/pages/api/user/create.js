import { db } from "@/lib/db";

export default async function handler(req, res) {
  
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins (for development)
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Respond to preflight request
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { name, email, organization, title, city, country, telegramUsername, image } = req.body;
    if (!name || !email || !organization || !title || !city || !country || !telegramUsername, !image) {
      return res.status(400).json({ error: "All fields are required" });
    }
    // Check if the email or Telegram username already exists
    const existingUser = await db.users.findFirst({
      where: { OR: [{ email }, { telegramUsername }] },
    });
    if (existingUser) {
      return res.status(400).json({ error: "Email or Telegram username already exists" });
    }
    console.log(existingUser)
    const user = await db.users.create({
      data: {
        name,
        email,
        organization,
        title,
        city,
        country,
        telegramUsername,
        image,
      },
    });

    return res.status(201).json({ success: true, user });
  } catch (error) {
    console.log("Error creating user:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
