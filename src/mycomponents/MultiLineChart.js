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
  const [zoomLevel, setZoomLevel] = useState(10); // Number of points to show (default is 10)
  const [panOffset, setPanOffset] = useState(0); // Offset for panning
  const [isDragging, setIsDragging] = useState(false); // State to track dragging

  const minPoints = 3; // Minimum visible points

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

    const totalPoints = data[0]?.data.length;
    const pointsToShow = Math.max(minPoints, Math.min(totalPoints, zoomLevel));

    // Calculate the visible data range based on panOffset and pointsToShow
    const rangeStart = Math.max(0, Math.floor(panOffset));
    const rangeEnd = Math.min(totalPoints, Math.ceil(panOffset + pointsToShow));

    const updatedData = data.map(series => ({
      ...series,
      data: series.data.slice(rangeStart, rangeEnd),
    }));

    setVisibleData(updatedData);
  }, [data, panOffset, zoomLevel, minPoints]);

  useEffect(() => {
    updateVisibleData();
  }, [updateVisibleData]);

  const handlePan = (direction) => {
    const pointsToShow = Math.max(minPoints, Math.min(data[0]?.data.length, zoomLevel));
    const panStep = direction === 'left' ? -1 : 1;

    setPanOffset(prevOffset => {
      const newOffset = Math.max(0, Math.min(data[0]?.data.length - pointsToShow, prevOffset + panStep));
      updateVisibleData();
      return newOffset;
    });
  };

  const handleZoom = (zoomDirection) => {
    setZoomLevel(prevZoom => {
      const newZoom = zoomDirection === 'in' 
        ? Math.max(minPoints, prevZoom - 1) 
        : Math.min(data[0]?.data.length, prevZoom + 1);

      setPanOffset(prevOffset => {
        const totalPoints = data[0]?.data.length;
        const pointsToShow = Math.max(minPoints, Math.min(totalPoints, newZoom));

        // Adjust panOffset to ensure it stays within bounds
        const newOffset = Math.min(prevOffset, totalPoints - pointsToShow);
        
        updateVisibleData();
        return newOffset;
      });

      return newZoom;
    });
  };

  const handleWheel = (event) => {
    event.preventDefault(); // Prevent default scroll behavior

    // Determine zoom direction based on scroll direction
    const zoomDirection = event.deltaY < 0 ? 'in' : 'out';
    handleZoom(zoomDirection);
  };

  const handleMouseDown = (event) => {
    setIsDragging(true);
  };

  const handleMouseMove = (event) => {
    if (isDragging) {
      const dx = event.movementX;
      handlePan(dx > 0 ? 'right' : 'left');
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
      <button onClick={() => handlePan('left')}>Pan Left</button>
      <button onClick={() => handlePan('right')}>Pan Right</button>
      <button onClick={() => handleZoom('in')}>Zoom In</button>
      <button onClick={() => handleZoom('out')}>Zoom Out</button>
    </div>
  );
};

export default MultiLineChart;