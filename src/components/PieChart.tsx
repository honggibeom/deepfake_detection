import { PieChart } from "@mui/x-charts/PieChart";
type chartData = {
  accuracy: number;
  width?: number;
  height?: number;
};
export default function BasicPie({
  accuracy,
  width = 400,
  height = 200,
}: chartData) {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: accuracy, label: "accuracy" },
            { id: 1, value: accuracy, label: "inaccuracy" },
          ],
        },
      ]}
      width={width}
      height={height}
    />
  );
}
