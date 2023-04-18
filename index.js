const express = require('express');
const bodyParser = require('body-parser');
const uuid = require('uuid');
const { check, validationResult } = require('express-validator');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const cors = require('cors');
app.use(cors());

let auth = require('./auth')(app);
const passport = require('passport');
require('./passport');

const mongoose = require('mongoose');
const Models = require('./models.js');

//// Requiring the Mongoose models defined in models.js
const Movies = Models.Movie;
const Users = Models.User;

//allows Mongoose to connect to that database so it can perform CRUD operations on the documents it contains from within your REST API
mongoose.connect('mongodb://localhost:27017/cfDB', { useNewUrlParser: true, useUnifiedTopology: true });



let users = [
  {
    "id": "1",
    "name": "Kim",
    "favoritemMovie": []
  },
  {
    "id": "2",
    "name": "Joe",
    "favoritemMovie": ["The Fountain"]
  },

]

let movies = [
  {
    "Title":"The Fountain",
    "Description":"As a modern-day scientist, Tommy is strugling with normalitty, espretely searching for the medical breakthrough that will save the life of his cancer-sriken wifr, Izzi",
     "Genre":{
      "Name":"Drama",
      "Description":"In film and television, drama is a catagory of narative fiction for semi-fiction intended to be more serious than humourous in tone",
     },
    "Director":{
      "Name":"Darren Aronofsky",
      "Bio":"Is an American film director, producer, and screenwriter. His films are noted for their surreal, melodramatic, and often disturbing elements, frequently in the form of psychological fiction. Furthermore, he is well and healthy in 2023!",
      "Birth":"February 12, 1969",
    },
    "ImageURL":"https://en.wikipedia.org/wiki/The_Fountain",
  },

  {
    "Title":"Lord of the Rings",
    "Description":"The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil. Its many worlds and creatures were drawn from Tolkien's extensive knowledge of philology and folklore.",
     "Genre":{
      "Name":"Drama",
      "Description":"In film and television, drama is a catagory of narative fiction for semi-fiction intended to be more serious than humourous in tone",
     },
    "Director":{
      "Name":"J.R.R. Tolkien",
      "Bio":"John Ronald Reuel Tolkien was a major scholar of the English language, specialising in Old and Middle English. Twice Professor of Anglo-Saxon (Old English) at the University of Oxford, he also wrote a number of stories, including most famously The Hobbit (1937) and The Lord of the Rings (1954–1955), which are set in a pre-historic era in an invented version of our world which he called by the Middle English name of Middle-earth. He later died on September 2, 1973",
      "Birth":"January 3, 1892",
    },
    "ImageURL":"https://www.goodfreephotos.com/albums/other-photos/lord-of-the-rings-the-one-ring.jpg",
  },

  {
    
      "Title":"Twilight",
      "Description":"The film stars Kristen Stewart and Robert Pattinson as Bella Swan, a teenage girl, and Edward Cullen, a vampire, respectively, and focuses on the development of Bella and Edward's relationship and the subsequent efforts of Edward and his family to keep Bella safe from another coven of vampires.",
       "Genre":{
        "Name":"Romantic",
        "Description":"In film and television, Romantic is a romance novel or romantic novel generally refers to a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people.",
       },
      "Director":{
        "Name":"Chris Weitz",
        "Bio":"Christopher John Weitz is an American film director, screenwriter, and producer. Further, He is very well and health in 2023.",
        "Birth":"1969",
      },
      "ImageURL":"https://wallpaper-house.com/data/out/5/wallpaper2you_75612.jpg",
    },
    
  {
    
    "Title":"Encanto",
    "Description":"Encanto follows a multigenerational Colombian family, the Madrigals, led by a matriarch (Botero) whose children and grandchildren—except for Mirabel Madrigal (Beatriz)—receive magical gifts from a miracle that helps them serve the people in their rural community called the Encanto.",
     "Genre":{
      "Name":"Family Film",
      "Description":"In film and television, Family Film is a genre that is contains appropriate content for younger viewers. Family film aims to appeal not only to children, but to a wide range of ages.",
     },
    "Director":{
      "Name":"Clark Spencer",
      "Bio":"is an American film producer, businessman and studio executive best known for his work at Walt Disney Animation Studios, and for winning the Oscars for Best Animated Feature for his work on Zootopia and Encanto. He is very well and healthy in 2023.",
      "Birth":"April 6, 1963",
    },
    "ImageURL":"https://www.alamy.com/encanto-image503284772.html?imageid=FE4B1656-AD84-47B7-AE35-60DFDE7F7C3D&p=1947612&pn=1&searchId=a733c17ba7882ed931dd1addff6d703d&searchtype=0",
  },

  {
    "Title":"Scaface",
    "Description":"Scarface tells the story of Cuban refugee Tony Montana (Al Pacino), who arrives penniless in Miami during the Mariel boatlift and becomes a powerful and extremely homicidal drug lord. ",
     "Genre":{
      "Name":"violent",
      "Description":"In film and television, Romantic is a romance novel or romantic novel generally refers to a type of genre fiction novel which places its primary focus on the relationship and romantic love between two people.",
     },
    "Director":{
      "Name":"Brian De Palma",
      "Bio":"is an American film director and screenwriter. With a career spanning over 50 years, he is best known for his work in the suspense, crime and psychological thriller genres. Furthermore, He is lving helthy and strong.",
      "Birth":"September 11, 1940",
    },
    "ImageURL":"",
  },

  {
    "Title":"Titanic",
    "Description":" Titanic is based on accounts of the sinking of the RMS Titanic and stars Kate Winslet and Leonardo DiCaprio as members of different social classes who fall in love aboard the ship during its ill-fated maiden voyage. ",
     "Genre":{
      "Name":"Drama",
      "Description":"In film and television, drama is a catagory of narative fiction for semi-fiction intended to be more serious than humourous in tone",
     },
    "Director":{
      "Name":"James Cameron",
      "Bio":" is a Canadian filmmaker. A major figure in the post-New Hollywood era, he is considered one of the industry's most innovative filmmakers, regularly pushing the boundaries of cinematic capability with his use of novel technologies.Further, James is well and healthy in 2023",
      "Birth":"August 16, 1954",
    },
    "ImageURL":"https://www.nicepng.com/maxp/u2y3w7q8a9a9o0e6/",
  },

  {
    "Title":"Pearl Harbor",
    "Description":" The film features a heavily fictionalized version of the attack on Pearl Harbor by Japanese forces on December 7, 1941, focusing on a love story set amidst the lead up to the attack, its aftermath, and the Doolittle Raid. ",
     "Genre":{
      "Name":"War",
      "Description":"In film and television,  War film is a film genre concerned with warfare, typically about naval, air, or land battles, with combat scenes central to the drama.",
     },
    "Director":{
      "Name":"Michael Bay",
      "Bio":" is an American film director and producer. He is best known for making big-budget, high-concept action films characterized by fast cutting, stylistic cinematography and visuals, and extensive use of special effects, including frequent depictions of explosions.Further, Michael Bay is well and healthy in 2023",
      "Birth":"February 17, 1965",
    },
    "ImageURL":"https://www.nicepng.com/png/detail/19-198559_pearl-harbor-the-movie-logo-png-transparent-pearl.png",
  },

  {
    "Title":"Lord of the Rings-The Hobbit",
    "Description":"The Lord of the Rings is the saga of a group of sometimes reluctant heroes who set forth to save their world from consummate evil. Its many worlds and creatures were drawn from Tolkien's extensive knowledge of philology and folklore.",
     "Genre":{
      "Name":"Drama",
      "Description":"In film and television, drama is a catagory of narative fiction for semi-fiction intended to be more serious than humourous in tone",
     },
    "Director":{
      "Name":"J.R.R. Tolkien",
      "Bio":"John Ronald Reuel Tolkien was a major scholar of the English language, specialising in Old and Middle English. Twice Professor of Anglo-Saxon (Old English) at the University of Oxford, he also wrote a number of stories, including most famously The Hobbit (1937) and The Lord of the Rings (1954 thru1955), which are set in a pre-historic era in an invented version of our world which he called by the Middle English name of Middle-earth. He later died on September 2, 1973",
      "Birth":"January 3, 1892",
    },
    "ImageURL":"https://www.kindpng.com/picc/m/83-831218_transparent-the-hobbit-logo-png-hobbit-logo-png.png",
  },

  {
   "Title":"Toy Story 1",
    "Description":"Taking place in a world where toys come to life when humans are not present, the plot of Toy Story focuses on the relationship between an old-fashioned pull-string cowboy doll named Woody and a modern space cadet action figure, Buzz Lightyear, as Woody develops jealousy towards Buzz when he becomes their owner Andy's favorite toy.",
     "Genre":{
      "Name":"Family Film",
      "Description":"In film and television, Family Film is a genre that is contains appropriate content for younger viewers. Family film aims to appeal not only to children, but to a wide range of ages.",
     },
    "Director":{
      "Name":"John Lasseter",
      "Bio":" is an American film director, producer, screenwriter, animator, voice actor, and the head of animation at Skydance Animation. Heis very well and healthy in 2023.",
      "Birth":"January 12, 1957",
    },
    "ImageURL":"https://en.wikipedia.org/wiki/Toy_Story_%28franchise%29#/media/File:Toy_Story_logo.svg", 
  },
  {
    "Title":"Flubber",
    "Description":"Professor Philip Brainard (Robin Williams) is experimenting with new kinds of energy, and he thinks this project will save struggling Medfield College, where his girlfriend, Sara (Marcia Gay Harden), is president. But when he discovers a lively, rubber-like substance dubbed flubber, he gets so excited, he absent-mindedly misses his own wedding.",
     "Genre":{
      "Name":"Family Film",
      "Description":"In film and television, Family Film is a genre that is contains appropriate content for younger viewers. Family film aims to appeal not only to children, but to a wide range of ages.",
     },
    "Director":{
      "Name":"Les Mayfield",
      "Bio":" Shortly after graduating the USC School of Cinematic Arts, Les Mayfield formed the ZM Productions with schoolmate George Zaloom. Until its closure in 1998, the company had produced films and television programs such as Hearts of Darkness: A Filmmaker's Apocalypse, The Computer Wore Tennis Shoes, and The Cape in 16 years. He is very well and healthy in 2023.",
      "Birth":"November 30, 1959",
    },
    "ImageURL":"http://www.impawards.com/1997/flubber_ver8_xlg.html", 
  },
];



