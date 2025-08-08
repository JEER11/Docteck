import { barChartDataDashboard, emotionLabels } from "./barChartData";

export const barChartOptionsDashboard = {
  chart: {
    toolbar: {
      show: false,
    },
  },
  tooltip: {
    y: {
      formatter: function (val, opts) {
        const idx = opts.dataPointIndex;
        return `${emotionLabels[idx]}: ${val}`;
      },
    },
    style: {
      fontSize: "12px",
      fontFamily: "Plus Jakarta Display",
    },
    theme: "dark",
  },
  plotOptions: {
    bar: {
      borderRadius: 8,
      columnWidth: "10px", // skinnier bars
      distributed: true,
      barHeight: '100%',
      dataLabels: {
        position: 'top',
      },
      barGap: 0.5, // more separation between bars
      barPadding: 12, // increase separation
    },
  },
  fill: {
    opacity: 0.35, // even more transparent
    colors: [
      "#A8E6CF", // pastel green
      "#FFD3B6", // pastel orange
      "#FFAAA5", // pastel red
      "#A0CED9", // pastel cyan
      "rgba(33,150,243,0.15)", // pastel transparent blue
      "rgba(33,150,243,0.08)", // pastel lighter transparent blue
      "#FFB5B5", // pastel pink
      "#D4F1F4", // pastel light blue
      "#D1C4E9", // pastel light purple
      "#FFF9B6"  // pastel yellow
    ],
  },
  xaxis: {
    categories: [], // Remove emotion labels from x-axis
    show: false,
    labels: {
      show: false,
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  yaxis: {
    show: true,
    color: "#fff",
    labels: {
      show: true,
      style: {
        colors: "#fff",
        fontSize: "10px",
        fontFamily: "Plus Jakarta Display",
      },
    },
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false, // remove colored/numbered blocks under the graph
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: "8px", // even skinnier on mobile
          },
        },
      },
    },
  ],
};
