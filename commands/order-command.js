const inquirer = require("inquirer");
const { getProducts, getDeliveryCities, getPickupLocations } = require("../api/api");
const { DayPrompt, ProductsPrompt, AnotherOrderPrompt, CheckoutPrompts } = require("../prompts/index");
const { Subject, of, from, forkJoin } = require("rxjs");
const { switchMap, catchError, reduce, tap } = require("rxjs/operators");
const storage = require("../storage");

module.exports = class OrderCommand {
  constructor(products, cities, pickups) {
    this.prompts$ = new Subject();
    this.products = products;
    this.cities = cities;
    this.pickups = pickups;

    this.storagePromise = storage.load();
  }

  create() {
    const process$ = inquirer.prompt(this.prompts$).ui.process;

    process$.subscribe(prompt => {
      if (prompt.name === "anotherOrder") {
        if (prompt.answer) {
          this.createStep();
        } else {
          storage.load().then(({ data }) => this.checkout(data));
        }
      } else if (prompt.name === "phone") {
        this.prompts$.complete();
      }
    });

    this.createStep();

    return process$;
  }

  createStep() {
    this.prompts$.next(new DayPrompt(this.products).create());
    this.prompts$.next(new ProductsPrompt(this.products).create());
    this.prompts$.next(new AnotherOrderPrompt().create());
  }

  checkout(userData) {
    new CheckoutPrompts(userData, this.cities, this.pickups).create().forEach(p => this.prompts$.next(p));
  }

  static run() {
    const products$ = from(getProducts());
    const cities$ = from(getDeliveryCities());
    const pickups$ = from(getPickupLocations());
    // const products = of(require("../api/mock.json"));

    let scanCurrentDate = null;

    return forkJoin(products$, cities$, pickups$).pipe(
      switchMap(([products, cities, pickups]) => {
        const productsMap = products.product_days.reduce(
          (acc, data) => ({
            ...acc,
            [data.day]: data.can_accept_orders ? data.products : [],
          }),
          {},
        );
        return new OrderCommand(productsMap, cities.delivery_cities, pickups.pickup_locations).create();
      }),
      reduce(
        (acc, prompt) => {
          const { name, answer } = prompt;
          switch (name) {
            case "day":
              scanCurrentDate = answer.date;
              return {
                ...acc,
                products: {
                  ...acc.products,
                  [scanCurrentDate]: acc.products[scanCurrentDate] || [],
                },
              };
            case "product":
              return {
                ...acc,
                products: {
                  ...acc.products,
                  [scanCurrentDate]: [...acc.products[scanCurrentDate], answer],
                },
              };
            default:
              return {
                ...acc,
                [name]: answer,
              };
          }
        },
        { products: {} },
      ),
      tap(({ first_name, last_name, email, phone, office_address }) => {
        storage.data = { first_name, last_name, email, phone, office_address };
        storage.save();
      }),
      catchError(e => console.error(e)),
    );
  }
};
