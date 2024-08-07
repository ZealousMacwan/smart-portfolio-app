import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import MultiLineChart from './mycomponents/MultiLineChart';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/totalholding/all?angelUserId=IICC19462', {
          headers: {
            'Content-Type': 'application/json',
            // Remove unnecessary headers
          }
        });
        
        const transformedData = response.data.map(item => ({
          name: item.createdAt,
          holdingValue: item.totalholdingvalue,
          profitAndLoss: item.totalprofitandloss,
          pnlPercentage: item.totalpnlpercentage,
          invValue: item.totalinvvalue,
        }));
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
    <div className="App">
      <MultiLineChart data={data} />
    </div>
  );
}

export default App;
