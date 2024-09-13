import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

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

  // Define colors for the pie chart slices
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

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
      <div className='chart-title'>
          <h4>Répartition des Indemnités par Personnel</h4>
        </div>

      <div className='charts'>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="indemnityCount"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}

export default Home;
