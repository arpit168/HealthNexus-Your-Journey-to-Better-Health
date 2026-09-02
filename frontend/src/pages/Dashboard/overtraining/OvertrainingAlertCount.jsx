import { useState, useEffect } from "react";
import { overtrainingService } from "../../../Services/overtrainingService";

const OvertrainingAlertCount = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertStats, setAlertStats] = useState({
    total: 0,
    thisMonth: 0,
    thisWeek: 0,
    critical: 0,
    warning: 0,
  });
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    loadAlerts();
  }, []);

  const loadAlerts = async () => {
    try {
      const res = await overtrainingService.getOvertrainingData();
      const alertList = res.data?.alerts || [];
      setAlerts(alertList);
      calculateStats(alertList);
    } catch (err) {
      console.error(err);
      setAlerts([]);
      calculateStats([]);
    }
  };

  const calculateStats = (alertList) => {
    const today = new Date();
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(today.getFullYear(), today.getMonth(), 1);

    const thisWeek = alertList.filter((a) => new Date(a.date) > weekAgo).length;
    const thisMonth = alertList.filter(
      (a) => new Date(a.date) > monthAgo,
    ).length;
    const critical = alertList.filter((a) => a.severity === "critical").length;
    const warning = alertList.filter((a) => a.severity === "warning").length;

    setAlertStats({
      total: alertList.length,
      thisMonth,
      thisWeek,
      critical,
      warning,
    });

    // Process chart data by week
    const weekData = processWeeklyData(alertList);
    setChartData(weekData);
  };

  const processWeeklyData = (alertList) => {
    const weeks = {};
    alertList.forEach((alert) => {
      const date = new Date(alert.date);
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = { week: weekKey, total: 0, critical: 0, warning: 0 };
      }
      weeks[weekKey].total++;
      if (alert.severity === "critical") {
        weeks[weekKey].critical++;
      } else {
        weeks[weekKey].warning++;
      }
    });

    return Object.values(weeks)
      .sort((a, b) => new Date(a.week) - new Date(b.week))
      .slice(-12)
      .map((w) => ({
        ...w,
        week: new Date(w.week).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  };

  const handleResolve = async (id) => {
    const updated = alerts.map((a) =>
      a.id === id ? { ...a, resolved: true } : a,
    );
    setAlerts(updated);
    try {
      await overtrainingService.updateOvertrainingData({ alerts: updated });
    } catch (err) {
      console.error(err);
    }
  };

  const removeAlert = async (id) => {
    const updated = alerts.filter((a) => a.id !== id);
    setAlerts(updated);
    calculateStats(updated);
    try {
      await overtrainingService.updateData({ alerts: updated });
    } catch (err) {
      console.error(err);
    }
  };

  const clearAllAlerts = async () => {
    if (window.confirm("Are you sure you want to clear all alerts?")) {
      setAlerts([]);
      setAlertStats({
        total: 0,
        thisMonth: 0,
        thisWeek: 0,
        critical: 0,
        warning: 0,
      });
      try {
        await overtrainingService.updateData({ alerts: [] });
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addAlert = async () => {
    const alertTypes = [
      { type: "High Fatigue", desc: "Fatigue > 80%", severity: "critical" },
      {
        type: "Excessive Load",
        desc: "Weekly load > 400 units",
        severity: "warning",
      },
      {
        type: "Insufficient Rest",
        desc: "Rest days < 2/week",
        severity: "warning",
      },
    ];

    const selected = alertTypes[Math.floor(Math.random() * alertTypes.length)];
    const newAlert = {
      id: `alert-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      timestamp: new Date().toISOString(),
      ...selected,
      resolved: false,
      action: "Monitor",
    };

    const updated = [...alerts, newAlert];
    setAlerts(updated);
    calculateStats(updated);
    try {
      await overtrainingService.updateData({ alerts: updated });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-red-600">
          <p className="text-sm font-semibold text-gray-600">Total Alerts</p>
          <p className="text-4xl font-bold text-red-600 mt-2">
            {alertStats.total}
          </p>
          <p className="text-xs text-gray-500 mt-2">All time</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-orange-600">
          <p className="text-sm font-semibold text-gray-600">This Month</p>
          <p className="text-4xl font-bold text-orange-600 mt-2">
            {alertStats.thisMonth}
          </p>
          <p className="text-xs text-gray-500 mt-2">Current month</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-600">
          <p className="text-sm font-semibold text-gray-600">This Week</p>
          <p className="text-4xl font-bold text-yellow-600 mt-2">
            {alertStats.thisWeek}
          </p>
          <p className="text-xs text-gray-500 mt-2">Last 7 days</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-600">
          <p className="text-sm font-semibold text-gray-600">Critical</p>
          <p className="text-4xl font-bold text-pink-600 mt-2">
            {alertStats.critical}
          </p>
          <p className="text-xs text-gray-500 mt-2">High priority</p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <button
          onClick={addAlert}
          className="flex-1 bg-linear-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white font-bold py-2 rounded-lg transition-all"
        >
          Simulate Alert
        </button>
        <button
          onClick={clearAllAlerts}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 rounded-lg transition-all"
        >
          Clear All
        </button>
      </div>

      {/* Alert Trend Chart */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          Alert Trends (Last 12 Weeks)
        </h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1f2937",
                  border: "none",
                  borderRadius: "8px",
                  color: "#fff",
                }}
              />
              <Legend />
              <Bar
                dataKey="critical"
                stackId="alerts"
                fill="#ef4444"
                name="Critical"
              />
              <Bar
                dataKey="warning"
                stackId="alerts"
                fill="#f59e0b"
                name="Warning"
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500 text-center py-8">No alert data yet</p>
        )}
      </div>

      {/* Recent Alerts */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          📋 Recent Alerts
        </h3>
        {alerts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No alerts recorded</p>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {alerts
              .slice()
              .reverse()
              .map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${
                    alert.severity === "critical"
                      ? "bg-red-50 border-red-600"
                      : "bg-orange-50 border-orange-600"
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-bold ${
                            alert.severity === "critical"
                              ? "text-red-900"
                              : "text-orange-900"
                          }`}
                        >
                          {alert.severity === "critical" ? "🚨" : "⚠️"}{" "}
                          {alert.type}
                        </span>
                        {alert.resolved && (
                          <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                            Resolved
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm mt-1 ${
                          alert.severity === "critical"
                            ? "text-red-800"
                            : "text-orange-800"
                        }`}
                      >
                        {alert.desc}
                      </p>
                      <p className="text-xs text-gray-600 mt-2">
                        📅{" "}
                        {new Date(alert.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        • Action: {alert.action}
                      </p>
                    </div>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="text-gray-400 hover:text-red-600 transition-colors ml-4"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Alert Guidelines */}
      <div className="bg-linear-to-r from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200 p-6">
        <h4 className="font-bold text-blue-900 mb-3">
          📖 Understanding Alert Thresholds
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="font-semibold text-blue-900 mb-2">
              🚨 Critical Alerts (Take Immediate Action)
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fatigue level {">"}&#32;85%</li>
              <li>• Injury risk score {">"}&#32;75</li>
              <li>• 3+ high fatigue days in a week</li>
              <li>• Recovery rate &lt;&#32;2%</li>
            </ul>
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-2">
              ⚠️ Warning Alerts (Adjust Training)
            </p>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Fatigue level 70-85%</li>
              <li>• Weekly volume increase {">"}&#32;20%</li>
              <li>• Rest days &lt;&#32;2 per week</li>
              <li>• Injury risk score 50-75</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OvertrainingAlertCount;
