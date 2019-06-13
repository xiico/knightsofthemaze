var express = require('express');
var router = express.Router();
var Player = require('../models/player');

/* GET home page. */
router.get('/', function(req, res, next) {
  Player.findOne({}, function (err, player) {
    if (err) res.render('index', { title: `Knights of the maze home page - ${"Ops!"}` });
    res.render('index', { title: `Knights of the maze home page - ${player.name}` });
  });
});

module.exports = router;
