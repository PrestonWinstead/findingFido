// Npm packages
const express = require('express');

require('dotenv').config();

const bodyParser = require('body-parser');

const fileUpload = require('express-fileupload');

const cloudinary = require('cloudinary');

const jwt = require('express-jwt');

const jwks = require('jwks-rsa');

const cors = require('cors');

const axios = require('axios');

// Local files
const Message = require('./models/Message');

const User = require('./models/User');

const Pet = require('./models/Pet');

const Photo = require('./models/Photo');

const Activity = require('./models/Activity');

const ToDoList = require('./models/ToDoList');

const Review = require('./models/Review');

const google = require('./config/googlemaps.api');

const cloud = require('./config/cloudinary.api');

const app = express();

// Check for environment variables, set port accordingly
const port = process.env.NODE_ENV === 'development' ? 9000 : 80;


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(fileUpload());

app.use(cors());

cloudinary.config({
  cloud_name: 'derywsrky',
  api_key: cloud.token,
  api_secret: cloud.secret,
});

const authCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://findo.auth0.com/.well-known/jwks.json',
  }),
  audience: 'http://159.89.41.217',
  issuer: 'https://findo.auth0.com/',
  algorithms: ['RS256'],
});

// Need this to serve our bundled index.html
// app.use(express.static(`${__dirname}/dist`));
app.get('/', (req, res) => {
  app.use(express.static('/', authCheck, `${__dirname}/dist`));
  res.sendFile(`${__dirname}/dist`);
});

// Need this to serve the logo picture
// app.use(express.static(`${__dirname}/client/assets`));
// const checkScopes = jwt(['read:messages']);

app.get('/callback', authCheck, (req, res) => {
  res.redirect('/dashboard');
});

// Takes in information about the pet, puts it in a pet table with a link to the user
app.post('/petSignup', (req, res) => {
  const userEmail = req.body.profile.email;
  const {
    kind,
    name,
    characteristics,
    place,
  } = req.body;
  Pet.createPet(name, kind, characteristics, place, userEmail, (err, pet) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(pet);
    }
  });
});

// Creates a new user
app.post('/personSignup', (req, res) => {
  const { email } = req.body.profile;
  const {
    name,
    address,
    city,
    state,
    zip,
    extra,
  } = req.body;
  User.createUser(name, email, address, city, state, zip, extra, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(response);
    }
  });
});

// Updates profile information
app.put('/profile', (req, res) => {
  const userEmail = req.body.profile.email;
  const { updateKey, updateValue } = req.headers;
  User.updateUser(userEmail, updateKey, updateValue, (err, updated) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(201).send(updated);
    }
  });
});

// Deletes a profile
app.delete('/profile', (req, res) => {
  const userEmail = req.body.profile.email;
  User.deleteUser(userEmail, (err, result) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(202).send(result);
    }
  });
});

// Saves chat messages to the database
app.post('/chat', (req, res) => {
  const userEmail = req.body.profile.email;
  const { text } = req.body;
  // Store message in databse
  Message.createMessage(text, userEmail, (err, result) => {
    // Send message to both users, using socket.io
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(result);
    }
  });
});

// Saves reviews to the database
app.post('/review', (req, res) => {
  const userEmail = req.body.profile.email;
  const {
    punctuality,
    friendliness,
    overall,
    comments,
  } = req.body;
  Review.createReview(userEmail, punctuality, friendliness, overall, comments, (err, review) => {
    if (err) {
      console.error(err);
      res.status(404).send(err);
    } else {
      res.status(201).send(review);
    }
  });
});

// Write route to get activities at a certain time for the schedule component
app.get('/activities/:date', (req, res) => {
  const time = req.params.date;
  Activity.getActivitiesByTime(time, (err, activities) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(activities);
    }
  });
});

// Adds an activity to the database
app.post('/activities', (req, res) => {
  const userEmail = req.body.profile.email;
  const {
    location,
    time,
    date,
  } = req.body;
  Activity.createActivity(userEmail, location, time, date, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(result);
    }
  });
});

