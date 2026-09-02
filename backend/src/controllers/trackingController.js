import Tracking from "../models/trackingModel.js";

export const getTrackingData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let data = await Tracking.findOne({ userId });

    if (!data) {
      const getPastDate = (daysAgo) => {
        const d = new Date();
        d.setDate(d.getDate() - daysAgo);
        return d.toISOString();
      };

      data = await Tracking.create({
        userId,
        adherenceLogs: [
          {
            id: 1,
            date: getPastDate(5),
            dietFollowed: true,
            workoutCompleted: true,
            waterIntake: true,
          },
          {
            id: 2,
            date: getPastDate(4),
            dietFollowed: true,
            workoutCompleted: false,
            waterIntake: true,
          },
          {
            id: 3,
            date: getPastDate(3),
            dietFollowed: true,
            workoutCompleted: true,
            waterIntake: true,
          },
          {
            id: 4,
            date: getPastDate(2),
            dietFollowed: false,
            workoutCompleted: true,
            waterIntake: false,
          },
          {
            id: 5,
            date: getPastDate(1),
            dietFollowed: true,
            workoutCompleted: true,
            waterIntake: true,
          },
        ],
        measurements: [
          {
            id: 1,
            date: getPastDate(14),
            chest: 100,
            waist: 85,
            hips: 98,
            thighs: 60,
            arms: 35,
            calves: 38,
          },
          {
            id: 2,
            date: getPastDate(7),
            chest: 99,
            waist: 84,
            hips: 97,
            thighs: 59.5,
            arms: 35.5,
            calves: 38,
          },
          {
            id: 3,
            date: getPastDate(0),
            chest: 98,
            waist: 83,
            hips: 96,
            thighs: 59,
            arms: 36,
            calves: 38,
          },
        ],
        weightHistory: [
          { id: 1, date: getPastDate(30), weight: 85.0 },
          { id: 2, date: getPastDate(25), weight: 84.5 },
          { id: 3, date: getPastDate(20), weight: 83.8 },
          { id: 4, date: getPastDate(15), weight: 83.2 },
          { id: 5, date: getPastDate(10), weight: 82.5 },
          { id: 6, date: getPastDate(5), weight: 82.1 },
          { id: 7, date: getPastDate(0), weight: 81.5 },
        ],
        progressPhotos: [
          {
            id: 1,
            date: getPastDate(30),
            url: "https://placehold.co/400x500?text=Front+View",
            type: "front",
          },
          {
            id: 2,
            date: getPastDate(0),
            url: "https://placehold.co/400x500?text=Side+View",
            type: "side",
          },
        ],
      });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};

export const updateTrackingData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { adherenceLogs, measurements, weightHistory, progressPhotos } =
      req.body;

    let data = await Tracking.findOne({ userId });

    if (!data) {
      data = new Tracking({ userId });
    }

    if (adherenceLogs) data.adherenceLogs = adherenceLogs;
    if (measurements) data.measurements = measurements;
    if (weightHistory) data.weightHistory = weightHistory;
    if (progressPhotos) data.progressPhotos = progressPhotos;

    await data.save();
    res.status(200).json({ success: true, data });
  } catch (error) {
    next(error);
  }
};
