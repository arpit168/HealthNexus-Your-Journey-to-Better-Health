import Sustainability from "../models/sustainabilityModel.js";

export const getSustainabilityData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let data = await Sustainability.findOne({ userId });

    if (!data) {
      const generateTrendData = () => {
        const data = [];
        let currentValue = 60;
        for (let i = 1; i <= 30; i++) {
          currentValue += (Math.random() - 0.3) * 3;
          if (currentValue > 100) currentValue = 100;
          if (currentValue < 0) currentValue = 0;
          data.push({
            day: `Day ${i}`,
            score: Math.round(currentValue),
          });
        }
        return data;
      };

      data = await Sustainability.create({
        userId,
        microAdjustments: [
          {
            id: 1,
            type: "Diet",
            suggestion: "Add a handful of almonds to your afternoon snack.",
            status: "implemented",
            date: new Date().toISOString(),
          },
          {
            id: 2,
            type: "Sleep",
            suggestion: "Go to bed 15 minutes earlier tonight.",
            status: "pending",
            date: new Date().toISOString(),
          },
          {
            id: 3,
            type: "Activity",
            suggestion: "Take a 10-minute walk after lunch.",
            status: "rejected",
            date: new Date().toISOString(),
          },
        ],
        momentumScore: generateTrendData().map((d) => ({
          day: d.day,
          score: d.score,
          trend: d.score + (Math.random() * 10 - 5),
        })),
        dependencyScore: generateTrendData().map((d) => ({
          day: d.day,
          score: 100 - d.score + 20,
          optimal: 50,
        })),
        lifestyleIntegration: [
          {
            category: "Sleep Schedule",
            score: 85,
            impact: "High",
            trend: "improving",
          },
          {
            category: "Meal Timing",
            score: 70,
            impact: "Medium",
            trend: "stable",
          },
          {
            category: "Stress Management",
            score: 60,
            impact: "High",
            trend: "declining",
          },
          {
            category: "Daily Activity",
            score: 90,
            impact: "Medium",
            trend: "improving",
          },
        ],
        compoundingRate: generateTrendData().map((d, index) => ({
          month: `Week ${Math.ceil(index / 7)}`,
          rate: (d.score / 100) * 5 + index * 0.1,
          baseline: 2.5,
        })),
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateSustainabilityData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const {
      microAdjustments,
      momentumScore,
      dependencyScore,
      lifestyleIntegration,
      compoundingRate,
    } = req.body;

    let data = await Sustainability.findOne({ userId });

    if (!data) {
      data = new Sustainability({ userId });
    }

    if (microAdjustments) data.microAdjustments = microAdjustments;
    if (momentumScore) data.momentumScore = momentumScore;
    if (dependencyScore) data.dependencyScore = dependencyScore;
    if (lifestyleIntegration) data.lifestyleIntegration = lifestyleIntegration;
    if (compoundingRate) data.compoundingRate = compoundingRate;

    await data.save();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
