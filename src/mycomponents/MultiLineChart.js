import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { ResponsiveLine } from '@nivo/line';
import { format } from 'date-fns';
import './MultiLineChart.css'; // Ensure this CSS file exists and is correctly styled

const MultiLineChart = () => {
  const [data, setData] = useState([]);
  const [visibleData, setVisibleData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1); // 1 = no zoom
  const [panOffset, setPanOffset] = useState(0); // Offset for panning
  const [isDragging, setIsDragging] = useState(false); // State to track dragging

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
        setVisibleData(transformedData); // Initially, show all data
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error); // Log error
        setError(error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateVisibleData = useCallback(() => {
    if (data.length === 0) return;

    // Calculate visible data based on panOffset and zoomLevel
    const rangeStart = Math.max(0, Math.floor(panOffset / zoomLevel));
    const rangeEnd = Math.min(data[0]?.data.length, Math.ceil((panOffset + 1000) / zoomLevel)); // Adjust based on width of chart

    const updatedData = data.map(series => ({
      ...series,
      data: series.data.slice(rangeStart, rangeEnd),
    }));

    setVisibleData(updatedData);
  }, [data, panOffset, zoomLevel]);

  useEffect(() => {
    updateVisibleData();
  }, [updateVisibleData]);

  const handlePan = (dx) => {
    setPanOffset(prevOffset => {
      const newOffset = prevOffset - dx; // Inverse direction for panning
      updateVisibleData();
      return newOffset;
    });
  };

  const handleZoom = (zoomFactor) => {
    setZoomLevel(prevZoom => {
      const newZoom = Math.max(1, prevZoom * zoomFactor);
      updateVisibleData();
      return newZoom;
    });
  };

  const handleWheel = (event) => {
    event.preventDefault(); // Prevent default scroll behavior

    // Determine zoom direction based on scroll direction
    const zoomFactor = event.deltaY < 0 ? 1.2 : 0.8;
    handleZoom(zoomFactor);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = event.movementX;
      handlePan(dx);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div
      className="chart-container"
      style={{ height: '500px', width: '100%' }}
      onMouseDown={handleMouseDown} // Start dragging
    >
      <ResponsiveLine
        data={visibleData}
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
      {/* Add controls for panning and zooming */}
      <button onClick={() => handlePan(-100)}>Pan Left</button>
      <button onClick={() => handlePan(100)}>Pan Right</button>
      <button onClick={() => handleZoom(1.2)}>Zoom In</button>
      <button onClick={() => handleZoom(0.8)}>Zoom Out</button>
    </div>
  );
};

export default MultiLineChart;