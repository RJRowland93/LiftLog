import {
  getExercises,
  groupBy,
  groupWorkouts,
  mapDataSet,
  mapChartData,
  getChartData,
  calcMaxRep,
  calcVolume,
  getNextWeight,
  getStrengthStandards,
} from "./calculations";

const workoutsJSON = {};
const workouts = [];

describe("calculations", () => {
  it("groupBy", () => {
    const result = groupBy("exercise", [
      { exercise: "deadlift" },
      { exercise: "squat" },
      { exercise: "bench" },
    ]);

    expect(result).toEqual({
      bench: [{ exercise: "bench" /* date, weight, reps */ }],
      deadlift: [{ exercise: "deadlift" }],
      squat: [{ exercise: "squat" }],
    });
  });

  it.each([["deadlift", 4, 100, 90]])(
    "getNextWeight",
    (exercise, reps, weight, nextWeight) => {
      const result = getNextWeight(exercise, reps, weight);
      expect(result).toEqual(90);
    }
  );

  it("getExercises", () => {
    const result = getExercises(workoutsJSON);
    expect(result).toEqual([
      "squat",
      "deadlift",
      "ohp",
      "chins",
      "hspu",
      "incline_bench",
      "rows",
      "pull_ups",
      "lunge",
      "dips",
      "fl_rows",
    ]);
  });

  it("groupWorkouts", () => {
    const result = groupWorkouts(workouts.slice(0, 10));
    expect(result).toEqual([
      [
        "squat",
        [
          [
            "2021-12-30",
            [
              {
                date: "2021-12-30",
                exercise: "squat",
                reps: "5",
                weight: "225",
              },
              {
                date: "2021-12-30",
                exercise: "squat",
                reps: "5",
                weight: "225",
              },
              {
                date: "2021-12-30",
                exercise: "squat",
                reps: "5",
                weight: "225",
              },
            ],
          ],
        ],
      ],
      [
        "deadlift",
        [
          [
            "2021-12-30",
            [
              {
                date: "2021-12-30",
                exercise: "deadlift",
                reps: "5",
                weight: "225",
              },
              {
                date: "2021-12-30",
                exercise: "deadlift",
                reps: "5",
                weight: "225",
              },
              {
                date: "2021-12-30",
                exercise: "deadlift",
                reps: "5",
                weight: "225",
              },
            ],
          ],
        ],
      ],
      [
        "ohp",
        [
          [
            "2022-01-02",
            [
              { date: "2022-01-02", exercise: "ohp", reps: "5", weight: "105" },
              { date: "2022-01-02", exercise: "ohp", reps: "5", weight: "105" },
              { date: "2022-01-02", exercise: "ohp", reps: "5", weight: "105" },
            ],
          ],
        ],
      ],
      [
        "chins",
        [
          [
            "2022-01-02",
            [
              {
                date: "2022-01-02",
                exercise: "chins",
                reps: "5",
                weight: "205",
              },
            ],
          ],
        ],
      ],
    ]);
  });

  it("calcMaxRep", () => {
    const result = calcMaxRep([
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "8",
        weight: "225",
      },
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "6",
        weight: "225",
      },
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "5",
        weight: "225",
      },
    ]);

    expect(result).toEqual(277.77777777777777);
  });

  it("calcVolume", () => {
    const result = calcVolume([
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "8",
        weight: "225",
      },
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "6",
        weight: "225",
      },
      {
        date: "2021-12-30",
        exercise: "squat",
        reps: "5",
        weight: "225",
      },
    ]);

    expect(result).toEqual(4275);
  });

  // it('getNextWeigth', () => {})

  it("mapDataSet", () => {
    const grouped = groupWorkouts(workouts);

    const maxes = mapDataSet(calcMaxRep, grouped);
    expect(maxes).toEqual([
      ["squat", [["2021-12-30", 252.80898876404493]]],
      ["deadlift", [["2021-12-30", 252.80898876404493]]],
      ["ohp", [["2022-01-02", 117.97752808988764]]],
      ["chins", [["2022-01-02", 230.3370786516854]]],
    ]);

    const volume = mapDataSet(calcVolume, grouped);
    expect(volume).toEqual([
      ["squat", [["2021-12-30", 3375]]],
      ["deadlift", [["2021-12-30", 3375]]],
      ["ohp", [["2022-01-02", 1575]]],
      ["chins", [["2022-01-02", 1025]]],
    ]);
  });

  it("mapCharData", () => {
    const grouped = groupWorkouts(workouts);

    const repMaxCalc = mapDataSet(calcMaxRep, grouped);
    const repMax = repMaxCalc.map(mapChartData("maxRep"));

    expect(repMax).toEqual([
      {
        backgroundColor: "rgba(255, 51, 51, 0.5)",
        borderColor: "rgb(255, 51, 51)",
        data: [{ x: "2021-12-30", y: 252.80898876404493 }],
        label: "squat_maxRep",
      },
      {
        backgroundColor: "rgba(255, 51, 255, 0.5)",
        borderColor: "rgb(255, 51, 255)",
        data: [{ x: "2021-12-30", y: 252.80898876404493 }],
        label: "deadlift_maxRep",
      },
      {
        backgroundColor: "rgba(51, 255, 51, 0.5)",
        borderColor: "rgb(51, 255, 51)",
        data: [{ x: "2022-01-02", y: 117.97752808988764 }],
        label: "ohp_maxRep",
      },
      {
        backgroundColor: "rgba(51, 255, 255, 0.5)",
        borderColor: "rgb(51, 255, 255)",
        data: [{ x: "2022-01-02", y: 230.3370786516854 }],
        label: "chins_maxRep",
      },
    ]);

    const volumeCalc = mapDataSet(calcVolume, grouped);
    const volume = volumeCalc.map(mapChartData("volume"));

    expect(volume).toEqual([
      {
        backgroundColor: "rgba(255, 51, 51, 0.5)",
        borderColor: "rgb(255, 51, 51)",
        data: [{ x: "2021-12-30", y: 3375 }],
        label: "squat_volume",
      },
      {
        backgroundColor: "rgba(255, 51, 255, 0.5)",
        borderColor: "rgb(255, 51, 255)",
        data: [{ x: "2021-12-30", y: 3375 }],
        label: "deadlift_volume",
      },
      {
        backgroundColor: "rgba(51, 255, 51, 0.5)",
        borderColor: "rgb(51, 255, 51)",
        data: [{ x: "2022-01-02", y: 1575 }],
        label: "ohp_volume",
      },
      {
        backgroundColor: "rgba(51, 255, 255, 0.5)",
        borderColor: "rgb(51, 255, 255)",
        data: [{ x: "2022-01-02", y: 1025 }],
        label: "chins_volume",
      },
    ]);
  });

  it("getChartData", () => {
    const result = getChartData(workouts);

    expect(result).toEqual({
      repMax: [
        {
          backgroundColor: "rgba(255, 51, 51, 0.5)",
          borderColor: "rgb(255, 51, 51)",
          data: [{ x: "2021-12-30", y: 252.80898876404493 }],
          label: "squat_maxRep",
        },
        {
          backgroundColor: "rgba(255, 51, 255, 0.5)",
          borderColor: "rgb(255, 51, 255)",
          data: [{ x: "2021-12-30", y: 252.80898876404493 }],
          label: "deadlift_maxRep",
        },
        {
          backgroundColor: "rgba(51, 255, 51, 0.5)",
          borderColor: "rgb(51, 255, 51)",
          data: [{ x: "2022-01-02", y: 117.97752808988764 }],
          label: "ohp_maxRep",
        },
        {
          backgroundColor: "rgba(51, 255, 255, 0.5)",
          borderColor: "rgb(51, 255, 255)",
          data: [{ x: "2022-01-02", y: 230.3370786516854 }],
          label: "chins_maxRep",
        },
      ],
      volume: [
        {
          backgroundColor: "rgba(255, 51, 51, 0.5)",
          borderColor: "rgb(255, 51, 51)",
          data: [{ x: "2021-12-30", y: 3375 }],
          label: "squat_volume",
        },
        {
          backgroundColor: "rgba(255, 51, 255, 0.5)",
          borderColor: "rgb(255, 51, 255)",
          data: [{ x: "2021-12-30", y: 3375 }],
          label: "deadlift_volume",
        },
        {
          backgroundColor: "rgba(51, 255, 51, 0.5)",
          borderColor: "rgb(51, 255, 51)",
          data: [{ x: "2022-01-02", y: 1575 }],
          label: "ohp_volume",
        },
        {
          backgroundColor: "rgba(51, 255, 255, 0.5)",
          borderColor: "rgb(51, 255, 255)",
          data: [{ x: "2022-01-02", y: 1025 }],
          label: "chins_volume",
        },
      ],
    });
  });

  it("getStrengthStandards", () => {
    const result = getStrengthStandards(["2021-12-39", "2022-01-02"]);

    expect(result).toEqual(null);
  });
});
