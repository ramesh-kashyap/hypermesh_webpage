import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import Api from "../Requests/Api";

const ChartComponent = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  // Fetch chart data from API
  const getChartData = async () => {
    try {
      const response = await Api.get("auth/get-chart-data");
      // Transform API response into the required format
      if (response.data.success) {
        const chartData = response.data.result.map((item) => ({
            date: new Date(item.date).toLocaleDateString("en-US", { day: "2-digit", month: "short" }),
            Commission: item.total_comm || 0, // Ensure a small value for empty days
          }));
          setData(chartData);  
      }
     
    } catch (err) {
      setError(err.response?.data?.error || "Error fetching chart data");
    }
  };

  useEffect(() => {
    getChartData();
  }, []);

  return (
    <div className="w-full h-72">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
        <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#666' }} />
        {/* <YAxis /> */}
        <Tooltip />
        <Bar dataKey="Commission" fill="#0093e9" />
      </BarChart>
    </ResponsiveContainer>
  </div>
  );
};

export default ChartComponent;
