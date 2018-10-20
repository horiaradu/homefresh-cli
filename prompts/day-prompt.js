const moment = require("moment");

module.exports = class DayPrompt {
  constructor(products) {
    this.availableDates = Object.keys(products).filter(day => products[day].length);
  }

  create() {
    return {
      type: "list",
      name: "day",
      choices: this.choices(),
      message: "For what day do you want to order?",
      default: this.defaultChoice(),
    };
  }

  choices() {
    return this.availableDates.map(date => {
      const day = moment(date, "YYYY-MM-DD").day();
      const name = moment.weekdays(day);
      return {
        name,
        value: { name, date },
      };
    });
  }

  defaultChoice() {
    return this.choices()[0];
  }
};
