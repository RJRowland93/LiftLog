import React, { useEffect, useState } from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { Indicator } from "@mantine/core";
import { Calendar } from "@mantine/dates";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import prisma from "../lib/prisma";

import Layout from "../components/Layout";

dayjs.extend(relativeTime);

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

  // TODO: change this to midnight
  const startOfMOnth = dayjs().startOf("month").toISOString();

  try {
    const { sets } = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        sets: { where: { createdAt: { gte: startOfMOnth } } },
      },
    });

    // TODO: how to serialize datetimes?
    sets.forEach((set) => {
      set.createdAt = set.createdAt.toISOString();
      set.updatedAt = set.updatedAt.toISOString();
    });

    console.log(sets);
    return {
      props: { initialSets: sets },
    };
  } catch (e) {
    console.log(e);
  }
};

const WorkoutCalendar: React.FC = ({ initialSets }) => {
  const [value, setValue] = useState(null);
  const [month, onMonthChange] = useState(new Date());

  return (
    <Layout>
      <h1>Calendar</h1>
      {initialSets?.map(({ createdAt, exercise }) => (
        <div>{`${createdAt} ${exercise}`}</div>
      ))}
      <Calendar
        month={month}
        onMonthChange={onMonthChange}
        value={value}
        onChange={setValue}
        renderDay={(date) => {
          const day = date.getDate();
          return (
            <Indicator size={6} color="red" offset={8} disabled={day !== 16}>
              <div>{day}</div>
            </Indicator>
          );
        }}
      />
    </Layout>
  );
};

export default WorkoutCalendar;
