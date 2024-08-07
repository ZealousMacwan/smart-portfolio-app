import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MultiLineChart = ({ data }) => {
  return (
    <LineChart width={600} height={400} data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="holdingValue" stroke="#8884d8" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="profitAndLoss" stroke="#82ca9d" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="pnlPercentage" stroke="#ff7300" activeDot={{ r: 8 }} />
      <Line type="monotone" dataKey="invValue" stroke="#387908" activeDot={{ r: 8 }} />
    </LineChart>
  );
};

export default MultiLineChart;
