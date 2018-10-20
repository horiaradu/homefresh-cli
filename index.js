const program = require("commander");
const package = require("./package.json");

program.version(package.version).description(package.description);

program
  .command("tomorrow [count]")
  .alias("t")
  .description("Order packages for tomorrow")
  .action((count = 1) => {
    console.log(count);
  });

program.parse(process.argv);
