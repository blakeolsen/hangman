
const mongoose = require('mongoose'),
      MongooseSchema = mongoose.Schema,
      Viewer = require('mongoose-view'),

      uuid = require('uuid'),

      Game = require('../models/game.model')
      Solution = require('../models/solution.model');

/**
 *  definitions:
 *    User:
 *      properties:
 *        _id:
 *          type: string
 *          required: true
 *          description: unique id of the user
 *        username:
 *          type: string
 *          required: true
 *          description: user's name
 *        create_date:
 *          type: date
 *          description: date the user was created
 *        games_played:
 *          type: int
 *          description: number of games played
 *        games_won:
 *          type: int
 *          description: number of games played and won
 */
const UserSchema = new MongooseSchema({

  _id: { type: String, required: true, default: uuid.v4 },

  username: { type: String, required: true, unique: true },

  password: { type: String, required: true },

  create_date: { type: Date, default: Date.now }

});

/**
 *  :def: create a new game from a user
 *  :param user_uuid: game owner user
 */
UserSchema.methods.game = function (done) {
  Solution.findOneRandom((err, solution) => {
    if (err) return done(err);
    
    Game.create({
      user_uuid: this._id,
      word_uuid: solution._id,
      view: solution.initial
    }, done);
  });
};

module.exports = mongoose.model('User', UserSchema);




