require("dotenv").config();

var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

// var indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const articlesRouter = require("./routes/articles")
const homeRouter = require('./routes/home') // importation de la nouvelle route

var app = express();

const cors = require("cors");
// Corrigez l'origine ici pour inclure votre frontend
app.use(
  cors({
    origin: ["http://localhost:3000"], // Adresse frontend
    credentials: true, // Pour autoriser les cookies et les en-têtes sécurisés
    exposedHeaders: ["set-cookie"], // Pour exposer certains en-têtes
  })
);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/articles", articlesRouter);
app.use("/home", homeRouter) // ajout route homepage
module.exports = app;


