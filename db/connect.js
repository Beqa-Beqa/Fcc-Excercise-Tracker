const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const exerciseSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  date: {
    type: String,
    default: new Date().toDateString()
  },
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  logs: {
    type: [exerciseSchema]
  }
});


const User = mongoose.model("User", userSchema);
const Exercise = mongoose.model("Exercise", exerciseSchema);

module.exports = { User, Exercise };
