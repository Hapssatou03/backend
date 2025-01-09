const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const db = require("../models/connection");
const bcrypt = require("bcrypt");
const { User } = require("../models");
const { checkBody } = require("../modules/checkBody");

const JWT_SECRET = process.env.JWT_SECRET;

// Route pour créer un nouvel utilisateur
router.post("/signup", (req, res) => {
  if (!checkBody(req.body, ["username", "email", "password"])) {
    res.json({ result: false, error: "Missing or empty fields!" });
    return;
  }

  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (!data) {
      const hash = bcrypt.hashSync(req.body.password, 10);
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: hash,
      });

      newUser.save().then((data) => {
        const token = jwt.sign({ id: data._id }, JWT_SECRET, {
          expiresIn: "24h",
        });
        res.cookie("jwt", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000,
        });
        res.json({ result: true, data });
      });
    } else {
      res.json({ result: false, error: "User already exists!" });
    }
  });
});

// Route pour connecter un utilisateur
router.post("/signin", (req, res) => {
  if (!checkBody(req.body, ["username", "password"])) {
    res.json({ result: false, error: "Missing or empty fields!" });
    return;
  }

  User.findOne({
    username: { $regex: new RegExp(req.body.username, "i") },
  }).then((data) => {
    if (data && bcrypt.compareSync(req.body.password, data.password)) {
      const token = jwt.sign({ id: data._id }, JWT_SECRET, {
        expiresIn: "24h",
      });
      res.cookie("jwt", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.json({ result: true, data });
    } else {
      res.json({ result: false, error: "User not found" });
    }
  });
});

router.post("/logout", (_, res) => {
  res.clearCookie("jwt");
  res.json({ result: true });
});

// /////dans routes
// router.delete("/:articleId", auth, (req, res) => {
//   Article.findById(req.params.articleId)
//     .populate("userId")
//     .then((data) => {
//       if (data) {
//         if (
//           req.user.id === data.userId._id.toString() ||
//           req.user.role === "admin"
//         ) {
//           Article.deleteOne({ _id: req.params.articleId }).then(() => {
//             Article.find()
//               .populate("userId")
//               .then((datas) => {
//                 res.json({
//                   result: true,
//                   data: datas,
//                   message: "Article supprimé",
//                 });
//               });
//           });
//         } else {
//           res.status(401).json({ result: false, error: "Not authorized !" });
//         }
//       } else {
//         res.json({ result: false, error: "L'article n'existe pas!" });
//       }
//     });
// });

module.exports = router;
