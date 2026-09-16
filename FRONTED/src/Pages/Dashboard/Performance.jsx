import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { day: "Sep 5", score: 45, average: 28 },
  { day: "Sep 6", score: 55, average: 31 },
  { day: "Sep 7", score: 43, average: 32 },
  { day: "Sep 8", score: 59, average: 38 },
  { day: "Sep 9", score: 62, average: 46 },
  { day: "Sep 10", score: 55, average: 38 },
  { day: "Sep 11", score: 68, average: 49 },
];

function Performance() {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 w-130 h-[200px] mt-3 ml-2">

      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">
          Performance Overview
        </h2>

        <button className="border border-gray-300 rounded-lg px-3 py-2 text-xs">
          Last 7 Days ▾
        </button>
      </div>

      {/* Legend */}
      <div className="flex gap-5 text-xs mb-2">
        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-purple-500"></span>
          Your Score
        </span>

        <span className="flex items-center gap-1">
          <span className="w-3 h-3 rounded-full bg-blue-300"></span>
          Industry Avg
        </span>
      </div>

      {/* Graph */}
      <div className="h-[150px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 10,
              left: -15,
              bottom: 0,
            }}
          >
            <CartesianGrid stroke="#eee" />

            <XAxis
              dataKey="day"
              tick={{ fontSize: 10 }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              domain={[0, 100]}
              ticks={[0, 20, 40, 60, 80, 100]}
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />

            {/* Your Score */}
            <Line
              type="monotone"
              dataKey="score"
              stroke="#6D28D9"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />

            {/* Industry Average */}
            <Line
              type="monotone"
              dataKey="average"
              stroke="#AFC7E8"
              strokeWidth={2}
              dot={{ r: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
}

export default Performance;