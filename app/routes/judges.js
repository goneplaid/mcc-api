var express = require('express');
var router = express.Router();

const JudgeModel = require('../models/judge');

/* GET home page. */
router.get('/', function (req, res, next) {
  JudgeModel.find((_error, judges) => {
    res.status(200).json(judges);
  });
});

module.exports = router;
