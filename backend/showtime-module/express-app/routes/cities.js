const Cities = require('../models/Cities')
const express = require('express');

const router = express.Router();

// Get all Cities

router.get('/', (req, res) => {
    Cities.find({}, (err, data) => {
        if (err){
            res.send("Something is wrong")
        }
        res.json(data)
    })
})

module.exports = router;