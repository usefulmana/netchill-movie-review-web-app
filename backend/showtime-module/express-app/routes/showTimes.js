const ShowTimes = require('../models/ShowTimes')
const express = require('express');

const router = express.Router();

router.get('/:movie_name/:date/:theater?', (req, res) => {
    console.log(req.params)
    if(!req.params.theater){
        ShowTimes.find({
            movieName: { $regex: req.params.movie_name, $options: 'i' },
            date: req.params.date
        }, (err, results) => {
            if (err) {
                res.send("Something is wrong")
            }
            res.json(results)
        })
    }
    else {
        ShowTimes.find({
            movieName: { $regex: req.params.movie_name, $options: 'i' },
            date: req.params.date,
            theaterName: { $regex: req.params.theater, $options: 'i' }
        },(err, results) => {
            if (err) {
                res.send("Something is wrong")
            }
                res.json(results)
        })
    }
   

})


module.exports = router;
