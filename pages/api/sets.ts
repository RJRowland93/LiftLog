import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

// GET /api/sets?exercises=<exercise,...>&dateStart=<date>&dateEnd=<date>
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const now = Date.now();
  const { dateStart = now, dateEnd = now } = req.query;
  // const exercises = req.query.exercises?.split(",");

  // return res.json({ message: `${req.method}`, dateStart, dateEnd, exercises });

  switch (req.method) {
    case "GET":
      const sets = await prisma.user.findUnique({
        where: {
          email: session.user.email,
        },
        select: {
          sets: true,
        },
      });
      console.log("SETS: ", sets);

      return res.json(sets);
    case "POST":
    case "PUT":
    case "DELETE":
      return res.json({ message: `${req.method}` });
    default:
      return res.status(400).send({ message: `Unsupported: ${req.method}` });
  }
}
