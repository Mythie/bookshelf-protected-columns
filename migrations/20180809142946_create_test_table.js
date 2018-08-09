
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments();
    table.string('name');
    table.string('protected');
    table.string('address');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users');
};