//welcome page response to user
app.get("/", (req, res) => {
  res.status(200).json("Welcome to my APP!");
});

/*
***************************************************
MOVIE Queries
***************************************************
*/

// Returns a list of all movies
app.get("/movies", passport.authenticate("jwt", { session: false }),
(req, res) => {
  Movies.find().then(movies => {
        res.status(200).json(movies);
     })
     .catch(error => {
        console.error(err);
        res.status(500).send("Error: " + err);
     });
}
);

// Get single movie, by title

app.get('/movies/:title',passport.authenticate('jwt', { session: false }),
 (req, res) =>{
    Movies.findOne({ Title: req.params.title })
      .then(function (movie) {
        res.json(movie);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Get data about genre, by name

app.get( '/movies/genre/:genreName', passport.authenticate('jwt', { session: false }),
(req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.genreName })
      .then(function (movie) {
        res.json(movie.Genre);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Get data about a director, by name
app.get('/movies/director/:directorName',passport.authenticate('jwt', { session: false }),
 (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.directorName })
      .then(function (movie) {
        res.json(movie.Director);
      })
      .catch(function (err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

/*
*************************************
USER Queries
*************************************
*/



//Adds a new user /allows new users to register

app.post("/users", 
[
  check('Username', 'Username is required').isLength({min: 5}),
  check('Username', 'Username contains non alphanumeric characters - not allowed.').isAlphanumeric(),
  check('Password', 'Password is required').not().isEmpty(),
  check('Email', 'Email does not appear to be valid').isEmail()
], (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + "already exists");
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: hashedPassword,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send("Error: " + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  });

//Get all userspassport.authenticate('jwt', { session: false }),
app.get('/users', 
 function (req,res) {
  Users.find().then(function (users) {
      res.status(201).json(users);
    })
    .catch(function (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});


// Allows users to update their user info
app.put('/users/:id', passport.authenticate('jwt', { session: false }),
(req, res) =>{
  // check the validation object for errors
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  let hashedPassword = Users.hashPassword(req.body.Password);

    // Checks whether object with same username as indicated in the requestURL has been found
    Users.findOneAndUpdate(
      { Username: req.params.id },
      {
        $set: {
          Username: req.body.Username,
          Password: hashedPassword,
          Email: req.body.Email,
          Birthday: req.body.Birthday
        }
      },
      // makes sure that the updated document is returned
      { new: true },
      function (err, updatedUser) {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

 // Add a movie to a user's list of favorites
app.post('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }),
 (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username }, {
     $push: { FavoriteMovies: req.params.MovieID }
   },
   { new: true }, // This line makes sure that the updated document is returned
  (err, updatedUser) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error: ' + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// (DELETE)Allows users to remove a movie from their favourites
app.delete('/users/:Username/movies/:MovieID', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username },
    {
      $pull:
        { FavoriteMovies: req.params.MovieID }
    },
    { new: true },
    (err, updatedUser) => {
      if (err) {
        console.error(err);
        res.status(500).send('Error' + err);
      } else {
        res.json(updatedUser);
      }
    });
});

// Delete a user by usernamepassport.authenticate('jwt', { session: false }),
app.delete('/users/:Username',
 (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if (!user) {
        res.status(400).send(req.params.Username + ' was not found');
      } else {
        res.status(200).send(req.params.Username + ' was deleted.');
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error: ' + err);
    });
});

// listen for requests
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0',() => {
 console.log('Listening on Port ' + port);
});



