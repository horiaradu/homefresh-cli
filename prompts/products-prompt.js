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
    const key = day.date.format("YYYY-MM-DD");
    return this.products[key].map(data => ({
      ...data,
      value: data,
    }));
  }
};
