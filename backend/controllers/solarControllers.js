const EnergyData = require("../models/solarModel");
const moment = require("moment");


exports.getWeeklyData = async (req, res) => {
  const { startDate, endDate } = req.query; // Expecting startDate and endDate in 'DD-MM-YYYY' format
  const userId = req.user;

  // Calculate the start and end dates
  const startOfWeek = moment(startDate, "DD-MM-YYYY").startOf("day").toDate();
  const endOfWeek = moment(endDate, "DD-MM-YYYY").endOf("day").toDate();

  try {
    // Fetch energy data for the specified week (range of dates)
    const weeklyData = await EnergyData.find({
      userId,
      createdAt: { $gte: startOfWeek, $lte: endOfWeek },
    }).sort({ createdAt: 1 });

    // Check if there is any data in the given range
    if (!weeklyData.length) {
      return res.status(404).json({ message: "No data found for this week" });
    }

    // Format the weekly data to return it as an array
    const formattedWeeklyData = weeklyData.map((data) => ({
      date: moment(data.createdAt).format("DD-MM-YYYY"),
      production: data.production,
      consumption: data.consumption,
      batteryLevel: data.batteryLevel,
    }));

    res.status(200).json({ message: "Weekly data fetched", data: formattedWeeklyData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching weekly energy data", error });
  }
};

// Store daily energy data
exports.storeEnergyData = async (req, res) => {
  const { production, consumption } = req.body;
  console.log("post",req.body)
  const userId = req.user;
  try {

    const previousDayData = await EnergyData.findOne({ userId })
      .sort({ createdAt: -1 })
      .limit(1);

    let batteryLevel = 100;

    if (previousDayData) {
      batteryLevel = previousDayData.batteryLevel + production - consumption;
      batteryLevel = Math.min(Math.max(batteryLevel, 0), 100);
    }
    const newEnergyData = new EnergyData({
      userId,
      production,
      consumption,
      batteryLevel,
    });

    await newEnergyData.save();
    res.status(201).json({ message: "Energy data saved", newEnergyData });
  } catch (error) {
    res.status(500).json({ message: "Error storing energy data", error });
  }
};

// Fetch daily energy data and battery status based on the timestamp (createdAt)
exports.getDailyData = async (req, res) => {
  const { date } = req.query;
  console.log("que",req.query) // Expecting date in 'DD-MM-YYYY' format
  const userId = req.user;
  const startOfDay = moment(date, "DD-MM-YYYY").startOf("day").toDate();
  const endOfDay = moment(date, "DD-MM-YYYY").endOf("day").toDate();

  try {
    
    const energyData = await EnergyData.findOne({
      userId,
      createdAt: { $gte: startOfDay, $lt: endOfDay },
    });

    if (!energyData) {
      return res.status(404).json({ message: "No data found for this date" });
    }

    res.status(200).json({
      date: moment(energyData.createdAt).format("DD-MM-YYYY"),
      production: energyData.production,
      consumption: energyData.consumption,
      batteryLevel: energyData.batteryLevel,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching energy data", error });
  }
};
