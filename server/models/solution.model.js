
const mongoose = require('mongoose'),
      MongooseSchema = mongoose.Schema,
      MongooseRandom = require('mongoose-simple-random'),

      uuid = require('uuid');

/**
 *  definitions:
 *    Solution:
 *      properties:
 *        _id:
 *          type: string
 *          string: sysId of the solution
 *          required: true
 *          unique: true
 *        solution:
 *          type: string
 *          string: solution to the entry
 *          required: true
 *          unique: true
 */
const SolutionSchema = new MongooseSchema({

  _id: { type: String, required: true, default: uuid.v4 },

  solution: { type: [String], required: true },

  initial: { type: [String], required: true }

});
SolutionSchema.plugin(MongooseRandom);

module.exports = mongoose.model('Solution', SolutionSchema);