import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";
import { formatDate, getToday, getTomorrow } from "../../lib/dayjs";

// GET /api/sets?exercises=<exercise,...>&dateStart=<date>&dateEnd=<date>
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
    case "POST":
      const postResult = await handlePost(req, email);
      return res.json(postResult);
    case "PUT":
      const putResult = await handlePut(req, email);
      return res.json(putResult);

    case "DELETE":
      const deleteResult = await handleDelete(req, email);
      return res.json(deleteResult);

    default:
      return res.status(400).send({ message: `Unsupported: ${req.method}` });
  }
}

async function handlePost(req, email) {
  const { exercise, weight, reps } = req.body;
  const result = await prisma.set.create({
    data: {
      exercise,
      weight,
      reps,
      user: { connect: { email: email } },
    },
  });
  return result;
}

async function handlePut(req, email) {
  // TODO: only update if session user id and set id match
  const { setId, exercise, weight, reps } = req.body;
  const result = await prisma.set.update({
    where: { id: setId },
    data: { exercise, weight, reps },
  });

  return result;
}

async function handleDelete(req, email) {
  const { setId } = req.body;
  // TODO: only delete if session user id and set id match
  const result = await prisma.set.delete({
    where: { id: setId },
  });

  return result;
}

export async function querySetsForDateRange(
  email,
  range = [getToday(), getTomorrow()]
) {
  const [dateStart, dateEnd] = range;
  const { sets } = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      sets: { where: { createdAt: { gte: dateStart, lt: dateEnd } } },
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
