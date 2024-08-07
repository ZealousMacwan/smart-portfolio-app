import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';
import { format } from 'date-fns';
import './MultiLineChart.css'; // Add this import for CSS

const MultiLineChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/totalholding/all', {
          params: { angelUserId: 'IICC19462' }
        });

        // Transform data to fit Nivo format and format dates
        const transformedData = [
          {
            id: 'Total Holding Value',
            data: response.data.map(item => ({
              x: format(new Date(item.createdAt), 'yyyy-MM-dd'),
              y: item.totalholdingvalue,
            })),
          },
          {
            id: 'Total Profit and Loss',
            data: response.data.map(item => ({
              x: format(new Date(item.createdAt), 'yyyy-MM-dd'),
              y: item.totalprofitandloss,
            })),
          },
          {
            id: 'Total PnL Percentage',
            data: response.data.map(item => ({
              x: format(new Date(item.createdAt), 'yyyy-MM-dd'),
              y: item.totalpnlpercentage,
            })),
          },
          {
            id: 'Total Investment Value',
            data: response.data.map(item => ({
              x: format(new Date(item.createdAt), 'yyyy-MM-dd'),
              y: item.totalinvvalue,
            })),
          },
        ];

        setData(transformedData);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="chart-container">
      <ResponsiveLine
        data={data}
        margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{
          type: 'linear',
          min: 'auto',
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          orient: 'bottom',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Time',
          legendOffset: 36,
          legendPosition: 'middle'
        }}
        axisLeft={{
          orient: 'left',
          tickSize: 5,
          tickPadding: 5,
          tickRotation: 0,
          legend: 'Value',
          legendOffset: -40,
          legendPosition: 'middle'
        }}
        colors={{ scheme: 'nivo' }}
        pointSize={10}
        pointColor={{ theme: 'background' }}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        pointLabelYOffset={-12}
        useMesh={true}
        legends={[
          {
            anchor: 'bottom-right',
            direction: 'column',
            justify: false,
            translateX: 100,
            translateY: 0,
            itemsSpacing: 0,
            itemDirection: 'left-to-right',
            itemWidth: 80,
            itemHeight: 20,
            itemOpacity: 0.75,
            symbolSize: 12,
            symbolShape: 'circle',
            symbolBorderColor: 'rgba(0, 0, 0, .5)',
            effects: [
              {
                on: 'hover',
                style: {
                  itemBackground: 'rgba(0, 0, 0, .03)',
                  itemOpacity: 1
                }
              }
            ],
            toggleSerie: true
          }
        ]}
      />
    </div>
  );
};

export default MultiLineChart;
