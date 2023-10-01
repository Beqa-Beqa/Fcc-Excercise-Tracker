// Initialize express app
require("dotenv").config();
const express = require("express");
const app = express();
const { User, Exercise } = require("./db/connect");
const helm = require("helmet")

// Serve static files
app.use(express.static("public"));
// Use the url-encoded parser
app.use(express.urlencoded({ extended: true }));
// Secuirty
app.use(helm());

// Serve index.html file on homepage
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Endpoints
// Create User
app.post("/api/users", async (req, res) => {
  // Destructurisation
  const { username } = req.body;
  // Create user with name
  await User.create({ username: username, logs: [] })
    .then((user) =>
      res.json({
        username: user.username,
        _id: user._id,
      })
    )
    .catch((error) => res.json({ error: error }));
});

// Get list of users
app.get("/api/users", async (req, res) => {
  // Get all the users and their fields except logs
  await User.find({}).select("-logs")
    .then((users) => {
      res.json(users);
    })
    .catch((error) => res.json({ error: error }));
});

// Create an exercise
app.post("/api/users/:id/exercises", async (req,res) => {
  // Destructurisation
  const {description, duration} = req.body;
  const {id} = req.params;
  // Creating exercise object
  const newExerciseData = {
    description: description,
    duration: Number(duration),
  }
  // If date is provided we add it in exercise object if not default value will be used by mongoose
  if(req.body.date){
    newExerciseData.date = new Date(req.body.date).toDateString();
  }
  // Create an exercise
  const newExercise = await Exercise.create(newExerciseData).then(exercise => exercise);
  // Find user and retreive the logs info if user exists
  const user = await User.findOne({_id: id});
  if(!user) {
    res.json({error: "User not found"});
  }
  const {logs} = user;
  // Find user and update
  // Spreading what's already is in user's logs array and adding a new exercise to it
  await User.findOneAndUpdate({_id: id}, {logs: [newExercise, ...logs]}, {new: true})
        .then(user => {
          res.json({
            _id: user.id,
            username: user.username,
            date: newExercise.date,
            duration: Number(duration),
            description: description
          });
        })
        .catch(error => {
          console.log(error);
          res.json({error: error});
        });
});

// Get all exercise logs for a user with specific id
app.get("/api/users/:id/logs", async (req,res) => {
  // Destructurisation, getting id from req.params object
  const {id} = req.params;
  // Create user information object
  const userInformation = {};
  // Searching for user with given id if exists
  await User.findOne({_id: id})
        .then(user => {
          // Fill userInformation Obj with information       
          userInformation._id = user._id;
          userInformation.username = user.username;
          // If we have given a querystring we filter the logs based on the given filters
          if(Object.keys(req.query).length > 0){
            // Destructuring query string
            const {from, to, limit} = filterInfo(req.query);
            userInformation.from = new Date(from).toDateString();
            userInformation.to = new Date(to).toDateString();
            // Count limit is either limit if defined or user logs length if undefined
            const countLimit = limit || user.logs.length;
            userInformation.count = countLimit;
            // Filtering user's logs based on given query string filters
            // We are mapping through the logs and returning individual fields because
            // otherwise ids are returned as well and we don't need them (may cause confirmation problems on fcc)
            userInformation.log = user.logs
            .filter(log => {
              const logDateToUnix = Number(new Date(log.date).getTime());
              if(logDateToUnix >= from && logDateToUnix <= to) return log;
            }).slice(0, Number(countLimit)).map(log => {
              return {
                description: log.description,
                duration: log.duration,
                date: log.date
              }
            })
          } else {
            // If no fitlers are given with query string we return every log with certain fields from user's logs
            userInformation.count = user.logs.length;
            userInformation.log = user.logs.map(log => {
              return {
                description: log.description,
                duration: log.duration,
                date: log.date
              }
            });  
          }
          // Return result object as json
          res.json(userInformation);
        }).catch(error => {
          console.log(error);
          res.json({error: error, userCatchError: true});
        });
});

const filterInfo = (filtersObject) => {
  // We return an object based on filtersObject, if the keys are defined we use them otherwise we return the default one
  return {
    from: Number(new Date(filtersObject.from).getTime()) || 0,
    to: Number(new Date(filtersObject.to).getTime()) || Number(new Date().getTime()),
    limit: Number(filtersObject.limit) || undefined
  };
}

// Define port and make the server listen to it
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});