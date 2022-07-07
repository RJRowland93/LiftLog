import React from "react";
import { AxisOptions, Chart } from "react-charts";

import useDemoConfig from "./useDemoConfig";

export function LineChart({ data }) {
  // const { data, randomizeData } = useDemoConfig({
  //   series: 10,
  //   dataType: "time",
  // });

  const primaryAxis = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>
  >(
    () => ({
      getValue: (datum) => datum.x,
    }),
    []
  );

  const secondaryAxes = React.useMemo<
    AxisOptions<typeof data[number]["data"][number]>[]
  >(
    () => [
      {
        getValue: (datum) => datum.y,
      },
    ],
    []
  );

  return (
    <Chart
      options={{
        data,
        primaryAxis,
        secondaryAxes,
      }}
    />
  );
}
