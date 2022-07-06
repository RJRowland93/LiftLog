import prisma from "./prisma";
import { formatDate, getToday, getTomorrow } from "../dayjs";

export async function querySetsBetweenDateRange(email, options = {}) {
  const defaultOptions = {
    dateStart: getToday(),
    dateEnd: getTomorrow(),
    exercises: ["Bench", "Squat", "Deadlift", "OHP"],
  };

  const { dateStart, dateEnd, exercises } = { ...defaultOptions, ...options };

  const { sets } = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      sets: {
        where: {
          ...((dateStart || dateEnd) && {
            createdAt: {
              ...(dateStart && { gte: dateStart }),
              ...(dateEnd && { lte: dateEnd }),
            },
          }),
          ...(exercises && {
            exercise: {
              in: Array.isArray(exercises) ? exercises : [exercises],
            },
          }),
        },
        select: {
          id: true,
          exercise: true,
          weight: true,
          reps: true,
          createdAt: true,
        },
      },
    },
  });
  // TODO: how to serialize datetimes?
  sets.forEach((set) => {
    const d = formatDate(set.createdAt);
    set.createdAt = d;
    // set.updatedAt = null;
  });

  return sets;
}
