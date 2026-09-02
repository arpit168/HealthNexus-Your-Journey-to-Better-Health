import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ScatterChart,
  Scatter,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import { analyticsService } from "../../Services/analyticsService";
const Analytics = () => {
  const [dateRange, setDateRange] = useState("30days");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [weightAnalysisData, setWeightAnalysisData] = useState([]);
  const [workoutByDayData, setWorkoutByDayData] = useState([]);
  const [workoutTypesData, setWorkoutTypesData] = useState([]);
  const [nutritionData, setNutritionData] = useState([]);
  const [macroDistributionData, setMacroDistributionData] = useState([]);
  const [sleepWorkoutData, setSleepWorkoutData] = useState([]);
  const [dietWeightData, setDietWeightData] = useState([]);
  const [weightForecastData, setWeightForecastData] = useState([]);
  const [overviewStats, setOverviewStats] = useState({});
  const [weightAnalysis, setWeightAnalysis] = useState({});
  const [workoutPatterns, setWorkoutPatterns] = useState({});
  const [nutritionStats, setNutritionStats] = useState({});
  const [predictions, setPredictions] = useState({});
  const [heatMapData, setHeatMapData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await analyticsService.getAnalyticsData();
        if (data) {
          setWeightAnalysisData(data.weightAnalysisData || []);
          setWorkoutByDayData(data.workoutByDayData || []);
          setWorkoutTypesData(data.workoutTypesData || []);
          setNutritionData(data.nutritionData || []);
          setMacroDistributionData(data.macroDistributionData || []);
          setSleepWorkoutData(data.sleepWorkoutData || []);
          setDietWeightData(data.dietWeightData || []);
          setWeightForecastData(data.weightForecastData || []);
          setOverviewStats(data.overviewStats || {});
          setWeightAnalysis(data.weightAnalysis || {});
          setWorkoutPatterns(data.workoutPatterns || {});
          setNutritionStats(data.nutritionStats || {});
          setPredictions(data.predictions || {});
          setHeatMapData(data.heatMapData || []);
        }
      } catch (err) {
        console.error("Failed to load analytics data:", err);
        setError("Failed to load analytics data.");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  const COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b"];

  const handleDateRangeChange = (e) => {
    setDateRange(e.target.value);
  };

  const handleGenerateReport = async () => {
    try {
      await analyticsService.generateReport();
      alert("Report generated successfully!");
    } catch (err) {
      alert("Failed to generate report.");
    }
  };

  const getHeatMapColor = (intensity) => {
    const colors = ["#f3f4f6", "#bfdbfe", "#60a5fa", "#2563eb", "#1e40af"];
    return colors[intensity];
  };

  return (
    <DashboardLayout>
      <div className="analytics-page">
        {/* SECTION 1: PAGE HEADER */}
        <div className="page-header">
          <div className="header-left">
            <h1 className="page-title">Advanced Analytics</h1>
            <div className="date-range-selector">
              <select value={dateRange} onChange={handleDateRangeChange}>
                <option value="30days">Last 30 days</option>
                <option value="3months">Last 3 months</option>
                <option value="6months">Last 6 months</option>
                <option value="1year">Last 1 year</option>
              </select>
            </div>
          </div>
          <button className="btn btn-primary" onClick={handleGenerateReport}>
            Generate Report
          </button>
        </div>

        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "300px",
            }}
          >
            <span>Loading Analytics...</span>
          </div>
        ) : error ? (
          <div style={{ color: "red", padding: "20px" }}>{error}</div>
        ) : (
          <>
            {/* SECTION 2: OVERVIEW STATS */}
            <div className="overview-section">
              <div className="overview-stats">
                <div className="overview-card">
                  <div className="overview-icon">🏋️</div>
                  <div className="overview-content">
                    <span className="overview-label">Total Workouts</span>
                    <span className="overview-value">
                      {overviewStats.totalWorkouts}
                    </span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">🍽️</div>
                  <div className="overview-content">
                    <span className="overview-label">Total Meals Logged</span>
                    <span className="overview-value">
                      {overviewStats.totalMeals}
                    </span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">⚖️</div>
                  <div className="overview-content">
                    <span className="overview-label">Weight Change</span>
                    <span
                      className={`overview-value ${overviewStats.weightChange < 0 ? "positive" : "negative"}`}
                    >
                      {overviewStats.weightChange > 0 ? "+" : ""}
                      {overviewStats.weightChange} kg
                    </span>
                  </div>
                </div>
                <div className="overview-card">
                  <div className="overview-icon">⭐</div>
                  <div className="overview-content">
                    <span className="overview-label">Habit Score Average</span>
                    <span className="overview-value">
                      {overviewStats.habitScoreAvg}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 3: WEIGHT ANALYSIS */}
            <div className="analytics-section">
              <h2>Weight Analysis</h2>

              <div className="weight-analysis-stats">
                <div className="stat-item">
                  <span className="stat-label">Rate of Change</span>
                  <span className="stat-value">
                    {weightAnalysis.rateOfChange} kg/week
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Plateau Detection</span>
                  <span
                    className={`stat-value ${weightAnalysis.plateauDetected ? "alert" : "success"}`}
                  >
                    {weightAnalysis.plateauDetected
                      ? "Plateau Detected"
                      : "On Track"}
                  </span>
                </div>
              </div>

              <div className="chart-container">
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={weightAnalysisData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[80, 86]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="weight"
                      stroke="#4f46e5"
                      strokeWidth={2}
                      name="Actual Weight"
                    />
                    <Line
                      type="monotone"
                      dataKey="movingAvg"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="7-Day Moving Avg"
                    />
                    <Line
                      type="monotone"
                      dataKey="trend"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      name="Trend Line"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SECTION 4: WORKOUT PATTERNS */}
            <div className="analytics-section">
              <h2>Workout Patterns</h2>

              <div className="workout-pattern-stats">
                <div className="stat-item">
                  <span className="stat-label">Most Consistent Day</span>
                  <span className="stat-value">
                    {workoutPatterns.mostConsistent}
                  </span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Least Consistent Day</span>
                  <span className="stat-value">
                    {workoutPatterns.leastConsistent}
                  </span>
                </div>
              </div>

              <div className="dual-chart-grid">
                <div className="chart-container">
                  <h3>Workouts by Day of Week</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={workoutByDayData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="workouts" fill="#4f46e5" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Workout Types Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={workoutTypesData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {workoutTypesData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-container">
                <h3>Consistency Calendar (Heat Map)</h3>
                <div className="heatmap-container">
                  <div className="heatmap-grid">
                    {heatMapData.map((cell, idx) => (
                      <div
                        key={idx}
                        className="heatmap-cell"
                        style={{
                          backgroundColor: getHeatMapColor(cell.intensity),
                        }}
                        title={`Week ${cell.week + 1}, Day ${cell.day + 1}: Intensity ${cell.intensity}`}
                      />
                    ))}
                  </div>
                  <div className="heatmap-legend">
                    <span>Less</span>
                    <div className="legend-colors">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="legend-cell"
                          style={{ backgroundColor: getHeatMapColor(i) }}
                        />
                      ))}
                    </div>
                    <span>More</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 5: NUTRITION ANALYSIS */}
            <div className="analytics-section">
              <h2>Nutrition Analysis</h2>

              <div className="nutrition-stats">
                <div className="stat-item">
                  <span className="stat-label">Most Consistent Meal</span>
                  <span className="stat-value">
                    {nutritionStats.mostConsistentMeal}
                  </span>
                </div>
              </div>

              <div className="dual-chart-grid">
                <div className="chart-container">
                  <h3>Daily Macros Breakdown</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={nutritionData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar
                        dataKey="protein"
                        stackId="a"
                        fill="#ef4444"
                        name="Protein (g)"
                      />
                      <Bar
                        dataKey="carbs"
                        stackId="a"
                        fill="#3b82f6"
                        name="Carbs (g)"
                      />
                      <Bar
                        dataKey="fats"
                        stackId="a"
                        fill="#f59e0b"
                        name="Fats (g)"
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="chart-container">
                  <h3>Average Macro Distribution</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={macroDistributionData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {macroDistributionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="chart-container">
                <h3>Calorie Intake vs. Target</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={nutritionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[1900, 2200]} />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="targetCalories"
                      stroke="#94a3b8"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                    />
                    <Line
                      type="monotone"
                      dataKey="actualCalories"
                      stroke="#10b981"
                      strokeWidth={2}
                      name="Actual Intake"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* SECTION 6: CORRELATION INSIGHTS */}
            <div className="analytics-section correlation-section">
              <h2>What Affects Your Progress?</h2>

              <div className="dual-chart-grid">
                <div className="chart-container">
                  <h3>Sleep vs. Workout Performance</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="sleep" name="Sleep Hours" unit="h" />
                      <YAxis
                        dataKey="performance"
                        name="Performance"
                        unit="%"
                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter
                        name="Sleep Impact"
                        data={sleepWorkoutData}
                        fill="#4f46e5"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <p className="insight-text">
                    💡 Better sleep (7-8h) correlates with 90%+ performance
                  </p>
                </div>

                <div className="chart-container">
                  <h3>Diet Adherence vs. Weight Loss</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="adherence" name="Adherence" unit="%" />
                      <YAxis
                        dataKey="weightLoss"
                        name="Weight Loss"
                        unit="kg"
                      />
                      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                      <Scatter
                        name="Diet Impact"
                        data={dietWeightData}
                        fill="#10b981"
                      />
                    </ScatterChart>
                  </ResponsiveContainer>
                  <p className="insight-text">
                    💡 85%+ diet adherence yields optimal weight loss
                  </p>
                </div>
              </div>

              <div className="correlation-summary">
                <div className="correlation-card">
                  <h4>🌙 Sleep Quality</h4>
                  <p>
                    Strong positive correlation with workout performance (r =
                    0.89)
                  </p>
                </div>
                <div className="correlation-card">
                  <h4>🥗 Diet Adherence</h4>
                  <p>Direct impact on weight loss rate (r = 0.92)</p>
                </div>
                <div className="correlation-card">
                  <h4>⚡ Energy Levels</h4>
                  <p>Moderate correlation with workout completion (r = 0.76)</p>
                </div>
              </div>
            </div>

            {/* SECTION 7: TRENDS & PREDICTIONS */}
            <div className="analytics-section predictions-section">
              <h2>Trends & Predictions</h2>

              <div className="chart-container">
                <h3>Weight Forecast (Next 4 Weeks)</h3>
                <ResponsiveContainer width="100%" height={350}>
                  <ComposedChart data={weightForecastData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" />
                    <YAxis domain={[79, 83]} />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="upper"
                      fill="#e0e7ff"
                      stroke="none"
                      name="Confidence Range"
                    />
                    <Area
                      type="monotone"
                      dataKey="lower"
                      fill="#ffffff"
                      stroke="none"
                    />
                    <Line
                      type="monotone"
                      dataKey="actual"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      name="Actual"
                    />
                    <Line
                      type="monotone"
                      dataKey="forecast"
                      stroke="#10b981"
                      strokeWidth={3}
                      strokeDasharray="5 5"
                      name="Forecast"
                    />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>

              <div className="predictions-content">
                <div className="achievement-probability">
                  <div className="probability-circle">
                    <svg viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e5e7eb"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="10"
                        strokeDasharray={`${(predictions?.achievementProbability || 0) * 2.827} 282.7`}
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="probability-text">
                      <span className="probability-value">
                        {predictions?.achievementProbability || 0}%
                      </span>
                      <span className="probability-label">
                        Achievement Probability
                      </span>
                    </div>
                  </div>
                </div>

                <div className="recommendations">
                  <h3>Recommended Adjustments</h3>
                  <ul className="recommendations-list">
                    {predictions?.recommendedAdjustments?.map(
                      (adjustment, idx) => (
                        <li key={idx}>
                          <span className="recommendation-icon">✓</span>
                          {adjustment}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
              </div>
            </div>

            <style>{`
        .analytics-page {
          padding: 2rem;
          max-width: 1400px;
          margin: 0 auto;
          background: #f9fafb;
        }

        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: #111827;
          margin: 0;
        }

        .date-range-selector select {
          padding: 0.75rem 1rem;
          border: 2px solid #e5e7eb;
          border-radius: 8px;
          font-size: 0.95rem;
          font-weight: 500;
          cursor: pointer;
          background: white;
          color: #374151;
          transition: all 0.2s;
        }

        .date-range-selector select:hover {
          border-color: #4f46e5;
        }

        .date-range-selector select:focus {
          outline: none;
          border-color: #4f46e5;
          box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 0.95rem;
        }

        .btn-primary {
          background: #4f46e5;
          color: white;
        }

        .btn-primary:hover {
          background: #4338ca;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
        }

        .overview-section {
          margin-bottom: 2rem;
        }

        .overview-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
        }

        .overview-card {
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: transform 0.2s;
        }

        .overview-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .overview-icon {
          font-size: 2.5rem;
        }

        .overview-content {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .overview-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .overview-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #111827;
        }

        .overview-value.positive {
          color: #10b981;
        }

        .overview-value.negative {
          color: #ef4444;
        }

        .analytics-section {
          background: white;
          padding: 2rem;
          margin-bottom: 2rem;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .analytics-section h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
          margin: 0 0 1.5rem 0;
        }

        .analytics-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
          margin: 0 0 1rem 0;
        }

        .weight-analysis-stats,
        .workout-pattern-stats,
        .nutrition-stats {
          display: flex;
          gap: 2rem;
          margin-bottom: 1.5rem;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #111827;
        }

        .stat-value.success {
          color: #10b981;
        }

        .stat-value.alert {
          color: #ef4444;
        }

        .chart-container {
          background: #fafafa;
          padding: 1.5rem;
          border-radius: 8px;
          margin-bottom: 1rem;
        }

        .dual-chart-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
          margin-bottom: 1.5rem;
        }

        .heatmap-container {
          padding: 1rem;
        }

        .heatmap-grid {
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          gap: 4px;
          margin-bottom: 1rem;
        }

        .heatmap-cell {
          aspect-ratio: 1;
          border-radius: 3px;
          border: 1px solid #e5e7eb;
          transition: transform 0.2s;
          cursor: pointer;
        }

        .heatmap-cell:hover {
          transform: scale(1.1);
          border-color: #4f46e5;
        }

        .heatmap-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          font-size: 0.875rem;
          color: #6b7280;
        }

        .legend-colors {
          display: flex;
          gap: 3px;
        }

        .legend-cell {
          width: 16px;
          height: 16px;
          border-radius: 2px;
          border: 1px solid #e5e7eb;
        }

        .insight-text {
          margin-top: 0.75rem;
          padding: 0.75rem;
          background: #f0fdf4;
          border-left: 3px solid #10b981;
          border-radius: 4px;
          font-size: 0.875rem;
          color: #166534;
          font-weight: 500;
        }

        .correlation-section .correlation-summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .correlation-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 1.5rem;
          border-radius: 10px;
          color: white;
        }

        .correlation-card h4 {
          margin: 0 0 0.5rem 0;
          font-size: 1.125rem;
        }

        .correlation-card p {
          margin: 0;
          font-size: 0.875rem;
          opacity: 0.95;
        }

        .predictions-section .predictions-content {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 2rem;
          margin-top: 1.5rem;
        }

        .achievement-probability {
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .probability-circle {
          position: relative;
          width: 200px;
          height: 200px;
        }

        .probability-circle svg {
          width: 100%;
          height: 100%;
        }

        .probability-text {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
          display: flex;
          flex-direction: column;
        }

        .probability-value {
          font-size: 2.5rem;
          font-weight: 700;
          color: #10b981;
        }

        .probability-label {
          font-size: 0.75rem;
          color: #6b7280;
          font-weight: 500;
        }

        .recommendations {
          background: #f9fafb;
          padding: 1.5rem;
          border-radius: 8px;
        }

        .recommendations h3 {
          margin: 0 0 1rem 0;
          color: #111827;
        }

        .recommendations-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .recommendations-list li {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: white;
          border-radius: 6px;
          border-left: 3px solid #10b981;
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          font-size: 0.95rem;
          color: #374151;
        }

        .recommendation-icon {
          color: #10b981;
          font-weight: 700;
        }

        @media (max-width: 768px) {
          .analytics-page {
            padding: 1rem;
          }

          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }

          .header-left {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
            width: 100%;
          }

          .btn {
            width: 100%;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .analytics-section {
            padding: 1.5rem;
          }

          .dual-chart-grid {
            grid-template-columns: 1fr;
          }

          .predictions-content {
            grid-template-columns: 1fr !important;
          }

          .overview-stats {
            grid-template-columns: 1fr;
          }

          .overview-value {
            font-size: 1.5rem;
          }
        }
      `}</style>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Analytics;
