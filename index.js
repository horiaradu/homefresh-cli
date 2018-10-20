const program = require("commander");
const package = require("./package.json");
const OrderCommand = require("./order");

const { promisify } = require("util");
const figlet = promisify(require("figlet"));

figlet("Homefresh")
  .then(data => {
    console.log(data);

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
  })
  .catch(e => {
    console.error(e);
  });
