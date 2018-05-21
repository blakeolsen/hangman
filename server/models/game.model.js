
const mongoose        = require('mongoose'),
      MongooseSchema  = mongoose.Schema,
      Viewer          = require('mongoose-view'),

      Move            = require('../models/move.model'),
      Solution        = require('../models/solution.model'),

      uuid            = require('uuid'),
      cmp             = require('lodash');

/**
 *  definitions:
 *    Game:
 *      properties:
 *        _id:
 *          type: string
 *          description: unique id of the game
 *          required: true
 *          unique: true
 *        user_uuid:
 *          type: string
 *          description: unique id of the user
 *          required: true
 *        word_uuid:
 *          type: string
 *          description: unique id of the word
 *          required: true
 *        history:
 *          type: object
 *          schema:
 *            $ref: '#/definitions/Move'
 *          description: history of moves played
 *          required: true
 */
const GameSchema = new MongooseSchema({

  _id: { type: String, required: true, default: uuid.v4 },

  user_uuid: { type: String, required: true },

  word_uuid: { type: String, required: true },

  lives: { type: Number, required: true, default: () => 10 },

  history: { type: [], required: true, default: () => [] }

});

/**
 *  :def: perform a move
 *  :param letter: letter to be played
 *  :param done: 
 */
GameSchema.methods.move = function(letter, done) {
  const game = this;

  // Error if there are no more lives remaining
  if (game.lives == 0)
    return done(400, {"message": "no more lives remaining"})
  // Ensure Letter Exists, Is A Character, Has Not Been Guessed
  else if (!letter || letter.length != 1 || game.history.map(m => m.letter).includes(letter)) 
    return done(405, {"message": "invalid entry"});

  Solution.findById(this.word_uuid, (err, solution) => {
    if (err) 
      return done(500, err);

    // Create A New Move Summerizing The Move
    Move.create({
      game_uuid:  game._id,
      letter:     letter,
      number:     game.history.length + 1,
      delta:      solution.solution
                    .map(function(l, i) { return [l, i] })
                    .filter(l => l[0] == letter)
    }, (err, move) => {
      if (err)
        return done(500, err);
      else if (move.delta.length == 0)
        game.lives -= 1;

      // Add Move to Game History
      game.history.push(move);
      game.save((err) => {
        if (err) return done(500, err);
        done(200, move);
      })
    });
  });
};

const Game = mongoose.model('Game', GameSchema);

/**
 *  :def: register public view of the game
 *  :ret done: public view of the viewer (remove word)
 */
Viewer.register(Game, 'default', (game, done) => {
  done({
    _id: game._id,
    user_uuid: game.user_uuid,
    history: game.history
  });
});

module.exports = Game;







