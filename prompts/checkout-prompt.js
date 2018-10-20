module.exports = class CheckoutPrompt {
  constructor(data) {
    this.data = data;
  }

  create() {
    return {
      type: "input",
      name: "email",
      default: this.data.email,
    };
  }
};
