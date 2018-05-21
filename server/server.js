
const args            = require('minimist')(process.argv.slice(2)),

      express         = require('express'),
      cors            = require('cors'),
      mongoose        = require('mongoose'),
      winston         = require('winston'),
      expressWinston  = require('express-winston'),

      userRoute       = require('./routes/auth.route.js'),
      gameRoute       = require('./routes/game.route.js'),

      User            = require('./models/user.model.js');

const server = express();

server.use(cors());

server.use(expressWinston.logger({
  msg: "HTTP {{req.method}} {{req.url}}",
  level: "info",
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    })
  ]
}));

mongoose.connect(
  `mongodb://${args.db_address || "localhost"}:${args.db_port || 10443}/${args.db_database || "hangman-database"}`
);

server.use('/auth', userRoute);
server.use('/game', gameRoute);

server.listen(
  args.port || 9443,
  () => { console.log(`hangman-server: localhost:${args.port || 9443}`)}
);




