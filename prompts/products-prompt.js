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
    console.log(this.products[day.date]);
    return this.products[day.date].map(data => ({
      ...data,
      name: `${data.name} (${data.price})`,
      value: data,
    }));
  }
};
