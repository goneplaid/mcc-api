const express = require('express');
const router = express.Router();
const {
  model,
  serializer
} = require('../models/contestant');

router.get('/contestants', async (req, res, next) => {
  const cursor = model.find({}).cursor();
  const contestants = [];

  for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
    debugger;

    console.log(doc);
  }

  const contestants = serializer.serialize(model);

  res.send(contestants);
});

module.exports = router;



