import React, { useState } from "react";
import {
  AlertCircle,
  TrendingUp,
  CheckCircle,
  Lightbulb,
  Target,
} from "lucide-react";

export default function ReportInsights({
  userData,
  reportData,
  aiEnabled = true,
}) {
  const [expandedAlert, setExpandedAlert] = useState(null);

  // Mock AI insights data
  const insights = {
    summary:
      "You've had an exceptional week! Your consistency is improving with a 94% adherence rate. The weight loss trend is healthy at 0.57kg/week, and your habit score jumped 7 points. Keep maintaining this momentum with progressive overload on leg exercises.",
    patterns: [
      {
        id: "strength_gain",
        type: "positive",
        title: "Strength Gains",
        description:
          "Your squat increased by 5kg this week. Push this progression!",
        icon: TrendingUp,
      },
      {
        id: "plateau_risk",
        type: "warning",
        title: "Plateau Risk Detected",
        description:
          "Chest exercises haven't progressed in 3 weeks. Consider increasing volume or using drop sets.",
        icon: AlertCircle,
      },
      {
        id: "diet_consistency",
        type: "positive",
        title: "Diet Consistency",
        description:
          "Macro adherence improved to 91%. Your discipline is showing results!",
        icon: CheckCircle,
      },
    ],
    recommendations: [
      {
        id: 1,
        title: "Increase Chest Volume",
        description:
          "Add 2 extra sets to bench press. You're ready for this progression.",
        action: "Add to next workout",
        priority: "high",
      },
      {
        id: 2,
        title: "Reduce Carbs on Rest Days",
        description:
          "Lower carbs by 50g on non-training days for better body composition.",
        action: "Update meal plan",
        priority: "medium",
      },
      {
        id: 3,
        title: "Increase Sleep Duration",
        description:
          "Aim for 7.5-8+ hours. Recovery is crucial for your progress phase.",
        action: "Set reminder",
        priority: "medium",
      },
    ],
    warnings: [
      {
        id: "overtraining",
        level: "medium",
        title: "Overtraining Risk",
        description:
          "You've done 7 intense sessions this week. Rest day tomorrow is important.",
        suggestion: "Take an active recovery walk instead of planned workout.",
      },
      {
        id: "calorie_deficit",
        level: "low",
        title: "Aggressive Deficit",
        description:
          "Weekly deficit is -3500 calories (0.5kg target). This is sustainable but monitor energy.",
        suggestion: "Ensure adequate protein intake (2g per kg bodyweight).",
      },
    ],
    nextSteps: [
      { step: "Review chest exercise form", completed: false },
      { step: "Update macro targets for maintenance phase", completed: false },
      { step: "Schedule deload week after 4 more weeks", completed: false },
      { step: "Measure body composition this week", completed: true },
    ],
    motivationQuote:
      "Progress is a marathon, not a sprint. You're building sustainable habits that will serve you for years. Keep going! 💪",
    riskAssessment: {
      overtraining: { level: "medium", percentage: 35 },
      plateauRisk: { level: "low", percentage: 15 },
      burnout: { level: "low", percentage: 10 },
    },
  };

  return (
    <div className="space-y-6">
      {/* AI Summary Section */}
      <div className="bg-linear-to-r from-purple-900/30 to-blue-900/30 border border-purple-500/50 rounded-lg p-6">
        <h3 className="text-lg font-bold text-white mb-3">
          AI Insights Summary
        </h3>
        <p className="text-gray-300 leading-relaxed">{insights.summary}</p>
      </div>

      {/* Pattern Alerts */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">Pattern Detection</h3>
        {insights.patterns.map((pattern) => {
          const IconComponent = pattern.icon;
          return (
            <div
              key={pattern.id}
              className={`flex gap-4 p-4 rounded-lg border ${
                pattern.type === "positive"
                  ? "bg-green-900/20 border-green-500/50"
                  : "bg-yellow-900/20 border-yellow-500/50"
              }`}
            >
              <div
                className={
                  pattern.type === "positive"
                    ? "text-green-400"
                    : "text-yellow-400"
                }
              >
                <IconComponent size={24} />
              </div>
              <div className="flex-1">
                <p className="text-white font-semibold">{pattern.title}</p>
                <p className="text-gray-300 text-sm">{pattern.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recommendations */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white">
          Personalized Recommendations
        </h3>
        {insights.recommendations.map((rec) => (
          <div
            key={rec.id}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="text-white font-semibold">{rec.title}</p>
                <p className="text-gray-400 text-sm">{rec.description}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  rec.priority === "high"
                    ? "bg-red-900/30 text-red-300"
                    : "bg-blue-900/30 text-blue-300"
                }`}
              >
                {rec.priority}
              </span>
            </div>
            <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
              {rec.action} →
            </button>
          </div>
        ))}
      </div>

      {/* Warnings & Risk Assessment */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <AlertCircle size={20} className="text-yellow-400" />
          Warning Indicators
        </h3>
        {insights.warnings.map((warn) => (
          <div
            key={warn.id}
            className="bg-yellow-900/20 border border-yellow-500/50 rounded-lg p-4"
          >
            <p className="text-white font-semibold">{warn.title}</p>
            <p className="text-gray-300 text-sm mt-1">{warn.description}</p>
            <p className="text-yellow-400 text-sm mt-2 font-medium">
              💡 {warn.suggestion}
            </p>
          </div>
        ))}
      </div>

      {/* Next Steps Checklist */}
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          <CheckCircle size={20} className="text-green-400" />
          Next Steps
        </h3>
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-2">
          {insights.nextSteps.map((item, idx) => (
            <label key={idx} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={item.completed}
                className="w-5 h-5 rounded accent-blue-500"
              />
              <span
                className={
                  item.completed
                    ? "text-gray-500 line-through"
                    : "text-gray-300"
                }
              >
                {item.step}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Motivation Quote */}
      <div className="bg-linear-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/50 rounded-lg p-6 text-center">
        <Lightbulb className="mx-auto text-yellow-400 mb-3" size={32} />
        <p className="text-white italic text-lg">{insights.motivationQuote}</p>
      </div>

      {/* Risk Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(insights.riskAssessment).map(([risk, data]) => (
          <div
            key={risk}
            className="bg-gray-900 border border-gray-700 rounded-lg p-4"
          >
            <p className="text-gray-400 text-sm capitalize mb-2">
              {risk.replace(/([A-Z])/g, " $1").toLowerCase()}
            </p>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-white">
                {data.percentage}%
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${
                  data.level === "high"
                    ? "bg-red-900/30 text-red-300"
                    : data.level === "medium"
                      ? "bg-yellow-900/30 text-yellow-300"
                      : "bg-green-900/30 text-green-300"
                }`}
              >
                {data.level}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Coach Notes */}
      <div className="bg-gray-900 border-l-4 border-blue-500 rounded-lg p-4">
        <p className="text-blue-400 font-semibold mb-2">Coach Notes</p>
        <p className="text-gray-300 text-sm">
          You're in an excellent position right now. The consistency you've
          shown this month is impressive, and your body is responding well.
          Focus on completing your current mesocycle without making major
          changes. Once you hit 4 weeks of consistent progress, we can assess if
          you need to advance to the next phase.
        </p>
      </div>
    </div>
  );
}
