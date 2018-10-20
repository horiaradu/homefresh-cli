const inquirer = require("inquirer");
const { getProducts } = require("./api/api");
const { DayPrompt, ProductsPrompt, AnotherOrderPrompt, CheckoutPrompt } = require("./prompts/index");
const { Subject, of, from } = require("rxjs");
const { switchMap, catchError, reduce } = require("rxjs/operators");
const storage = require("./storage");

module.exports = class OrderCommand {
  constructor(products) {
    this.prompts$ = new Subject();
    this.products = products;

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
      } else if (prompt.name === "email") {
        storage.data = {
          email: prompt.answer,
        };
        storage.save().then(() => this.prompts$.complete());
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

  checkout(data) {
    this.prompts$.next(new CheckoutPrompt(data).create());
  }

  static run() {
    // const products = from(getProducts());
    const products = of(require("./api/mock.json"));

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
            return {
              ...acc,
              [name]: answer,
            };
        }
      }, {}),
      catchError(e => console.error(e)),
    );
  }
};
