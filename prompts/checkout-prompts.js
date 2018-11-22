module.exports = class CheckoutPrompts {
  constructor(userData, cities, pickups) {
    this.userData = userData;
    this.cities = cities;
    this.pickups = pickups;
  }

  validator(inputName) {
    return value => (value.length ? true : `Please supply your ${inputName}`);
  }

  create() {
    const cityChoices = this.cities.map(city => ({ name: city.name, value: city }));
    const pickupChoices = this.pickups.map(pickup => ({
      name: pickup.name,
      value: { id: pickup.id, name: pickup.name },
    }));
    return [
      { type: "input", name: "email", default: this.userData.email, validate: this.validator("email") },
      { type: "input", name: "first_name", default: this.userData.first_name, validate: this.validator("first name") },
      { type: "input", name: "last_name", default: this.userData.last_name, validate: this.validator("last name") },
      { type: "input", name: "phone", default: this.userData.phone, validate: this.validator("phone") },
      {
        type: "list",
        name: "delivery_city",
        choices: cityChoices,
        default: cityChoices[0],
      },
      { type: "list", name: "delivery_option", choices: ["office", "pickup"], default: "office" },
      {
        type: "input",
        name: "office_address",
        default: this.userData.office_address,
        when: ({ delivery_option }) => delivery_option === "office",
        validate: this.validator("office address"),
      },
      {
        type: "list",
        name: "pickup_location",
        choices: pickupChoices,
        default: pickupChoices[0],
        when: ({ delivery_option }) => delivery_option === "pickup",
        validate: this.validator("pickup address"),
      },
      { type: "confirm", name: "confirm", message: "Are you sure you want to order?", default: true },
    ];
  }
};
