import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

import prisma from "../lib/prisma";

import Layout from "../components/Layout";
import { ExerciseForm } from "../components/ExerciseForm";

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

  try {
    const { sets } = await prisma.user.findUnique({
      where: {
        email: session.user.email,
        // TODO: get only sets for current day
      },
      select: {
        sets: true,
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
          <ExerciseForm onAddNewSet={handleAddNewSet} />
        </main>
      </div>
    </Layout>
  );
};

export default Workout;
