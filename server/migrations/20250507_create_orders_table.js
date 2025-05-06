exports.up = function(knex) {
  return knex.schema.createTable('orders', table => {
    table.increments('id').primary();
    table.integer('user_id').references('id').inTable('users').onDelete('SET NULL');
    table.string('payment_intent_id');
    table.enum('status', ['pending', 'processing', 'completed', 'cancelled', 'refunded']).defaultTo('pending');
    table.decimal('total_amount', 10, 2).notNullable();
    table.jsonb('shipping_address');
    table.jsonb('items').notNullable();
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('orders');
};