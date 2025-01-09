const express = require("express");
const router = express.Router();

// Exemple de données simulées pour la recherche
const articles = [
  {
    title: "Comment améliorer votre productivité",
    description: "Des conseils pratiques pour booster votre productivité.",
    url: "https://example.com/article1",
  },
  {
    title: "Les secrets du développement personnel",
    description: "Découvrez les secrets pour atteindre vos objectifs.",
    url: "https://example.com/article2",
  },
  {
    title: "Apprendre React en 2024",
    description: "Un guide complet pour débuter avec React.",
    url: "https://example.com/article3",
  },
];

// Route de recherche dédiée à la page d'accueil
router.get("/search", (req, res) => {
  const query = req.query.q; // Récupère le mot-clé de recherche

  if (!query) {
    return res.status(400).json({ error: "Le paramètre 'q' est requis." });
  }

  // Filtrage des articles contenant le mot-clé (insensible à la casse)
  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(query.toLowerCase()) ||
    article.description.toLowerCase().includes(query.toLowerCase())
  );

  res.json({ articles: filteredArticles });
});

module.exports = router;
