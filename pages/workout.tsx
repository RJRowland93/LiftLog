import React from "react";
import type { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

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
    const sets = await fetch(`http://localhost:3000/api/sets`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // body: JSON.stringify(body),
    });
    console.log("SETS: ", sets);

    return {
      props: { sets },
    };
  } catch (e) {
    console.log(e);
  }
};

type Props = {
  sets: {
    exercise: string;
    weight: number;
    reps: number;
  };
};

const Blog: React.FC<Props> = (props) => {
  return (
    <Layout>
      <div className="page">
        <h1>Workout</h1>
        <main>
          {/* sets for today */}
          {/* {props.sets.map((set, i) => (
            <div key={`set-${i}`}>{set}</div>
          ))} */}
          {/* time since last set */}
          <ExerciseForm />
        </main>
      </div>
    </Layout>
  );
};

export default Blog;
