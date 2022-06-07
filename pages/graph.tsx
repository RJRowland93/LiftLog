import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import { LineChart } from "../components/LineChart";
// import { BarChart } from "../components/BarChart";

import Layout from "../components/Layout";

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

  return { props: {} };

  // const drafts = await prisma.post.findMany({
  //   where: {
  //     author: { email: session.user.email },
  //     published: false,
  //   },
  //   include: {
  //     author: {
  //       select: { name: true },
  //     },
  //   },
  // });
  // return {
  //   props: { drafts },
  // };
};

const Graphs: React.FC = () => {
  return (
    <Layout>
      <h1>Graphs</h1>
      <div style={{ width: 400, height: 400 }}>
        <LineChart />
      </div>
      {/* <BarChart /> */}
    </Layout>
  );
};

export default Graphs;
