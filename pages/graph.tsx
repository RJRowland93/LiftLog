import React from "react";
import { GetServerSideProps } from "next";

import { querySetsBetweenDateRange } from "../lib/prisma";
import { authProtected } from "../lib/next-auth";
import { formatDate, getYearAgo } from "../lib/dayjs";

import Layout from "../components/Layout";
import { LineChart } from "../components/LineChart";
import { BarChart } from "../components/BarChart";

import { getChartData } from "../utils/calculations";

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  return authProtected(req, async (session) => {
    try {
      const yearAgo = getYearAgo();

      const result = await querySetsBetweenDateRange(session.user.email, {
        dateStart: yearAgo,
      });

      result.forEach((set) => (set.createdAt = formatDate(set.createdAt)));
      const data = getChartData(result);

      return { props: data };
    } catch (e) {
      console.log(e);
    }
  });
};

const Graphs: React.FC = ({ repMax, volume }) => {
  return (
    <Layout>
      <h1>Graphs</h1>
      <div style={{ width: 400, height: 400 }}>
        <LineChart data={repMax} />
      </div>
      <BarChart data={volume} />
    </Layout>
  );
};

export default Graphs;
