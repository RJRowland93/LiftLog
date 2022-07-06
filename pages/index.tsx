import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";

import { querySetsBetweenDateRange } from "../lib/prisma";
import { getTimeToNow } from "../lib/dayjs";
import { authProtected } from "../lib/next-auth";

import Layout from "../components/Layout";
import { ExerciseForm } from "../components/ExerciseForm";
import { ExerciseTable } from "../components/ExerciseTable";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  return authProtected(req, async (session) => {
    try {
      const sets = await querySetsBetweenDateRange(session.user.email);

      return {
        props: { initialSets: sets },
      };
    } catch (e) {
      console.log(e);
    }
  });
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

function useSetsCrud(initialSets) {
  const [currentSets, setCurrentSets] = useState(initialSets);

  function handleSetCreate(result) {
    const updated = currentSets.concat(result);

    setCurrentSets(updated);
  }

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

  return {
    currentSets,
    handleSetCreate,
    handleSetUpdate,
    handleSetDelete,
  };
}

function useTimeSince(start) {
  const [timesince, setTimesince] = useState(start);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const diff = getTimeToNow(start);
      setTimesince(diff);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [start]);

  return timesince;
}

export const Workout: React.FC<Props> = ({ initialSets }) => {
  const { currentSets, handleSetCreate, handleSetUpdate, handleSetDelete } =
    useSetsCrud(initialSets);

  const latest = currentSets[currentSets.length - 1]?.createdAt;
  const timesince = useTimeSince(latest);

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
