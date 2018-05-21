
const router    = require('express').Router(),
      auth      = require('http-auth'),
      
      User      = require('../models/user.model');

/**
 *  :param req: request object
 *  :param res: response object
 *  :param next: continue if authenticated
 */
const authenticate = auth.connect(auth.basic({ realm: "hangman" }, (username, password, next) => {
  User.create({ username: username, password: password }, (err, user) => {
    console.log(err)
    console.log(user)
    next(!err);
  });
}));

/**
 *  /auth:
 *    post:
 *      description: create a new user
 *      tags:
 *        - User
 *      produces:
 *        - application/json
 *      responses:
 *        200:
 *          description: view of user
 *          schema:
 *            $ref: '#/definitions/User'
 *        500:
 *          description: failed to create new user
 */
router.post('/', authenticate, (req, res) => {
  User.findOne({ username: req.user }, (err, user) => {
    if (err || !user) return res.status(500).send(err);
    res.status(200).send(user);
  });
});

module.exports = router;