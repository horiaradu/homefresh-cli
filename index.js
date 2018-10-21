const program = require("commander");
const package = require("./package.json");
const { OrderCommand, CheckoutCommand } = require("./commands");

const { promisify } = require("util");
const figlet = promisify(require("figlet"));

const ora = require("ora");

const { getProducts, getDeliveryCities, getPickupLocations } = require("./api/api");

const { from, forkJoin } = require("rxjs");
const { switchMap, catchError, reduce, tap } = require("rxjs/operators");

figlet("Homefresh")
  .then(data => {
    console.log(data);

    program.version(package.version).description(package.description);

    program
      .command("order")
      .alias("o")
      .description("Order packages!")
      .action(() => {
        const menuLoader = ora("Loading menu").start();
        const products$ = from(getProducts());
        const cities$ = from(getDeliveryCities());
        const pickups$ = from(getPickupLocations());

        forkJoin(products$, cities$, pickups$).subscribe(([products, cities, pickups]) => {
          menuLoader.stop();
          return OrderCommand.run(products, cities, pickups).subscribe(async order => {
            const submitLoader = ora("Placing your order").start();
            await CheckoutCommand.run(order);
            return submitLoader.stop();
          });
        });
      });

    program.parse(process.argv);
  })
  .catch(e => {
    console.error(e);
  });
