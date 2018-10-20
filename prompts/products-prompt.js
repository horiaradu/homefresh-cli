module.exports = class ProductsPrompt {
  constructor(products) {
    this.products = products;
  }

  create() {
    return {
      type: "list",
      name: "product",
      choices: this.choices.bind(this),
    };
  }

  choices({ day }) {
    return this.products[day.date].map(data => ({
      ...data,
      value: data,
    }));
  }
};
