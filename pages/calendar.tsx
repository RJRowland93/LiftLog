import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";

import prisma from "../lib/prisma";
import dayjs, { getStartOfMonth } from "../lib/dayjs";

import Layout from "../components/Layout";
import { ExerciseTable } from "../components/ExerciseTable";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        status: 403,
        permanent: false,
      },
    };
  }

  const startOfMOnth = getStartOfMonth();

  try {
    const { sets } = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        sets: { where: { createdAt: { gte: startOfMOnth } } },
      },
    });

    const formattedDates = sets.map(({ createdAt }) =>
      dayjs(createdAt.toISOString()).date()
    );

    const initialDates = [...new Set(formattedDates)];

    return {
      props: { initialDates },
    };
  } catch (e) {
    console.log(e);
  }
};

const WorkoutCalendar: React.FC = ({ initialDates }) => {
  const [currentDate, setCurrentDate] = useState(null);
  const [month, onMonthChange] = useState(new Date());

  const workoutDates = new Set(initialDates);

  const handleChange = (date) => {
    setCurrentDate(date);
  };

  return (
    <Layout>
      <h1>Calendar</h1>
      <div>{JSON.stringify(currentDate)}</div>
      {/* <div>{currentDate}</div> */}
      {/* <div>{month}</div> */}
      <Calendar
        month={month}
        onMonthChange={onMonthChange}
        value={currentDate}
        onChange={handleChange}
        renderDay={(date) => {
          const day = date.getDate();
          const isDisabled = !workoutDates.has(day);
          return (
            <Indicator size={6} color="red" offset={8} disabled={isDisabled}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
      {currentDate && <ExerciseTable data={[]} />}
    </Layout>
  );
};

export default WorkoutCalendar;
