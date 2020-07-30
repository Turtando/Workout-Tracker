const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workoutTrackerDB", {
  useNewUrlParser: true,
});

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/public/index.html");
});

app.get("/exercise", function (req, res) {
  res.sendFile(__dirname + "/public/exercise.html");
});

app.get("/stats", function (req, res) {
  res.sendFile(__dirname + "/public/stats.html");
});

//Create a Workout
app.post("/api/workouts", (req, res) => {
  db.Workout.create({})
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch(({ message }) => {
      res.json(message);
    });
});

//Posting to existing workout
app.put("/api/workouts/:id", ({ body, params }, res) => {
  db.Exercise.create(body)
    .then(({ _id }) =>
      db.Workout.findOneAndUpdate(
        { _id: params.id },

        { $push: { exercises: _id } },
        { new: true }
      )
    )
    .then((dbWorkout) => {
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get workout by id
app.get("/api/workouts/", (req, res) => {
  db.Workout.find({})
    .populate("exercises")
    .then((dbWorkout) => {
      let workoutArray = [];
      for (let i = 0; i < dbWorkout.length; i++) {
        let totalDuration = 0;
        for (let j = 0; j < dbWorkout[i].exercises.length; j++) {
          totalDuration += dbWorkout[i].exercises[j].duration;
        }
        let newWorkout = {
          day: dbWorkout[i].day,
          exercises: dbWorkout[i].exercises,
          totalDuration: totalDuration,
        };
        workoutArray.push(newWorkout);
      }
      res.json(workoutArray);
    })
    .catch((err) => {
      res.json(err);
    });
});

// Get
app.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
    .sort({ day:-1 }).limit(7)
    .populate("exercises")
    .then((dbWorkout) => {
      dbWorkout.sort(( a, b ) => a.day - b.day)
      res.json(dbWorkout);
    })
    .catch((err) => {
      res.json(err);
    });
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});
