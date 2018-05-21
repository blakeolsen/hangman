
const args      = require('minimist')(process.argv.slice(2)),
      async     = require('async'),
      solutions = require(args.file || "../test/sample.json"),

      mongoose  = require('mongoose'),
      Solution  = require('./models/solution.model');

console.log(args.file || "../test/sample.json")

mongoose.connect(
  `mongodb://${args.db_address || "localhost"}:${args.db_port || 10443}/${args.db_database || "hangman-database"}`
);

async.each(
  solutions,
  (solution, next) => { 
    Solution.create({ 
      solution: solution.split(""),
      initial: solution.split("").map((letter) => {
        if (letter == " ") 
          return " "
        else 
          return ""
      })
    }, next) 
  },
  () => {
    try { mongo.disconnect() }
    catch { }
  }
);