import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import prisma from "../lib/prisma";
import { formatDate, getTimeToNow, getToday } from "../lib/dayjs";

import Layout from "../components/Layout";
import { ExerciseForm } from "../components/ExerciseForm";
import { ExerciseTable } from "../components/ExerciseTable";

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

  const today = getToday();

  try {
    const { sets } = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        sets: { where: { createdAt: { gte: today } } },
      },
    });

    // TODO: how to serialize datetimes?
    sets.forEach((set) => {
      const d = formatDate(set.createdAt);
      set.createdAt = d;
      set.updatedAt = null;
    });

    return {
      props: { initialSets: sets },
    };
  } catch (e) {
    console.log(e);
  }
};

type Set = {
  id: number;
  createdAt: string;
  exercise: string;
  weight: number;
  reps: number;
};

type Props = {
  initialSets: Set[];
};

export const Workout: React.FC<Props> = ({ initialSets }) => {
  const [currentSets, setCurrentSets] = useState(initialSets);
  const [timesince, setTimesince] = useState(
    initialSets[initialSets.length - 1]?.createdAt
  );

  const latest = currentSets[currentSets.length - 1]?.createdAt;
  useEffect(() => {
    const intervalId = setInterval(() => {
      const diff = getTimeToNow(latest);
      setTimesince(diff);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [latest]);

  const handleSetCreate = (result) => {
    const updated = currentSets.concat(result);

    setCurrentSets(updated);
  };

  function handleSetUpdate(update) {
    const updated = currentSets.reduce((sets, set) => {
      const next = set.id === update.id ? update : set;
      return sets.concat(next);
    }, []);

    setCurrentSets(updated);
  }

  function handleSetDelete(id) {
    const updated = currentSets.filter((set) => set.id !== id);

    setCurrentSets(updated);
  }

  return (
    <Layout>
      <div className="page">
        <h1>Workout</h1>
        <main>
          {/* sets for today */}
          <ExerciseTable
            data={currentSets}
            onSetUpdate={handleSetUpdate}
            onSetDelete={handleSetDelete}
          />

          {/* time since last set */}
          <div>{timesince}</div>

          <ExerciseForm onSetCreate={handleSetCreate} />
        </main>
      </div>
    </Layout>
  );
};

export default Workout;
