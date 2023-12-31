const router = require("express").Router();
const User = require("../models/User");
const Post = require("../models/Post");

//Create post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

//Update post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.params.username) {
      try {
        const updatedPost = await Post.findByIdAndUpdate(
          req.params.id,
          {
            $set: req.body,
          },
          { new: true }
        );
        res.status(200).json(updatedPost);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(401).json({
        message: "You can update only your posts..",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Delete post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.username === req.body.username) {
      try {
        await post.delete();
        res.status(200).json({ message: "Post has been deleted..." });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    } else {
      res.status(401).json({
        message: "You can delete only your posts..",
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get all posts
router.get("/", async (req, res) => {
  const username = req.query.user;
  const category = req.query.category;
  try {
    let posts;
    if (username) {
      posts = await Post.find({ username });
    } else if (category) {
      posts = await Post.find({
        categories: {
          $in: [category],
        },
      });
    } else {
      posts = await Post.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
