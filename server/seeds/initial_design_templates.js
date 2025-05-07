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
      image_url: 'https://images.squarespace-cdn.com/content/v1/6096fe964208c322b59e9941/238476f4-dc98-4cc9-946b-e32132e92094/Hibiscus+small+repeat.jpg',
      category: 'Pattern',
      applicable_products: ['Bedding', 'Table Linens']
    },
    {
      name: 'Geometric Design',
      description: 'Modern geometric patterns for a contemporary look',
      image_url: 'https://as1.ftcdn.net/jpg/04/28/96/68/1000_F_428966849_q9hG9ss9Pm0CPR3F343nJ3Wn06kXyGre.jpg',
      category: 'Pattern',
      applicable_products: ['Bedding', 'Decor', 'Table Linens']
    },
    {
      name: 'Monogram Classic',
      description: 'Elegant monogram design for personalized text',
      image_url: 'https://i.pinimg.com/originals/f4/15/32/f415326b25ca6786e346c2cc15e5550f.jpg',
      category: 'Monogram',
      applicable_products: ['Bedding', 'Bath', 'Table Linens']
    },
    {
      name: 'Minimalist Border',
      description: 'Simple border design for elegant personalization',
      image_url: 'https://st2.depositphotos.com/1000553/7686/v/950/depositphotos_76860069-stock-illustration-modern-border-folder-design-template.jpg',
      category: 'Border',
      applicable_products: ['Bath', 'Table Linens']
    },
    {
      name: 'Kids Fun',
      description: 'Playful design for children\'s items',
      image_url: 'https://thumbs.dreamstime.com/b/kids-toys-seamless-pattern-1-27472516.jpg',
      category: 'Kids',
      applicable_products: ['Bedding', 'Bath']
    }
  ]);
};
