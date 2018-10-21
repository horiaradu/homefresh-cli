const ip = require("ip");
const fetch = require("node-fetch");
// const API_URL = "https://api.homefresh.ro/v1";
const API_URL = "http://api.homefresh.local:3000/v1";

module.exports = {
  getProducts() {
    return fetch(`${API_URL}/product-days.json`).then(response => response.json());
  },

  getDeliveryCities() {
    return fetch(`${API_URL}/delivery-cities.json`).then(response => response.json());
  },

  getPickupLocations() {
    return fetch(`${API_URL}/pickup-locations.json`).then(response => response.json());
  },

  async createOrder(body) {
    const createResponse = await fetch(`${API_URL}/orders.json`, {
      method: "post",
      body: JSON.stringify(body),
      headers: { "Content-Type": "application/json" },
    });
    const createJson = await createResponse.json();
    const orderToken = createResponse.headers.get("Order-Token");
    const id = createJson.order.id;
    return fetch(`${API_URL}/orders/${id}.json`, {
      method: "patch",
      body: JSON.stringify({ ...createJson, finalize_order: true }),
      headers: { "Content-Type": "application/json", "Order-Token": orderToken },
    });
  },
};
