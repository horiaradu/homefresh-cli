const program = require("commander");
const package = require("./package.json");
const { OrderCommand, CheckoutCommand } = require("./commands");

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
        OrderCommand.run().subscribe(order => {
          CheckoutCommand.run(order);
        });
      });

    program.parse(process.argv);
  })
  .catch(e => {
    console.error(e);
  });
