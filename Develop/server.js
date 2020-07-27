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

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", {
  useNewUrlParser: true,
});

app.get("/exercise", function (req, res) {
  res.sendFile(__dirname + "/public/exercise.html");
});

app.get("/stats", function (req, res) {
  res.sendFile(__dirname + "/public/stats.html");
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

app.put("/api/workout/:id", (req, res) => {
  db.workouts.update(
    { _id: mongojs.ObjectId(req.params.id) },
    {
      type: req.body.type,
      name: req.body.name,
      duration: req.body.duration,
      weight: req.body.weight,
      reps: req.body.reps,
      sets: req.body.sets,
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        res.json(data);
      }
    }
  );
});

app.post("/submit", (req, res) => {
  db.workouts.insert(req.body, (err, data) => {
    if (err) {
      console.log(err);
    } else {
      res.json(data);
    }
  });
});

app.get("/find/:id", (req, res) => {
    db.workouts.findOne({ _id: mongojs.ObjectId(req.params.id)}, (err, data) => {
      if(err) {
        console.log(err);
      } else {
        res.json(data);
      }
    });
  });

app.get("/api/workouts/range", (req, res) => {
    db.workouts.find({}, (err, data) => {
      if(err) {
        console.log(err);
      }  else {
        res.json(data) 
      }
    })
  })
  