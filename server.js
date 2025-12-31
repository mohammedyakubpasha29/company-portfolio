const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve HTML file

// MongoDB Connection (Make sure MongoDB is running locally or use Atlas URI)
mongoose.connect('mongodb://localhost:27017/alphaTechDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

// Define Schema for Contact Form
const contactSchema = new mongoose.Schema({
    name: String,
    email: String,
    message: String,
    date: { type: Date, default: Date.now }
});

const Contact = mongoose.model('Contact', contactSchema);

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle Form Submission
app.post('/submit-contact', async (req, res) => {
    try {
        const newContact = new Contact({
            name: req.body.name,
            email: req.body.email,
            message: req.body.message
        });

        await newContact.save();
        res.send("<h1>Thank you! We will contact you at " + req.body.email + " shortly.</h1><a href='/'>Go Back</a>");
    } catch (err) {
        res.status(500).send("Error saving data.");
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});