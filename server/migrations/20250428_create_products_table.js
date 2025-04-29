exports.up = function(knex) {
    return knex.schema.createTable('products', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.text('description').notNullable();
      table.decimal('price', 10, 2).notNullable();
      table.string('category').notNullable();
      table.string('image_url').notNullable();
      table.integer('stock').notNullable().defaultTo(0);
      table.string('dimensions');
      table.string('material');
      table.string('care');
      table.timestamps(true, true);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTable('products');
  };