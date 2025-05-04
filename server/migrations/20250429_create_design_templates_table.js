/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('design_templates', function(table) {
    table.increments('id').primary();
    table.string('name').notNullable();
    table.text('description');
    table.string('image_url').notNullable();
    table.string('category').notNullable();
    table.specificType('applicable_products', 'text[]').notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTable('design_templates');
};