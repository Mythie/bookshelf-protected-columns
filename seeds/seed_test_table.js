
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { name: 'Lucas', protected: 'this shouldn\'t change', address: '123 Super Street' }
      ]);
    });
};
