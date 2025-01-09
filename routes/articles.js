const express = require("express");
const router = express.Router();
const { Article } = require("../models");
const { auth } = require("../middleware/auth");

// Création d'un article
router.post("/create", auth, (req, res) => {
  const { content, urlToImage } = req.body;

  const newArticle = new Article({
    userId: req.user.id,
    content,
    urlToImage,
    author: req.user.username,
  });

  newArticle
    .save()
    .then((article) => res.status(201).json({ result: true, article }))
    .catch((error) => res.status(500).json({ result: false, error }));
});

// Suppression d'un article
router.delete("/:id", auth, (req, res) => {
  Article.findByIdAndDelete(req.params.id)
    .then(() => res.status(200).json({ result: true }))
    .catch((error) => {
      console.error("Erreur lors de la suppression", error);
      res.status(500).json({ result: false, error });
    });
});

// Récupération de tous les articles
router.get("/", (req, res) => {
  Article.find()
    .sort({ createdAt: -1 }) // Les plus récents en premier
    .then((articles) => res.status(200).json({ result: true, articles }))
    .catch((error) => {
      console.error("Erreur lors de la récupération des articles", error);
      res.status(500).json({ result: false, error });
    });
});

// Récupération des articles récents
router.get("/recent", (req, res) => {
  Article.find()
    .sort({ createdAt: -1 }) // Trier par date (les plus récents en premier)
    .limit(5) // Limiter à 5 articles
    .then((articles) => res.status(200).json({ result: true, articles }))
    .catch((error) => {
      console.error(
        "Erreur lors de la récupération des articles récents",
        error
      );
      res.status(500).json({ result: false, error });
    });
});

// Like d'un article
router.post("/:id/like", auth, (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  )
    .then((article) => res.status(200).json({ result: true, article }))
    .catch((error) => {
      console.error("Erreur lors du like", error);
      res.status(500).json({ result: false, error });
    });
});

// Dislike d'un article
router.post("/:id/dislike", auth, (req, res) => {
  Article.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: -1 } },
    { new: true }
  )
    .then((article) => res.status(200).json({ result: true, article }))
    .catch((error) => {
      console.error("Erreur lors du dislike", error);
      res.status(500).json({ result: false, error });
    });
});

// Mise à jour d'un article
router.put("/:id", auth, (req, res) => {
  const { content } = req.body;
  Article.findByIdAndUpdate(req.params.id, { content }, { new: true })
    .then((article) => res.status(200).json({ result: true, article }))
    .catch((error) => {
      console.error("Erreur lors de la modification", error);
      res.status(500).json({ result: false, error });
    });
});

module.exports = router;
