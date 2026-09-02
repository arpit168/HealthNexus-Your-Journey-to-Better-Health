import Overtraining from "../models/overtrainingModel.js";

export const getOvertrainingData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let data = await Overtraining.findOne({ userId });

    if (!data) {
      data = await Overtraining.create({
        userId,
        fatigueMetrics: [
          { day: "Mon", score: 3 },
          { day: "Tue", score: 4 },
          { day: "Wed", score: 6 },
          { day: "Thu", score: 7 },
          { day: "Fri", score: 5 },
          { day: "Sat", score: 8 },
          { day: "Sun", score: 2 },
        ],
        recoveryDayFrequency: [
          { month: "Jan", days: 4 },
          { month: "Feb", days: 3 },
          { month: "Mar", days: 5 },
          { month: "Apr", days: 4 },
        ],
        alerts: [
          {
            id: 1,
            type: "High Risk",
            message: "HRV drop detected after intense session.",
            date: new Date().toISOString(),
          },
          {
            id: 2,
            type: "Warning",
            message: "Sleep quality has been poor for 3 days.",
            date: new Date().toISOString(),
          },
        ],
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateOvertrainingData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { fatigueMetrics, recoveryDayFrequency, alerts } = req.body;

    let data = await Overtraining.findOne({ userId });

    if (!data) {
      data = new Overtraining({ userId });
    }

    if (fatigueMetrics) data.fatigueMetrics = fatigueMetrics;
    if (recoveryDayFrequency) data.recoveryDayFrequency = recoveryDayFrequency;
    if (alerts) data.alerts = alerts;

    await data.save();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
