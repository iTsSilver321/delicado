exports.seed = async function(knex) {
    // Clean the products table first
    await knex('products').del();
    
    // Insert seed entries
    await knex('products').insert([
      {
        name: 'Luxury Cotton Bedsheet Set',
        description: 'Premium 400 thread count cotton bed sheets with 2 pillowcases. Experience hotel-quality comfort.',
        price: 89.99,
        category: 'Bedding',
        image_url: 'https://images.pexels.com/photos/6412473/pexels-photo-6412473.jpeg',
        stock: 50,
        dimensions: 'Queen - 90" x 102"',
        material: '100% Egyptian Cotton',
        care: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Plush Bath Towel Set',
        description: 'Set of 4 ultra-soft cotton bath towels. Highly absorbent and quick-drying.',
        price: 45.99,
        category: 'Bath',
        image_url: 'https://images.pexels.com/photos/12679/pexels-photo-12679.jpeg',
        stock: 75,
        dimensions: '30" x 58"',
        material: '100% Turkish Cotton',
        care: 'Machine wash warm, tumble dry medium'
      },
      {
        name: 'Decorative Throw Pillows',
        description: 'Set of 2 elegant throw pillows with removable covers. Perfect for your living room or bedroom.',
        price: 34.99,
        category: 'Decor',
        image_url: 'https://images.pexels.com/photos/1248583/pexels-photo-1248583.jpeg',
        stock: 30,
        dimensions: '18" x 18"',
        material: 'Cover: 100% Linen, Fill: Polyester',
        care: 'Cover machine washable, spot clean insert'
      },
      {
        name: 'Classic White Tablecloth',
        description: 'Elegant white tablecloth, perfect for formal dining or everyday use.',
        price: 29.99,
        category: 'Table Linens',
        image_url: 'https://images.pexels.com/photos/8245686/pexels-photo-8245686.jpeg',
        stock: 40,
        dimensions: '60" x 120"',
        material: '100% Cotton',
        care: 'Machine wash cold, iron as needed'
      },
      {
        name: 'Embroidered Hand Towels',
        description: 'Set of 2 hand towels with delicate embroidery. Adds a touch of luxury to your bathroom.',
        price: 19.99,
        category: 'Bath',
        image_url: 'https://images.pexels.com/photos/6127450/pexels-photo-6127450.jpeg',
        stock: 60,
        dimensions: '16" x 28"',
        material: '100% Cotton',
        care: 'Machine wash warm, gentle cycle'
      },
      {
        name: 'Personalized Kids Pillowcase',
        description: 'Soft pillowcase with customizable name embroidery for kids.',
        price: 24.99,
        category: 'Bedding',
        image_url: 'https://images.pexels.com/photos/4108797/pexels-photo-4108797.jpeg',
        stock: 35,
        dimensions: '20" x 30"',
        material: '100% Microfiber',
        care: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Floral Print Duvet Cover',
        description: 'Vibrant floral print duvet cover to brighten up your bedroom.',
        price: 59.99,
        category: 'Bedding',
        image_url: 'https://images.pexels.com/photos/6207464/pexels-photo-6207464.jpeg',
        stock: 25,
        dimensions: 'Full/Queen',
        material: '100% Cotton',
        care: 'Machine wash cold, gentle cycle'
      },
      {
        name: 'Waffle Weave Blanket',
        description: 'Lightweight and cozy waffle weave blanket for all seasons.',
        price: 39.99,
        category: 'Bedding',
        image_url: 'https://images.pexels.com/photos/6630900/pexels-photo-6630900.jpeg',
        stock: 45,
        dimensions: '50" x 70"',
        material: '60% Cotton, 40% Polyester',
        care: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Modern Geometric Table Runner',
        description: 'Chic table runner with a modern geometric pattern.',
        price: 17.99,
        category: 'Table Linens',
        image_url: 'https://images.pexels.com/photos/20428215/pexels-photo-20428215.jpeg',
        stock: 55,
        dimensions: '14" x 72"',
        material: '100% Polyester',
        care: 'Spot clean only'
      },
      {
        name: 'Holiday Plaid Napkin Set',
        description: 'Set of 6 festive plaid napkins for holiday gatherings.',
        price: 22.99,
        category: 'Table Linens',
        image_url: 'https://www.dotandarmy.com/cdn/shop/files/christmas_napkins_800x.jpg?v=1694343255',
        stock: 70,
        dimensions: '18" x 18"',
        material: '100% Cotton',
        care: 'Machine wash cold, tumble dry low'
      },
      {
        name: 'Organic Bamboo Bathrobe',
        description: 'Luxurious and eco-friendly bamboo bathrobe, ultra-soft and absorbent.',
        price: 54.99,
        category: 'Bath',
        image_url: 'https://luxurybamboobedding.com/images/linked-images-hr/bath-robe-group.jpg',
        stock: 20,
        dimensions: 'One Size Fits Most',
        material: '70% Bamboo, 30% Cotton',
        care: 'Machine wash cold, gentle cycle'
      },
      {
        name: 'Kids Animal Hooded Towel',
        description: 'Fun and cozy hooded towel for kids, available in multiple animal designs.',
        price: 27.99,
        category: 'Bath',
        image_url: 'https://cb.scene7.com/is/image/Crate/HoodedKdTwlGiraffeSSS24/$web_plp_card_mobile$/240201144540/giraffe-organic-cotton-hooded-kids-towel.jpg',
        stock: 38,
        dimensions: '24" x 48"',
        material: '100% Cotton',
        care: 'Machine wash warm, tumble dry medium'
      },
      {
        name: 'Velvet Decorative Cushion',
        description: 'Plush velvet cushion for a touch of elegance in any room.',
        price: 32.99,
        category: 'Decor',
        image_url: 'https://images.pexels.com/photos/776120/pexels-photo-776120.jpeg',
        stock: 28,
        dimensions: '20" x 20"',
        material: 'Velvet cover, polyester fill',
        care: 'Spot clean only'
      }
    ]);
  };
  