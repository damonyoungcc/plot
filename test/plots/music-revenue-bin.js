import * as Plot from "@observablehq/plot";
import * as d3 from "d3";

export default async function () {
  const data = await d3.csv("data/riaa-us-revenue.csv", d3.autoType);
  const stack = {x: "year", y: "revenue", z: "format", order: "value", reverse: true};
  return Plot.plot({
    marginRight: 90,
    facet: {data, y: "group", marginRight: 90},
    y: {
      grid: true,
      label: "↑ Annual revenue (billions, adj.)",
      transform: (d) => d / 1000,
      nice: true
    },
    marks: [
      Plot.frame(),
      Plot.rectY(
        data,
        Plot.binX(
          {y: "sum"},
          {
            ...stack,
            y: (d) => -d.revenue,
            fill: "#eee",
            facet: "exclude"
          }
        )
      ),
      Plot.rectY(data, Plot.binX({y: "sum"}, {...stack, fill: "group", title: (d) => `${d.format}\n${d.group}`})),
      Plot.ruleY([0])
    ]
  });
}
