import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Utensils, Calendar, Activity, Calculator } from "lucide-react";
import DashboardLayout from "../../components/Dashboard/DashboardLayout";
import DietPlan from "./diet/DietPlan";
import CalorieTracker from "./diet/CalorieTracker";
import MacroCalculator from "./diet/MacroCalculator";
import dietService from "../../Services/dietService";
import toast from "react-hot-toast";

const Diet = () => {
  const [activeTab, setActiveTab] = useState("plan");
  const [mealLogs, setMealLogs] = useState([]);
  const [dietPlan, setDietPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [macroTargets, setMacroTargets] = useState({
    protein: 180,
    carbs: 280,
    fat: 70,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [planResponse, mealsResponse] = await Promise.all([
          dietService.getDietPlan(),
          dietService.getMealHistory(),
        ]);

        if (planResponse?.data) {
          // If the backend plan is empty {}, keep dietPlan null to use default mockup in DietPlan.jsx
          if (Object.keys(planResponse.data).length > 0) {
            setDietPlan(planResponse.data);
          }
        }

        if (mealsResponse?.data?.meals) {
          setMealLogs(mealsResponse.data.meals);
        }
      } catch (error) {
        console.error("Failed to fetch diet data", error);
        toast.error("Failed to load diet data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const tabs = [
    { id: "plan", label: "Meal Plan", icon: Calendar },
    { id: "tracker", label: "Calorie Tracker", icon: Activity },
    { id: "calculator", label: "Macro Calculator", icon: Calculator },
  ];

  const handleMealSwap = (meal) => {
    console.log("Swapping meal:", meal);
    // TODO: Implement meal swap logic
  };

  const handleLogMeal = async (logData) => {
    console.log("Logging meal:", logData);
    try {
      await dietService.saveMeal(logData);
      setMealLogs((prev) => [...prev, logData]);
      toast.success("Meal logged successfully!");
    } catch (error) {
      console.error("Failed to log meal", error);
      toast.error("Failed to log meal");
    }
  };

  const handleCalculateMacros = (macroData) => {
    console.log("Calculated macros:", macroData);
    setMacroTargets(macroData);
    // TODO: Update diet plan based on new macros
  };

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-linear-to-br from-gray-50 via-green-50 to-emerald-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <div className="flex items-center gap-3 mb-2">
              <Utensils className="w-10 h-10 text-green-600" />
              <h1 className="text-4xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                Nutrition Center
              </h1>
            </div>
            <p className="text-gray-600">
              Plan your meals, track calories, and calculate optimal macros for
              your goals.
            </p>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white rounded-xl shadow-sm p-2">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                      activeTab === tab.id
                        ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "plan" && (
                  <DietPlan plan={dietPlan} onSwap={handleMealSwap} />
                )}

                {activeTab === "tracker" && (
                  <CalorieTracker
                    logs={mealLogs}
                    target={macroTargets}
                    onLog={handleLogMeal}
                  />
                )}

                {activeTab === "calculator" && (
                  <MacroCalculator onCalculate={handleCalculateMacros} />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Diet;
