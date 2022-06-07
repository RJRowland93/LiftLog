import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import prisma from "../lib/prisma";

import Layout from "../components/Layout";
import { ExerciseForm } from "../components/ExerciseForm";

function getTimeDiff(datetime) {
  // TODO: fix diffing logic
  if (!datetime) {
    return "none";
  }

  const date = new Date(datetime).getTime();
  const now = new Date().getTime();
  const milisec_diff = now - date;
  const days = Math.floor(milisec_diff / 1000 / 60 / (60 * 24));
  const date_diff = new Date(milisec_diff);

  return (
    days +
    " Days " +
    date_diff.getHours() +
    " Hours " +
    date_diff.getMinutes() +
    " Minutes " +
    date_diff.getSeconds() +
    " Seconds"
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
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
  const today = Date.now();

  try {
    const { sets } = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        sets: { where: { createdAt: { gte: new Date(today) } } },
      },
    });

    // TODO: how to serialize datetimes?
    sets.forEach((set) => {
      set.createdAt = set.createdAt.toISOString();
      set.updatedAt = set.updatedAt.toISOString();
    });

    return {
      props: { initialSets: sets },
    };
  } catch (e) {
    console.log(e);
  }
};

type Props = {
  initialSets: [
    {
      updatedAt: string;
      exercise: string;
      weight: number;
      reps: number;
    }
  ];
};

export const Workout: React.FC<Props> = ({ initialSets }) => {
  const [sets, addSet] = useState(initialSets);
  const [timesince, setTimesince] = useState(
    initialSets[initialSets.length - 1]?.updatedAt
  );

  const latest = sets[sets.length - 1]?.updatedAt;
  useEffect(() => {
    const intervalId = setInterval(() => {
      const diff = getTimeDiff(latest);
      setTimesince(diff);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [latest]);

  const handleAddNewSet = (result) => {
    const newSets = [...sets, result];
    addSet(newSets);
  };

  return (
    <Layout>
      <div className="page">
        <h1>Workout</h1>
        <main>
          {/* sets for today */}
          <div>
            <span>Time</span>
            <span>Exercise</span>
            <span>Weight</span>
            <span>Reps</span>
          </div>
          {sets.map(({ updatedAt, exercise, weight, reps }, i) => (
            <div key={`set-${i}`}>
              <span>{updatedAt}</span>
              <span>{exercise}</span>
              <span>{weight}</span>
              <span>{reps}</span>
            </div>
          ))}

          {/* time since last set */}
          <div>{timesince}</div>

          <ExerciseForm onAddNewSet={handleAddNewSet} />
        </main>
      </div>
    </Layout>
  );
};

export default Workout;
