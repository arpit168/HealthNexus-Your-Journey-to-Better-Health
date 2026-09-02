import React, { useState, useEffect } from "react";
import { AlertTriangle } from "lucide-react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { overtrainingService } from "../../../Services/overtrainingService";

const InjuryRiskLevel = () => {
  const [riskData, setRiskData] = useState([]);
  const [overallRisk, setOverallRisk] = useState("Low");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRiskData();
  }, []);

  const loadRiskData = async () => {
    try {
      const response = await overtrainingService.getOvertrainingData();
      if (response?.data?.fatigueMetrics?.length > 0) {
        calculateRisk(response.data.fatigueMetrics);
      }
    } catch (error) {
      console.error("Failed to load risk data", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateRisk = (data) => {
    const last7 = data.slice(-7);
    const avgFatigue =
      last7.reduce((sum, d) => sum + d.fatigue, 0) / last7.length;
    const avgIntensity =
      last7.reduce((sum, d) => sum + d.intensity, 0) / last7.length;
    const restDays = 7 - last7.length;
    const cumulativeLoad = last7.reduce((sum, d) => sum + d.intensity / 100, 0);

    // Calculate risk factors (0-100)
    const fatigueRisk = Math.min(100, avgFatigue * 1.2);
    const intensityRisk = Math.min(100, avgIntensity * 1.1);
    const restRisk = Math.max(0, (7 - restDays) * 20);
    const loadRisk = Math.min(100, cumulativeLoad * 15);
    const inflammationRisk = Math.min(100, (avgFatigue + avgIntensity) / 2);

    const overallScore =
      (fatigueRisk + intensityRisk + restRisk + loadRisk + inflammationRisk) /
      5;

    setRiskData([
      {
        name: "Fatigue",
        value: Math.min(100, fatigueRisk),
        category: "Fatigue Risk",
      },
      {
        name: "Intensity",
        value: Math.min(100, intensityRisk),
        category: "Load Risk",
      },
      {
        name: "Rest Days",
        value: Math.min(100, restRisk),
        category: "Recovery Risk",
      },
      {
        name: "Load",
        value: Math.min(100, loadRisk),
        category: "Cumulative Load",
      },
      {
        name: "Inflammation",
        value: Math.min(100, inflammationRisk),
        category: "Inflammation",
      },
    ]);

    // Determine overall risk level
    if (overallScore > 75) {
      setOverallRisk("Critical");
    } else if (overallScore > 60) {
      setOverallRisk("High");
    } else if (overallScore > 40) {
      setOverallRisk("Moderate");
    } else {
      setOverallRisk("Low");
    }
  };

  const getRiskColor = (risk) => {
    if (risk === "Critical") return "from-red-500 to-pink-500";
    if (risk === "High") return "from-orange-500 to-red-500";
    if (risk === "Moderate") return "from-yellow-500 to-orange-500";
    return "from-green-500 to-emerald-500";
  };

  const getRiskEmoji = (risk) => {
    if (risk === "Critical") return "🚨";
    if (risk === "High") return "⚠️";
    if (risk === "Moderate") return "⚡";
    return "✅";
  };

  const riskScore =
    riskData.length > 0
      ? (
          riskData.reduce((sum, d) => sum + d.value, 0) / riskData.length
        ).toFixed(1)
      : 0;

  const highestRiskFactor =
    riskData.length > 0
      ? riskData.reduce((prev, current) =>
          prev.value > current.value ? prev : current,
        )
      : null;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Risk Indicator */}
      <div
        className={`bg-linear-to-br ${getRiskColor(overallRisk)} rounded-2xl shadow-lg p-8 text-white`}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm font-semibold opacity-90">
              Injury Risk Level
            </p>
            <h2 className="text-5xl font-bold mt-2">{overallRisk}</h2>
            <p className="text-lg opacity-90 mt-2">
              Risk Score: {riskScore}/100
            </p>
          </div>
          <div className="text-7xl opacity-90">{getRiskEmoji(overallRisk)}</div>
        </div>

        {/* Risk Progress Bar */}
        <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500"
            style={{ width: `${riskScore}%` }}
          />
        </div>
      </div>

      {/* Risk Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Risk Factors Radar */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Risk Factors Analysis
          </h3>
          {riskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={riskData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={90} domain={[0, 100]} />
                <Radar
                  name="Risk Level"
                  dataKey="value"
                  stroke="#ef4444"
                  fill="#f87171"
                  fillOpacity={0.6}
                />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Risk Details */}
        <div className="space-y-3">
          <div className="bg-white rounded-xl shadow-md p-4 border-l-4 border-red-600">
            <p className="text-sm font-semibold text-gray-600">
              Highest Risk Factor
            </p>
            <p className="text-2xl font-bold text-red-600 mt-1">
              {highestRiskFactor
                ? `${highestRiskFactor.name} (${highestRiskFactor.value.toFixed(1)})`
                : "N/A"}
            </p>
          </div>

          {riskData.map((factor) => (
            <div
              key={factor.name}
              className="bg-white rounded-xl shadow-md p-4"
            >
              <div className="flex justify-between items-center mb-2">
                <p className="font-semibold text-gray-900">{factor.name}</p>
                <span className="text-lg font-bold text-gray-600">
                  {factor.value.toFixed(0)}/100
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    factor.value > 75
                      ? "bg-red-600"
                      : factor.value > 50
                        ? "bg-orange-600"
                        : factor.value > 25
                          ? "bg-yellow-600"
                          : "bg-green-600"
                  }`}
                  style={{ width: `${factor.value}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Injury Prevention Guidelines */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">
          🛡️ Injury Prevention Strategies
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="font-bold text-blue-900 mb-2">Immediate Actions</p>
            <ul className="text-sm text-blue-800 space-y-1">
              {overallRisk === "Critical" && (
                <>
                  <li>⚠️ REDUCE intensity to 50% immediately</li>
                  <li>📅 Take 2-3 complete rest days</li>
                  <li>🏥 Consult sports medicine doctor</li>
                </>
              )}
              {overallRisk === "High" && (
                <>
                  <li>⚠️ Reduce intensity by 30-40%</li>
                  <li>📅 Add 1-2 active recovery days</li>
                  <li>🧊 Daily stretching & foam rolling</li>
                </>
              )}
              {overallRisk === "Moderate" && (
                <>
                  <li>✓ Light reduction in volume (10-15%)</li>
                  <li>✓ Increase rest days to 2-3/week</li>
                  <li>✓ Focus on proper form</li>
                </>
              )}
              {overallRisk === "Low" && (
                <>
                  <li>✓ Continue current program</li>
                  <li>✓ Maintain 1-2 rest days/week</li>
                  <li>✓ Gradually increase load</li>
                </>
              )}
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="font-bold text-green-900 mb-2">
              Long-term Prevention
            </p>
            <ul className="text-sm text-green-800 space-y-1">
              <li>✓ Periodize training (3-4 weeks cycles)</li>
              <li>✓ Include mobility & flexibility work</li>
              <li>✓ Monitor sleep quality (8+ hrs)</li>
              <li>✓ Maintain proper nutrition</li>
              <li>✓ Manage stress levels</li>
              <li>✓ Regular form checks with coaches</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Risk Assessment Breakdown */}
      <div className="bg-linear-to-r from-yellow-50 to-orange-50 rounded-xl border-2 border-yellow-200 p-6">
        <h4 className="font-bold text-yellow-900 mb-3">📊 What This Means</h4>
        <p className="text-sm text-yellow-800 mb-3">
          {overallRisk === "Critical"
            ? "🚨 Your injury risk is CRITICAL. Multiple risk factors are elevated. You need immediate action to reduce injury probability."
            : overallRisk === "High"
              ? "⚠️ Your injury risk is HIGH. Consider reducing training volume and intensity to prevent injury."
              : overallRisk === "Moderate"
                ? "⚡ Your injury risk is MODERATE. Stay cautious with progressive overload and maintain recovery."
                : "✅ Your injury risk is LOW. Continue with proper recovery practices and form."}
        </p>
        <p className="text-xs text-yellow-700">
          This assessment is based on fatigue levels, training intensity, rest
          days, cumulative load, and estimated inflammation. For personalized
          advice, consult a sports medicine professional.
        </p>
      </div>
    </div>
  );
};

export default InjuryRiskLevel;
