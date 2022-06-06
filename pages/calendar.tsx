import React from "react";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

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
};

const Calendar: React.FC = () => {
  return (
    <Layout>
      <h1>Calendar</h1>
    </Layout>
  );
};

export default Calendar;
