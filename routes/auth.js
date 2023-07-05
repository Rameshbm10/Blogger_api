const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");

//Register User
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hassPassword = await bcrypt.hash(password, salt);
    const newUser = new User({
      username,
      email,
      password: hassPassword,
    });
    const user = await newUser.save();
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Login user
router.post("/login", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await user.findOne({ username });
    !user && res.status(400).json(" Username not exists...");

    const validated = await bcrypt.compare(password, user.password);
    !validated && res.status(400).json(" Wrong password");

    const { hashpassword, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
