module.exports = class CheckoutPrompts {
  constructor(userData, cities, pickups) {
    this.userData = userData;
    this.cities = cities;
    this.pickups = pickups;
  }

  create() {
    const cityChoices = this.cities.map(city => ({ name: city.name, value: city }));
    const pickupChoices = this.pickups.map(pickup => ({
      name: pickup.name,
      value: { id: pickup.id, name: pickup.name },
    }));
    return [
      { type: "input", name: "email", default: this.userData.email },
      { type: "input", name: "first_name", default: this.userData.first_name },
      { type: "input", name: "last_name", default: this.userData.last_name },
      { type: "input", name: "phone", default: this.userData.phone },
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
      },
      {
        type: "list",
        name: "pickup_location",
        choices: pickupChoices,
        default: pickupChoices[0],
        when: ({ delivery_option }) => delivery_option === "pickup",
      },
    ];
  }
};
