module.exports = class AnotherOrderPrompt {
  create() {
    return {
      type: "list",
      name: "anotherOrder",
      message: "Do you want to order another product?",
      choices: [{ name: "Yes", value: true }, { name: "No", value: false }],
      default: false,
    };
  }
};
