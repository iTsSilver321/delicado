/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('design_templates').del();
  
  // Insert seed entries
  await knex('design_templates').insert([
    {
      name: 'Floral Pattern',
      description: 'Beautiful floral design perfect for bedding and table linens',
      image_url: 'https://images.unsplash.com/photo-1464983953574-0892a716854b',
      category: 'Pattern',
      applicable_products: ['Bedding', 'Table Linens']
    },
    {
      name: 'Geometric Design',
      description: 'Modern geometric patterns for a contemporary look',
      image_url: 'https://images.pexels.com/photos/1707828/pexels-photo-1707828.jpeg',
      category: 'Pattern',
      applicable_products: ['Bedding', 'Decor', 'Table Linens']
    },
    {
      name: 'Monogram Classic',
      description: 'Elegant monogram design for personalized text',
      image_url: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2',
      category: 'Monogram',
      applicable_products: ['Bedding', 'Bath', 'Table Linens']
    },
    {
      name: 'Minimalist Border',
      description: 'Simple border design for elegant personalization',
      image_url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f',
      category: 'Border',
      applicable_products: ['Bath', 'Table Linens']
    },
    {
      name: 'Kids Fun',
      description: 'Playful design for children\'s items',
      image_url: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308',
      category: 'Kids',
      applicable_products: ['Bedding', 'Bath']
    }
  ]);
};