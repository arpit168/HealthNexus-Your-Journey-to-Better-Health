import Report from "../models/reportModel.js";

export const getReportData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    let report = await Report.findOne({ userId });

    if (!report) {
      report = await Report.create({
        userId,
        reportsData: {
          monthly: null,
          weekly: null,
          yearly: null,
        },
      });
    }

    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};

export const updateReportData = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { reportsData } = req.body;

    let report = await Report.findOne({ userId });

    if (!report) {
      report = new Report({ userId });
    }

    report.reportsData = { ...report.reportsData, ...reportsData };

    await report.save();
    res.status(200).json({ success: true, data: report });
  } catch (error) {
    next(error);
  }
};
