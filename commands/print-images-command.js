const asciify = require("asciify-image");

module.exports = class PrintImagesCommand {
  static run(products) {
    const options = {
      fit: "box",
      width: 80,
      height: 80,
    };
    const count = products.product_days.length;
    const images = products.product_days[count - 1].products.map(p => [p.name, p.thumbnail]);

    return Promise.all(
      images.map(async ([name, url]) => {
        const image = await asciify(url, options);
        return [name, image];
      }),
    ).then(data => {
      data.forEach(([name, image]) => {
        console.log(name);
        console.log(image);
        console.log("\n\n");
      });
    });
  }
};
