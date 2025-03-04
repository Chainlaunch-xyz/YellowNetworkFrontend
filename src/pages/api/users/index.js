import { db } from "@/lib/db.js";

export default async function users(req, res) {
  switch (req.method) {
    case "GET":
      await searchUsers(req, res);
      break;

    default:
      res.status(405).json({
        error: `method ${req.method} not allowed`,
      });
  }
}

export async function searchUsers(req, res) {
  const { search, alphabet, page, perPage } = req.query;

  const take = perPage ?? 15;
  const skip = ((page ?? 1) - 1) * take;

  let where = undefined;
  if (alphabet)
    where = {
      name: {
        startsWith: alphabet[0],
        mode: "insensitive",
      },
    };
  else if (search)
    where = {
      OR: ["name", "email", "organization", "title", "telegramUsername"].map(
        (field) => ({
          [field]: {
            contains: search,
            mode: "insensitive",
          },
        }),
      ),
    };

  const users = await db.users.findMany({
    where,
    skip,
    take,
  });
  res.status(200).json(users);
}
