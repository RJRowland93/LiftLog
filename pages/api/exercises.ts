import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../lib/prisma";

// GET /api/exercises?exercise=[bench,squat,ohp]&dateStart=<date>&dateEnd=<date>
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