// Adds a to do to the database
app.post('/todo', (req, res) => {
  const userEmail = req.body.profile.email;
  const {
    location,
    time,
    date,
    emailPerson,
  } = req.body;
  ToDoList.createToDoList(userEmail, location, time, date, emailPerson, (err, result) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.status(201).send(result);
    }
  });
});

app.get('/todo/:id', (req, res) => {
  const email = req.params.id;
  ToDoList.getUserToDoList(email, (err, todolist) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(todolist);
    }
  });
});

// Sends information to fill out the individual dashboard person dashboard and pet dashboard
app.get('/dashboard/:email', (req, res) => {
  const userEmail = req.params.email;
  // Gets user information based on email
  User.getUser(userEmail, (err, userInfo) => {
    if (err) console.error(err);
    // Gets pet information based on returned user id
    Pet.getPet(userEmail, (error, petInfo) => {
      if (error) console.error(error);
      // Gets activities for that user
      Activity.getUserActivities(userEmail, (er, activities) => {
        if (er) console.error(er);

        // Puts them in object and sends to user
        const result = { userInfo, petInfo, activities };
        res.status(200).send(result);
      });
    });
  });
});

// Populate the person dashboard
app.get('/PersonDashboard/:email', (req, res) => {
  const userEmail = req.params.email;
  User.getUser(userEmail, (err, userInfo) => {
    if (err) console.error(err);
    ToDoList.getUserToDoList(userEmail, (er, todolist) => {
      if (er) console.error(er);
      Activity.getUserActivities(userEmail, (error, activities) => {
        if (error) console.error(error);
        const result = { userInfo, todolist, activities };
        res.status(200).send(result);
      });
    });
  });
});

// Populate the user profile page
app.get('/userProfile/:email', (req, res) => {
  const userEmail = req.params.email;
  // Gets user information based on email
  User.getUser(userEmail, (err, userInfo) => {
    if (err) console.error(err);
    // Gets pet information based on returned user id
    Pet.getPet(userEmail, (error, petInfo) => {
      if (error) console.error(error);
      // Gets photos for that user
      Photo.findUserPhotos(userEmail, (er, photos) => {
        if (er) console.error(er);
        // Puts them in object and sends to user
        const result = { userInfo, petInfo, photos };
        res.status(200).send(result);
      });
    });
  });
});

// Populate the pet dashboard
app.get('/petDashboard/:id', (req, res) => {
  const petId = req.params.id;
  Pet.getPetId(petId, (err, pet) => {
    if (err) {
      res.status(404).send(err);
    } else {
      res.status(200).send(pet);
    }
  });
});

// Recieves a file upload, adds it to cloudinary, then adds to the database
app.post('/photos*', (req, res) => {
  // The format of the incoming file is a bit weird, has to be encoded to base64
  const newPhoto = req.files['uploads[]'].data.toString('base64');
  const type = req.files['uploads[]'].mimetype;
  const userEmail = req.params[0];
  // Uploads to cloudinary
  cloudinary.v2.uploader.upload(`data:${type};base64,${newPhoto}`, (err, photo) => {
    if (err) {
      res.status(400).send(err);
    } else {
      // The url in Cloudinary's response is put into the database for use
      Photo.addPhoto(photo.url, userEmail, (error, response) => {
        if (error) {
          res.status(500).send(error);
        } else {
          // The new photo entry is sent back to the client to be rendered
          res.status(201).send(response);
        }
      });
    }
  });
});

// Gets user photos for their profile page
app.get('/photos/:email', (req, res) => {
  const userEmail = req.params.email;
  Photo.findUserPhotos(userEmail, (er, photos) => {
    if (er) console.error(er);
    // Gets activities for that user
    Activity.getUserActivities(userEmail, (error, activities) => {
      if (error) console.error(error);
      // Puts them in object and sends to user
      const result = { photos, activities };
      res.status(200).send(result);
    });
  });
});

// Gets the lat/long location for the map. Not used, but leaving so that maps can show circles
app.post('/map', (req, res) => {
  const { location } = req.body;
  axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location},+New+Orleans,+LA&key=${google.token}`)
    .then(response => res.status(200).send(response.data.results[0].geometry.location))
    .catch(err => res.status(500).send(err));
});

// Open our connection
app.listen(port, () => {
  console.log(`App is listening on ${port}`);
});
