import React from "react";
import { AxisOptions, Chart } from "react-charts";

import useDemoConfig from "./useDemoConfig";

export function LineChart() {
  const { data, randomizeData } = useDemoConfig({
    series: 10,
    dataType: "time",
  });

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.primary as unknown as Date,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.secondary,
      },
    ],
    []
  );

  return (
    <>
      <button onClick={randomizeData}>Randomize Data</button>
      <br />
      <br />
      <Chart
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </>
  );
}