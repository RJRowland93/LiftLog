import React, { useState } from "react";
import { GetServerSideProps } from "next";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";

import dayjs, { getStartOfMonth, getStartOfNextMonth } from "../lib/dayjs";
import { authProtected } from "../services/utils/auth";

import Layout from "../components/Layout";
import { ExerciseTable } from "../components/ExerciseTable";
import { querySetsBetweenDateRange } from "./api/sets";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return authProtected(req, async (session) => {
    const startOfMOnth = getStartOfMonth();
    const nextMonth = getStartOfNextMonth();

    try {
      const sets = await querySetsBetweenDateRange(session.user.email, [
        startOfMOnth,
        nextMonth,
      ]);

      const { dateSets, uniqueDates } = sets.reduce(
        (acc, set) => {
          const date = dayjs(set.createdAt).get("date");
          acc.uniqueDates.push(date);

          if (acc.dateSets[date]) {
            acc.dateSets[date].push(set);
          } else {
            acc.dateSets[date] = [set];
          }

          return acc;
        },
        { dateSets: {}, uniqueDates: [] }
      );

      const formattedDates = sets.map(({ createdAt }) =>
        dayjs(createdAt).get("date")
      );

      const initialDates = [...new Set(uniqueDates)];

      return {
        props: { sets: dateSets, initialDates },
      };
    } catch (e) {
      console.log(e);
    }
  });
};

const WorkoutCalendar: React.FC = ({ sets = [], initialDates = [] }) => {
  const [selectedDate, setSelectedDate] = useState(
    sets[initialDates[initialDates.length - 1]]?.createdAt
  );
  const [month, onMonthChange] = useState(new Date());

  const workoutDates = new Set(initialDates);

  const handleChange = (date) => {
    setSelectedDate(date);
  };

  const selectedSets = sets[dayjs(selectedDate).get("date")];

  return (
    <Layout>
      <h1>Calendar</h1>
      <Calendar
        month={month}
        onMonthChange={onMonthChange}
        value={selectedDate}
        onChange={handleChange}
        renderDay={(date) => {
          const day = dayjs(date).get("date");
          const isDisabled = !workoutDates.has(day);
          return (
            <Indicator size={6} color="red" offset={8} disabled={isDisabled}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
      {selectedSets && <ExerciseTable data={selectedSets} />}
    </Layout>
  );
};

export default WorkoutCalendar;
