// import dayjs from "../lib/dayjs";

import { REPS_TO_1RM_PERC, STRENGTH_STANDARDS } from "./constants";

export function getExercises(workouts) {
  return [...new Set(workouts.map(({ exercise }) => exercise))];
}

// export function getDates(workouts) {
//   const first = dayjs(workouts[0].date, "YYYY-MM-DD");
//   console.log("first: ", first);
//   const today = dayjs();
//   const duration = Math.ceil(dayjs.duration(today.diff(first)).asDays());
//   const dates = [];
//   for (let i = 0; i < duration; i++) {
//     const what = first.add(i, "day").format("YYYY-MM-DD");
//     console.log(`what ${i}: `, what);
//     dates.push(what);
//   }
//   console.log("dates: ", dates);

//   return [...new Set(dates)];
//   // return [...new Set(workouts.map(({ date }) => date))];
// }

export function groupBy(prop, list) {
  return list.reduce((acc, cur) => {
    if (!acc[cur[prop]]) {
      acc[cur[prop]] = [];
    }
    acc[cur[prop]].push(cur);
    return acc;
  }, {});
}

export function groupWorkouts(workouts) {
  const groupedExercises = groupBy("exercise", workouts);
  for (const exercise in groupedExercises) {
    const groupedDates = groupBy("date", groupedExercises[exercise]);
    groupedExercises[exercise] = Object.entries(groupedDates);
  }
  return Object.entries(groupedExercises);
}

export function mapDataSet(fn, grouped) {
  return grouped.map(([exercise, workouts]) => {
    return [
      exercise,
      workouts.map(([date, sets]) => {
        return [date, fn(sets)];
      }),
    ];
  });
}

export function getExerciseChartColor(exercise) {
  switch (exercise) {
    case "squat":
      return {
        borderColor: "rgb(255, 51, 51)",
        backgroundColor: "rgba(255, 51, 51, 0.5)",
      };
    case "lunge":
      return {
        borderColor: "rgb(255, 153, 51)",
        backgroundColor: "rgba(255, 153, 51, 0.5)",
      };
    case "deadlift":
      return {
        borderColor: "rgb(255, 51, 255)",
        backgroundColor: "rgba(255, 51, 255, 0.5)",
      };
    case "rows":
      return {
        borderColor: "rgb(51, 51, 255)",
        backgroundColor: "rgba(51, 51, 255, 0.5)",
      };
    case "fl_rows":
      return {
        borderColor: "rgb(153, 51, 255)",
        backgroundColor: "rgba(153, 51, 255, 0.5)",
      };
    case "chins":
      return {
        borderColor: "rgb(51, 255, 255)",
        backgroundColor: "rgba(51, 255, 255, 0.5)",
      };
    case "pull_ups":
      return {
        borderColor: "rgb(51, 153, 255)",
        backgroundColor: "rgba(51, 153, 255, 0.5)",
      };
    case "ohp":
      return {
        borderColor: "rgb(51, 255, 51)",
        backgroundColor: "rgba(51, 255, 51, 0.5)",
      };
    case "hspu":
      return {
        borderColor: "rgb(153, 255, 51)",
        backgroundColor: "rgba(153, 255, 51, 0.5)",
      };
    case "incline_bench":
      return {
        borderColor: "rgb(255, 255, 51)",
        backgroundColor: "rgba(255, 255, 51, 0.5)",
      };
    case "dips":
      return {
        borderColor: "rgb(51, 255, 153)",
        backgroundColor: "rgba(51, 255, 153, 0.5)",
      };

    default:
      return {
        borderColor: "rgb(0, 0, 0)",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      };
  }
}

export function mapChartData(label) {
  return function ([exercise, calculations]) {
    const { borderColor, backgroundColor } = getExerciseChartColor(exercise);
    return {
      label: `${exercise}_${label}`,
      data: calculations.map(([date, result]) => ({
        x: date,
        y: result,
      })),
      borderColor,
      backgroundColor,
    };
  };
}

export function getChartData(
  workouts
  // rawWorkouts,
  // tartgetExercises = ["squat", "deadlift", "bench", "ohp", "incline_bench"]
) {
  // const tartgetExercisesSet = new Set(tartgetExercises);
  // const workouts = rawWorkouts.filter((workout) =>
  //   tartgetExercisesSet.has(workout.exercise)
  // );
  const grouped = groupWorkouts(workouts);

  const repMaxCalc = mapDataSet(calcMaxRep, grouped);
  const repMax = repMaxCalc.map(mapChartData("maxRep"));

  const volumeCalc = mapDataSet(calcVolume, grouped);
  const volume = volumeCalc.map(mapChartData("volume"));

  return { repMax, volume };
}

export function getMaxRep(reps, weight) {
  const perc = REPS_TO_1RM_PERC[reps] ?? 0.5;
  return weight / perc;
}

export function calcMaxRep(sets) {
  const calced = sets.map(({ reps, weight }) => getMaxRep(reps, weight));
  const max = Math.max(...calced);
  return max;
}

export function getVolume(reps, weight) {
  return reps * weight;
}

export function calcVolume(sets) {
  return sets.reduce(
    (vol, { reps, weight }) => vol + getVolume(reps, weight),
    0
  );
}

export function calcTotalReps(sets) {
  return sets.reduce((total, { reps }) => total + reps, 0);
}

export function getNextWeight(exercise, reps, weight) {
  function next(minReps, thresholdReps) {
    return reps < minReps
      ? weight * 0.9
        ? reps >= thresholdReps
        : (weight / REPS_TO_1RM_PERC[reps]) * REPS_TO_1RM_PERC[minReps]
      : weight;
  }
  switch (exercise) {
    case "deadlift":
    case "squat":
      return next(5, 8);
    default:
      return next(6, 10);
  }
}

export function getStrengthStandardChartColor(exercise) {
  switch (exercise) {
    case "squat":
      return {
        borderColor: "rgb(255, 51, 51, 0.25)",
        backgroundColor: "rgba(255, 51, 51, 0.25)",
      };
    case "deadlift":
      return {
        borderColor: "rgb(255, 51, 255, 0.25)",
        backgroundColor: "rgba(255, 51, 255, 0.25)",
      };
    case "ohp":
      return {
        borderColor: "rgb(51, 255, 51, 0.25)",
        backgroundColor: "rgba(51, 255, 51, 0.25)",
      };
    case "incline_bench":
      return {
        borderColor: "rgb(255, 255, 51, 0.25)",
        backgroundColor: "rgba(255, 255, 51, 0.25)",
      };
    default:
      return {
        borderColor: "rgb(0, 0, 0, 0.25)",
        backgroundColor: "rgba(0, 0, 0, 0.25)",
      };
  }
}

export function getStrengthStandards(exercises, dates) {
  const exercisesSet = new Set(exercises);
  return STRENGTH_STANDARDS.filter(([exercise]) =>
    exercisesSet.has(exercise)
  ).map(([exercise, weightClass, level, weight]) => {
    const { borderColor, backgroundColor } =
      getStrengthStandardChartColor(exercise);
    return {
      label: `${exercise}_${weightClass}_${level}`,
      data: dates.map((date) => ({
        x: date,
        y: weight,
      })),
      borderColor,
      backgroundColor,
    };
  });
}
