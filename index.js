const program = require("commander");
const package = require("./package.json");
const OrderCommand = require("./order");

program.version(package.version).description(package.description);

program
  .command("order")
  .alias("o")
  .description("Order packages!")
  .action(() => {
    OrderCommand.run().subscribe(x => {
      console.log("final answer: ", x);
    });
  });

program.parse(process.argv);
