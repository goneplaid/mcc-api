var express = require('express');
var router = express.Router();

const ContestantModel = require('../models/contestant');

/* GET home page. */
router.get('/', function (req, res, next) {
  ContestantModel.find((_error, contestants) => {
    res.status(200).json(contestants);
  });
});

module.exports = router;
