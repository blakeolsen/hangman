const router    = require('express').Router(),
      auth      = require('http-auth'),
      
      User      = require('../models/user.model'),
      Game      = require('../models/game.model');

/**
 *  :param req: request object
 *  :param res: response object
 *  :param next: continue if authenticated
 */
const authenticate = auth.connect(auth.basic({ realm: "hangman" }, (username, password, next) => {
  User.findOne({ username: username }, (err, user) => {
    next(!err && user && user.password == password);
  });
}));

/**
 *  /game:
 *    post:
 *      description: create a new game
 *      tags:
 *        - Game
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: view of a new game
 *          schema:
 *            $ref: '#/definitions/Game'
 *        401:
 *          description: Unauthorized User
 *        405:
 *          description: User not found
 *        500:
 *          description: Failed to create game
 */
router.post('/', authenticate, (req, res) => {
  User.findOne({ username: req.user }, (err, user) => {
    if (err || !user)
      return res.send(405);
    else
      user.game((err, game) => {
        if (err || !game)
          return res.send(500);
        else
          return res.send(game);
      });
  });
});

/**
 *  /game/{game_uuid}:
 *    get:
 *      description: create a new game
 *      tags:
 *        - Game
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: game_uuid
 *          description: the _id of the game
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: view of a new game
 *          schema:
 *            $ref: '#/definitions/Game'
 *        401:
 *          description: Unauthorized User
 *        405:
 *          description: User not found
 *        500:
 *          description: Failed to create game
 */
router.get('/:game_uuid', authenticate, (req, res) => {
  Game.findById(req.params.game_uuid, (err, game) => {
    if (err || !game) 
      return res.send(405);
    User.findOne({ username: req.user }, (err, user) => {
      if (err || !user)
        return res.send(401);
      res.status(200).send(game);
    });
  });
});

/**
 *  /game/{game_uuid}/{letter}:
 *    post:
 *      description: create a new game
 *      tags:
 *        - Game
 *      produces:
 *        - application/json
 *      parameters:
 *        - name: game_uuid
 *          description: the _id of the game
 *          in: path
 *          required: true
 *          type: string
 *        - name: letter
 *          description: letter being played
 *          in: path
 *          required: true
 *          type: string
 *      responses:
 *        200:
 *          description: view of a new game
 *          schema:
 *            $ref: '#/definitions/Move'
 *        401:
 *          description: Unauthorized User
 *        405:
 *          description: User not found
 *        500:
 *          description: Failed to create game
 */
router.post('/:game_uuid/:letter', authenticate, (req, res) => {
  Game.findById(req.params.game_uuid, (err, game) => {
    if (err || !game) 
      return res.send(405);
    User.findOne({ username: req.user }, (err, user) => {
      if (err || !user)
        return res.send(401);
      game.move(req.params.letter, (code, contents) =>{
        res.status(code).send(contents);
      });
    });
  });
});

module.exports = router;