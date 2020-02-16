var express = require('express');
var router = express.Router();

const ChallengeModel = require('../models/challenge');

/* GET home page. */
router.get('/', function (req, res, next) {
  ChallengeModel.find((_error, challenges) => {
    res.status(200).json(challenges);
  });
});

module.exports = router;
