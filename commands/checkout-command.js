const { createOrder } = require("../api/api");

module.exports = class CheckoutCommand {
  constructor(order) {
    this.order = order;
  }

  run() {
    const payload = {
      order: {
        accept_tos: true,
        email: this.order.email,
        first_name: this.order.first_name,
        last_name: this.order.last_name,
        phone: this.order.phone,
        send_newsletter: false,
        order_days_attributes: this.productsPayload(),
      },
    };

    return createOrder(payload);
  }

  productsPayload() {
    return Object.keys(this.order.products).map(day => {
      const data = this.orderDayPayload(day);
      const order_day_products_attributes = this.order.products[day].reduce((acc, { id }) => {
        const existing = acc.find(({ product_id }) => product_id === id);
        if (existing) {
          existing.quantity += 1;
        } else {
          acc.push({ product_id: id, quantity: 1 });
        }
        return acc;
      }, []);

      return { ...data, order_day_products_attributes };
    });
  }

  orderDayPayload(day) {
    return {
      day,
      delivery_city_id: this.order.delivery_city_id,
      delivery_option: this.order.delivery_option,
      delivery_city_id: this.order.delivery_city_id,
      delivery_interval: this.order.delivery_interval,
      office_address: this.order.office_address,
    };
  }

  static run(order) {
    return new CheckoutCommand(order).run();
  }
};
