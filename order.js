const inquirer = require("inquirer");
const { getProducts } = require("./api/api");
const { DayPrompt, ProductsPrompt, AnotherOrderPrompt } = require("./prompts/index");
const { Subject, of, from } = require("rxjs");
const { switchMap, catchError, reduce } = require("rxjs/operators");

module.exports = class OrderCommand {
  constructor(products) {
    this.prompts$ = new Subject();
    this.products = products;
  }

  create() {
    const process$ = inquirer.prompt(this.prompts$).ui.process;

    process$.subscribe(answer => {
      if (answer.name === "anotherOrder") {
        if (answer.answer) {
          this.createStep();
        } else {
          this.prompts$.complete();
        }
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

  static run() {
    const products = from(getProducts());
    // const products = of(require("./api/mock.json"));

    let scanCurrentDate = null;

    return products.pipe(
      switchMap(products => {
        const productsMap = products.product_days.reduce(
          (acc, data) => ({
            ...acc,
            [data.day]: data.can_accept_orders ? data.products : [],
          }),
          {},
        );
        return new OrderCommand(productsMap).create();
      }),
      reduce((acc, prompt) => {
        const { name, answer } = prompt;
        switch (name) {
          case "day":
            scanCurrentDate = answer.date;
            return {
              ...acc,
              [scanCurrentDate]: [],
            };
          case "product":
            return {
              ...acc,
              [scanCurrentDate]: [...acc[scanCurrentDate], answer],
            };
          default:
            return acc;
        }
      }, {}),
      catchError(e => console.error(e)),
    );
  }
};
