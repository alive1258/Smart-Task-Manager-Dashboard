"use client";

import dynamic from "next/dynamic";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Male Students", value: 2000 },
  { name: "Female Students", value: 1800 },
];

const COLORS = ["#4299E1", "#F6AD55"];

const Students = () => (
  <>
    <div className="bg-primary-base box px-1 py-2 rounded-lg w-full">
      <div className="z-50 p-2 w-full">
        <h3 className="text-[22px]  text-white">Students</h3>
        <div className="flex flex-col items-center">
          <div
            className="w-full"
            style={{ textAlign: "center", color: "#fff" }}
          >
            <ResponsiveContainer width="100%" height={300}>
              <PieChart width={310} height={300}>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  startAngle={90}
                  endAngle={450}
                  paddingAngle={0}
                  dataKey="value"
                  stroke="none"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center mb-[34px]">
            <div className=" max-w-xs rounded ">
              <div className="w-full bg-gray-700 rounded h-1">
                <div
                  className="bg-[#5497FA] h-1 rounded"
                  style={{ width: "60%" }}
                ></div>
                <div>
                  <span className="text-xs text-secondary-base">
                    Male Students{" "}
                  </span>
                  <p className="text-base text-primary-muted font-medium">
                    2000
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 max-w-xs rounded ">
              <div className="w-full bg-gray-700 rounded h-1">
                <div
                  className="bg-[#FFB554] h-1 rounded"
                  style={{ width: "40%" }}
                ></div>
                <div>
                  <span className="text-xs text-secondary-base">
                    Female Students{" "}
                  </span>
                  <p className="text-base text-primary-muted font-medium">
                    1800
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);

// export default Students;
export default dynamic(() => Promise.resolve(Students), { ssr: false });
