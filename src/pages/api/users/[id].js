import { db } from "@/lib/db.js";

export default async function getUser(req, res) {
  switch (req.method) {
    case "GET":
      await getUserDetails(req, res);
      break;

    case "PATCH":
      await updateUser(req, res);
      break;

    default:
      res.status(405).json({
        error: `method ${req.method} not allowed`,
      });
  }
}

export async function getUserDetails(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "Missing user ID in request" });
    }

    const user = await db.users.findUnique({
      where: { telegramUsername: id },
    });

    if (!user) {
      return res.status(404).json({ error: `User with ID "${id}" not found` });
    }

    res.status(200).json(user);
  } catch (e) {
    console.error("Error fetching user:", e);
    res.status(500).json({ error: e?.message || "Internal server error" });
  }
}

export async function updateUser(req, res) {
  const id = parseInt(req.query);
  if (!id) {
    res.status(400).json({
      error: `invalid user id: ${id}`,
    });
    return;
  }


  if (!req.body) {
    res.statu(400).json({
      error: `invalid body`,
      body: req.body,
    });
    return;
  }

  await db.users.update({
    where: { id },
    data: req.body,
  });

  res.status(200).json({ ok: true });
}
