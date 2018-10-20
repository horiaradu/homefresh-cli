const inquirer = require("inquirer");
const { getProducts } = require("./api");
const { DayPrompt, ProductsPrompt, AnotherOrderPrompt } = require("./prompts/index");

class OrderCommand {
  async create(products) {
    const answers = await inquirer.prompt([
      new DayPrompt().create(),
      new ProductsPrompt(products).create(),
      new AnotherOrderPrompt().create(),
    ]);
    console.log(answers);
    return answers;
  }

  async run() {
    try {
      // const products = await getProducts();
      const products = require("./mock.json").product_days;

      const productsMap = products.reduce((acc, data) => {
        if (!data.can_accept_orders) return acc;
        return Object.assign(acc, { [data.day]: data.products });
      }, {});

      return this.create(productsMap);
    } catch (e) {
      return console.error(e);
    }
  }
}

new OrderCommand().run();
