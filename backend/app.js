const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const redisClient = require("./utils/redisClient.js");

const app = express();
//connect to mongo
mongoose
  .connect(
    "mongodb+srv://kanzashahid18:qSzd6hhoKHkhKWh8@cluster0.wadaexb.mongodb.net/"
  )
  .then(() => console.log("DB connected"))
  .catch((err) => console.log("connection error", err));

//user model
const userSchema = new mongoose.Schema(
  {
    name: String,
    email: String,
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
//middleware
app.use(express.json());
app.use(cors());

//create user
app.post("/users/create", async (req, res) => {
  try {
    const { name, email } = req.body;
    const newUser = await User.create({ name, email });
    //Invalidate cache after creating new user
    await redisClient.del("allUsers");
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user", message: error });
  }
});
//list
app.get("/users/lists", async (req, res) => {
  try {
    //check cache
    const cachedKey = "allUsers";
    const cachedUsers = await redisClient.get(cachedKey);
    if (cachedUsers) {
      console.log("Cache hit - Fetching from redis");
      return res.json(JSON.parse(cachedUsers));
    }
    const users = await User.find();
    //In case of first DB fetch, saving it in redis
    if (users.length > 0) {
      await redisClient.set(cachedKey, JSON.stringify(users), "EX", 3600); //cache for 1 hour
      console.log("Cache miss - Fetching from database");
      res.json(users);
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to get users" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
