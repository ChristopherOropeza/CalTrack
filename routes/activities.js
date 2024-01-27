const express = require("express");
const router = express.Router();
const activitiesController = require("../controllers/activities");
const { ensureAuth } = require("../middleware/auth");

router.get("/", ensureAuth, activitiesController.getActivities);

router.post("/createActivity", activitiesController.createActivity);

router.post("/editGoal", activitiesController.editGoal);

router.delete("/deleteActivity", activitiesController.deleteActivity);

router.delete("/deleteAll", activitiesController.deleteAllActivities);

module.exports = router;