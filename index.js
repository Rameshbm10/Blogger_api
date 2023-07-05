const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const authRouter = require("./routes/auth");
const userRouter = require("./routes/user");
const postRouter = require("./routes/post");
const categoryRouter = require("./routes/category");


const app = express();
dotenv.config();
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(console.log("connected to MongoDB"))
  .catch((err) => console.log(err));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json({ message: "File has been uploaded successfully..." });
});

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/posts", postRouter);
app.use("/api/categories", categoryRouter);

app.listen(process.env.APP_PORT, () =>
  console.log(`Application is listening on port ${process.env.APP_PORT}`)
);
