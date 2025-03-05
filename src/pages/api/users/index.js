import { db } from "@/lib/db.js";

export default async function users(req, res) {
  switch (req.method) {
    case "GET":
      await searchUsers(req, res);
      break;

    default:
      res.status(405).json({
        error: `Method ${req.method} not allowed`,
      });
  }
}

export async function searchUsers(req, res) {
  try {
    const { search, alphabet, page = 1, perPage = 15 } = req.query;

    const take = parseInt(perPage);
    const skip = (parseInt(page) - 1) * take;

    let where = undefined;
    if (alphabet) {
      where = {
        name: {
          startsWith: alphabet[0],
          mode: "insensitive",
        },
      };
    } else if (search) {
      where = {
        OR: ["name", "email", "organization", "title", "telegramUsername"].map(
          (field) => ({
            [field]: {
              contains: search,
              mode: "insensitive",
            },
          })
        ),
      };
    }

    // Fetch users with pagination
    const users = await db.users.findMany({
      where,
      skip,
      take,
    });

    // Count total users that match the query
    const totalUsers = await db.users.count({ where });

    res.status(200).json({
      currentPage: parseInt(page),
      perPage: take,
      totalUsers,
      totalPages: Math.ceil(totalUsers / take),
      users,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
