var express = require('express');
var router = express.Router();

const EpisodeModel = require('../models/episode');

/* GET home page. */
router.get('/', function (req, res, next) {
  EpisodeModel.find((_error, episodes) => {
    res.status(200).json(episodes);
  });
});

module.exports = router;
