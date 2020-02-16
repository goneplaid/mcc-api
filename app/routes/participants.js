var express = require('express');
var router = express.Router();

const ParticipantModel = require('../models/participant');

/* GET home page. */
router.get('/', function (req, res, next) {
  ParticipantModel.find((_error, participants) => {
    res.status(200).json(participants);
  });
});

module.exports = router;
