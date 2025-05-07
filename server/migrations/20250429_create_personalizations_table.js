/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('personalizations', function(table) {
    table.increments('id').primary();
    table.integer('product_id').notNullable().references('id').inTable('products').onDelete('CASCADE');
    table.integer('template_id').references('id').inTable('design_templates').onDelete('CASCADE');
    table.text('custom_text');
    table.jsonb('text_options'); // Stores font, size, color, position as JSON
    table.string('preview_url'); // URL to the generated preview image
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('personalizations');
};