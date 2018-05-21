
const mongoose = require('mongoose'),
      MongooseSchema = mongoose.Schema,
      Viewer = require('mongoose-view'),

      uuid = require('uuid'),
      cmp = require('lodash');

/**
 *  definitions:
 *    Move:
 *      properties:
 *        _id:
 *          type: string
 *          description: unique id of the game
 *          required: true
 *          unique: true
 *        game_uuid:
 *          type: string
 *          description: unique id of the word
 *          required: true
 *        letter:
 *          type: string
 *          description: letter played
 *          required: true
 *        number:
 *          type: int
 *          description: move number in the game
 *        delta:
 *          type: [Indexed Letters]
 */
const MoveSchema = new MongooseSchema({

  _id: { type: String, required: true, default: uuid.v4 },

  game_uuid: { type: String, required: true },

  letter: { type: String, required: true },

  number: { type: Number },

  delta: { type: [], required: true }

});

module.exports = mongoose.model('Move', MoveSchema);



