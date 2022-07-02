import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { formatDate, getToday } from "../../lib/dayjs";

// GET /api/workouts?dateStart=<date>&dateEnd=<date>
export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).send({ message: "Unauthorized" });
  }

  const { email } = session.user;
  switch (req.method) {
    case "GET":
      const getResult = await handleGet(req, email);
      return res.json(getResult);

    default:
      return res.status(400).send({ message: `Unsupported: ${req.method}` });
  }
}

async function handleGet(req, email) {
  const today = getToday();
  const { dateStart = today, dateEnd = today } = req.query;
  const { sets } = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      sets: { where: { createdAt: { gte: dateStart, lte: dateEnd } } },
    },
  });

  // TODO: how to serialize datetimes?
  sets.forEach((set) => {
    const d = formatDate(set.createdAt);
    set.createdAt = d;
    set.updatedAt = null;
  });

  return sets;
}

function query() {}

function fetch() {}
