const { db } = require("../utils/firebaseAdmin");
const cors = require('cors');
// Get Dashboard Data (Total Members, Trainers, Active Classes, Monthly Revenue)
const getDashboardData = async (req, res) => {
  try {
    // Get Total Members
    const membersSnapshot = await db.collection("users").get();
    const totalMembers = membersSnapshot.size;

    // Get Total Trainers
    const trainersSnapshot = await db.collection("trainers").get();
    const totalTrainers = trainersSnapshot.size;

    // Get Active Classes (Assuming you have a 'classes' collection)
    const activeClassesSnapshot = await db.collection("classes").where("status", "==", "active").get();
    const activeClasses = activeClassesSnapshot.size;

    // Get Monthly Revenue (Assuming a 'payments' collection with 'amount' and 'date')
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const endOfMonth = new Date();
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setDate(0);

    const paymentsSnapshot = await db
      .collection("payments")
      .where("date", ">=", startOfMonth)
      .where("date", "<=", endOfMonth)
      .get();

    const monthlyRevenue = paymentsSnapshot.docs.reduce((total, doc) => {
      const payment = doc.data();
      return total + payment.amount;
    }, 0);

    // Send the response with dashboard data
    res.status(200).json({
      totalMembers,
      totalTrainers,
      activeClasses,
      monthlyRevenue,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    res.status(500).json({ error: "Failed to fetch dashboard data" });
  }
};

module.exports = { getDashboardData };
