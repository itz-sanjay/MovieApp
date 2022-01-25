const express = require("express", "4.17.2");
const bodyParser = require("body-parser", "1.19.1");
const request = require("request");
const ejs = require("ejs", "3.1.6");
const path = require("path");
require('dotenv').config();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

// set the view engine to ejs
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views/pages/"));

var movieId = [
  "tt0816692",
  "tt0848228",
  "tt4154796",
  "tt4154756",
  "tt5285684",
  "tt12361974",
  "tt7131622",
  "tt0110912",
  "tt0068646",
  "tt0109830",
  "tt0468569",
  "tt0137523",
  "tt1160419",
  "tt15097216",
  "tt0093603",
  "tt10806040",
  "tt10579952",
  "tt8413338",
  "tt5074352",
  "tt0101649",
  "tt1954470",
  "tt4169250",
  "tt0903747",
  "tt1190634",
  "tt0944947",
  "tt2442560",
  "tt3322312",
  "tt9140560",
];
var movieList = [];

function getRandom(movieId){

  for(const id of movieId){
    
    const apiKey = process.env.API_KEY;
    const url =
    "https://www.omdbapi.com/?i=" + id + "&apikey=" + apiKey;
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        const movieData = JSON.parse(body);
        movieList.push(movieData);
      }
  });
}
return movieList;
};

app.get("/", function (req, res) {
  res.render("homePage");
});

app.get("/home", function (req, res) {
  res.render("index", { movieArray: false, randomMovies: getRandom(movieId) });
});

app.get("/home/:movieID", (req, res) => {
  const apiKey = process.env.API_KEY;
  const url = "https://www.omdbapi.com/?i=" + req.params.movieID + "&apikey=" + apiKey;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const movieData = JSON.parse(body);

      res.render("moviePage", {movieData});
    }
  });
});

app.get("/contact", function (req, res) {
  res.render("contactPage");
});

app.post("/", function (req, res) {
  const searchedMovie = req.body.searchedMovie;
  const apiKey = process.env.API_KEY;
  const url =
    "https://www.omdbapi.com/?s=" + searchedMovie + "&apikey=" + apiKey;

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {

      const movieData = JSON.parse(body);

      res.render("index", { movieArray: movieData.Search, randomMovies: getRandom(movieId)});
      
    }
  });
  console.log("Post request has been received");
});

app.listen(process.env.PORT || port, function () {
  console.log("Server Started running");
});
