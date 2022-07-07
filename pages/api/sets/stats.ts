import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

import { querySetsBetweenDateRange } from "../../../lib/prisma";
import { getChartData } from "../../../utils/calculations";

// GET /api/sets/calculations?exercises=<exercise,...>&dateStart=<date>&dateEnd=<date>
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
      const gettResult = await handleGet(req, email);
      return res.json(gettResult);

    default:
      return res.status(400).send({ message: `Unsupported: ${req.method}` });
  }
}

async function handleGet(req, email) {
  const { dateStart, dateEnd, exercises } = req.query;
  const result = await querySetsBetweenDateRange(email, {
    dateStart,
    dateEnd,
    exercises,
  });

  const data = getChartData(result);

  return data;
}
