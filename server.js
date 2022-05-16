const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// setup express app
const app = express();

// connect to mongodb
mongoose.connect('mongodb://chanduyadav_fc:kingofhell123@cluster0-shard-00-00.mezei.mongodb.net:27017,cluster0-shard-00-01.mezei.mongodb.net:27017,cluster0-shard-00-02.mezei.mongodb.net:27017/test?replicaSet=atlas-zo1m32-shard-0&ssl=true&authSource=admin');
mongoose.Promise = global.Promise;

app.use(bodyParser.json());

// port
const port = 8000;

// initialize routes
app.use(express.Router().get('/', (req, res) => {res.send('<h1>Hotel Booking System</h1>');}));
app.use(express.Router().get('/api', (req, res) => {res.send('<h1>API System</h1>');}));
app.use('/api', require('./routes/hotels'));
app.use('/api', require('./routes/users'));
app.use('/api', require('./routes/bookings'));
app.use('/api', require('./routes/rooms'));

// error handling middleware
app.use((err, req, res, next) => {
    res.status(422).send({error: err.message});
});

//listen for requests
app.listen(port, () => {
    console.log(`Now listening for requests on port: ` + port)
});