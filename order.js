const inquirer = require("inquirer");
const { getProducts } = require("./api/api");
const { DayPrompt, ProductsPrompt, AnotherOrderPrompt } = require("./prompts/index");
const { Subject, of, from } = require("rxjs");
const { switchMap } = require("rxjs/operators");

class OrderCommand {
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
    this.prompts$.next(new DayPrompt().create());
    this.prompts$.next(new ProductsPrompt(this.products).create());
    this.prompts$.next(new AnotherOrderPrompt().create());
  }

  static run() {
    try {
      const products = from(getProducts());
      // const products = of(require("./api/mock.json"));
      return products.pipe(
        switchMap(products => {
          const productsMap = products.product_days.reduce((acc, data) => {
            if (!data.can_accept_orders) return acc;
            return Object.assign(acc, { [data.day]: data.products });
          }, {});
          return new OrderCommand(productsMap).create();
        }),
      );
    } catch (e) {
      return console.error(e);
    }
  }
}

OrderCommand.run().subscribe(x => console.log("answer: ", x));
