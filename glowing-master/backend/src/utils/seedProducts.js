const demoProducts = [
  {
    name: "Facial Cleanser",
    description: "Gentle daily cleanser for all skin types.",
    price: 29,
    image_url: "./assets/images/product-01.jpg",
    stock: 50,
    category: "cleanser"
  },
  {
    name: "Bio-shroom Rejuvenating Serum",
    description: "Hydrating serum that helps skin glow.",
    price: 29,
    image_url: "./assets/images/product-02.jpg",
    stock: 35,
    category: "serum"
  },
  {
    name: "Coffee Bean Caffeine Eye Cream",
    description: "Refreshing eye cream to reduce puffiness.",
    price: 29,
    image_url: "./assets/images/product-03.jpg",
    stock: 40,
    category: "eye-care"
  },
  {
    name: "Mountain Pine Bath Oil",
    description: "Nourishing body oil with calming scent.",
    price: 39,
    image_url: "./assets/images/offer-banner-1.jpg",
    stock: 20,
    category: "body-care"
  }
];

const seedProducts = async (db, nextId) => {
  if (db.data.products.length > 0) return;

  db.data.products = demoProducts.map((product) => ({
    id: nextId("products"),
    ...product,
    created_at: new Date().toISOString()
  }));

  await db.write();
};

module.exports = { seedProducts };
