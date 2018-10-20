const moment = require("moment");

module.exports = class DayPrompt {
  constructor() {
    this.MAPPING = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
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
    let day = this.today();
    if (day == 5 || day == 6) return [];

    if (day == 7) day = 0;
    return this.MAPPING.filter((_, idx) => idx >= day).map(name => ({
      name,
      value: {
        name,
        date: this.convertDayToDate(name),
      },
    }));
  }

  defaultChoice() {
    const tomorrow = this.today() + 1;
    return this.MAPPING[tomorrow - 1];
  }

  convertDayToDate(day) {
    const result = moment().day(day);
    if (this.today() >= result.day()) return result.add(7, "days");
    return result;
  }

  today() {
    // return moment().day(); // 1 - 7
    return 7;
  }
};
