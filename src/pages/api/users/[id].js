import { db } from "@/lib/db.js";

export default async function getUser(req, res) {
  switch (req.method) {
    case "GET":
      await getUser(req, res);
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

export async function getUser(req, res) {
  try {
    const { id } = req.query;
    const user = await db.users.findUnique({
      where: { id: parseInt(id) },
    });

    if (user) res.status(200).json(user);
    else
      res.status(404).json({
        error: `user with id "${id}" not found`,
      });
  } catch (e) {
    console.error(e);
    res.status(500).json({
      error: e?.message ?? e,
    });
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

  // TODO: check authentication

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
