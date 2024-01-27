const Activity = require("../models/Activity");
const User = require("../models/User");

module.exports = {
  getActivities: async (req, res) => {
    console.log(req.user);
    try {
      const activityItems = await Activity.find({ userId: req.user.id });
      const user = await User.findOne({ _id: req.user.id }, "goal");
      const userGoal = user ? user.goal : 0;
      res.render("tracker.ejs", {
        activities: activityItems,
        userGoal: userGoal,
        user: req.user,
      });
    } catch (err) {
      console.log(err);
    }
  },
  createActivity: async (req, res) => {
    try {
      await Activity.create({
        activity: req.body.activityItem,
        calories: req.body.calories,
        userId: req.user.id,
      });
      console.log("Activity has been added!");
      res.redirect("/tracker");
    } catch (err) {
      console.log(err);
    }
  },
  deleteActivity: async (req, res) => {
    console.log(req.body.activityIdFromJSFile);
    try {
      await Activity.findOneAndDelete({ _id: req.body.activityIdFromJSFile });
      console.log("Deleted Activity");
      res.json("Deleted It");
    } catch (err) {
      console.log(err);
    }
  },
  deleteAllActivities: async (req, res) => {
    try {
      const { activityIDsFromJSFile } = req.body;

      await Activity.deleteMany({ _id: { $in: activityIDsFromJSFile } });
      console.log("All activities deleted");
      res.status(200).json("All activities deleted");
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to delete all activities" });
    }
  },
  editGoal: async (req, res) => {
    const { newGoal } = req.body;
    try {
      const user = await User.findOne({ _id: req.user.id });
      user.goal = newGoal;
      await user.save();
      res.redirect("/tracker");
    } catch (err) {
      console.log(err);
    }
  },
};