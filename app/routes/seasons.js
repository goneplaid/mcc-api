var express = require('express');
var router = express.Router();

const SeasonModel = require('../models/season');

/* GET home page. */
router.get('/', function (req, res, next) {
  SeasonModel.find((_error, seasons) => {
    res.status(200).json(seasons);
  });
});

module.exports = router;
