import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const data = [
  {
    name: 'Page A',
    uv: 400,
    pv: 2900,
    amt: 2400,
  },
  {
    name: 'Page B',
    uv: 300,
    pv: 1398,
    amt: 2210,
  },
  {
    name: 'Page C',
    uv: 200,
    pv: 9800,
    amt: 2290,
  },
  {
    name: 'Page D',
    uv: 278,
    pv: 3908,
    amt: 2000,
  },
  {
    name: 'Page E',
    uv: 189,
    pv: 4800,
    amt: 2181,
  },
  {
    name: 'Page F',
    uv: 239,
    pv: 3800,
    amt: 2500,
  },
  {
    name: 'Page G',
    uv: 349,
    pv: 4300,
    amt: 2100,
  },
];

const MultiLineChart = () => {
  return (
    <LineChart width={400} height={300} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="uv" stroke="#82ca9d" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default MultiLineChart;
