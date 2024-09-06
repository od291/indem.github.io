import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Home() {
  const [dashboardData, setDashboardData] = useState({
    totalPersonnels: 0,
    totalIndemnities: 0,
    totalIndemnityTypes: 0,
    totalAmount: 0
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/dashboard');
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/indemnity-types-per-personnel');
        setChartData(response.data);
        console.log('Fetched chart data:', response.data);
      } catch (error) {
        console.error('Error fetching chart data:', error);
      }
    };

    fetchDashboardData();
    fetchChartData();
  }, []);

  return (
    <main className='main-container'>
      <div className='main-title'>
        <h3>Tableau de bord</h3>
      </div>

      <div className='main-cards'>
        <div className='card'>
          <div className='card-inner'>
            <h3>PERSONNELS</h3>
          </div>
          <h1>{dashboardData.totalPersonnels}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>INDEMNITES</h3>
          </div>
          <h1>{dashboardData.totalIndemnities}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>TYPE D'INDEMNITES</h3>
          </div>
          <h1>{dashboardData.totalIndemnityTypes}</h1>
        </div>
        <div className='card'>
          <div className='card-inner'>
            <h3>MONTANT TOTAL VERSE</h3>
          </div>
          <h1>{dashboardData.totalAmount}</h1>
        </div>
      </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={chartData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="indemnityCount" fill="#8884d8" legendType="none"/>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
